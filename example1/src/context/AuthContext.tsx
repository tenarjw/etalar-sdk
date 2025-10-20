import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthValuesType, UserDataType } from './types';
import { clearAllAuthRelatedStorage, TAuthToken, getAuthTokens, storeAuthTokens } from 'src/configs/auth';
import authConfig from 'src/configs/auth';
import { parseJwt } from 'src/utils/jwt';

// Funkcja sprawdzająca wygaśnięcie tokena z marginesem
function isTokenAboutToExpire(token: string, marginSeconds = 60): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  const now = Date.now() / 1000;
  return decoded.exp < now + marginSeconds;
}

const defaultAuthContext: AuthValuesType = {
  user: {
    username: '',
    email: '',
    roles: [],
    id: 1,
    role: 'admin', // obsolete
    idToken: '',
    userIdent: '',
  },
  loading: true,
  authToken: null,
  setUser: () => null,
  setAuthToken: () => null,
  setLoading: () => null,
  logout: () => Promise.resolve(),
};

export const AuthContext = createContext(defaultAuthContext);

type AuthProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<UserDataType | null>(defaultAuthContext.user);
  const [loading, setLoading] = useState<boolean>(defaultAuthContext.loading);
  const [authToken, setAuthTokenState] = useState<TAuthToken | null>(null);

  // Stabilizowana funkcja setAuthToken
  const setAuthToken = useCallback((token: TAuthToken | null) => {
    setAuthTokenState(token);
    if (token) {
      storeAuthTokens(token);
    } else {
      clearAllAuthRelatedStorage();
    }
  }, []);

  // Stabilizowana funkcja logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    setLoading(false);
  }, [setAuthToken]);

  // Stabilizowana funkcja refreshToken
  const refreshToken = useCallback(async () => {
    if (!authToken?.refresh_token) {
      console.warn('No refresh token available, logging out.');
      handleLogout();
      return null;
    }

    try {
      const response = await fetch(authConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: authConfig.clientId,
          refresh_token: authToken.refresh_token,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Refresh token failed:', errorData);
        throw new Error('Refresh token failed');
      }

      const newToken: TAuthToken = await response.json();
      setAuthToken(newToken);

      const jwt = parseJwt(newToken.access_token);
      if (jwt) {
        const userData: UserDataType = {
          roles: jwt.realm_access?.roles || [],
          username: jwt.preferred_username || '',
          email: jwt.email || '',
        };
        setUser(userData);
      }
      return newToken;
    } catch (err) {
      console.error('Token refresh failed', err);
      handleLogout();
      return null;
    }
  }, [authToken?.refresh_token, handleLogout, setAuthToken]);

  // Inicjalizacja autentykacji (uruchamia się raz)
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const stored = getAuthTokens();

      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const jwt = parseJwt(stored.access_token);
        if (jwt) {
          const userData: UserDataType = {
            roles: jwt.realm_access?.roles || [],
            username: jwt.preferred_username || '',
            email: jwt.email || '',
          };
          setUser(userData);
          setAuthToken(stored);
        }

        if (isTokenAboutToExpire(stored.access_token, 30)) {
          await refreshToken();
        }
      } catch (e) {
        console.error('Error initializing authentication or parsing tokens:', e);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshToken, handleLogout, setAuthToken]);

  // Automatyczny refresh tokenów w tle
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (authToken?.access_token) {
      const decoded = parseJwt(authToken.access_token);
      if (decoded && decoded.exp) {
        const expiresInSeconds = decoded.exp - Date.now() / 1000;
        const refreshThreshold = 60;
        const timeout = Math.max(1, (expiresInSeconds - refreshThreshold)) * 1000;

        intervalId = setTimeout(async () => {
          if (isTokenAboutToExpire(authToken.access_token, refreshThreshold)) {
            await refreshToken();
          }
        }, timeout);
      }
    }

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [authToken?.access_token, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authToken,
        setUser,
        setAuthToken,
        setLoading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;