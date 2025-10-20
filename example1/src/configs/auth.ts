// configs/auth.ts
const authConfig = {
  clientId: '<do uzupełnienia>',
  authorizationEndpoint: 'https://login.e-talar.com/realms/<do uzupełnienia>/protocol/openid-connect/auth',
  logoutEndpoint: 'https://login.e-talar.com/realms/<do uzupełnienia>/protocol/openid-connect/logout',
  tokenEndpoint: 'https://login.e-talar.com/realms/<do uzupełnienia>/protocol/openid-connect/token',
  scope: 'profile openid',
  storageKey: 'keycloakAuthTokens', 
  // Jeden klucz do przechowywania JSON z wszystkimi tokenami
  storageVerifierKeyName: 'keycloakVerifier', // PKCE verifier
  storagePathKeyName: 'keycloakRedirectPath', // Ścieżka powrotu po logowaniu

  decodeToken: true,
  autoLogin: false,
};

export type TAuthConfig = typeof authConfig;

export interface TTokenRqBase {
  grant_type: string;
  client_id: string;
  redirect_uri?: string; 
}

export interface TTokenRequestWithCodeAndVerifier extends TTokenRqBase {
  code: string;
  code_verifier: string;
}

export interface TTokenRequestForRefresh extends TTokenRqBase {
  scope?: string;
  refresh_token: string;
}

export type TTokenRequest = TTokenRequestWithCodeAndVerifier | TTokenRequestForRefresh;

export type TAuthToken = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in?: number; // Czas życia access_token w sekundach
  refresh_token?: string;
  refresh_expires_in?: number; // Czas życia refresh_token
  id_token?: string;
  /**
   * Czas wygaśnięcia access_token w milisekundach (timestamp).
   * Obliczany i dodawany przy zapisywaniu tokenu w `storeAuthTokens`.
   */
  expires_at?: number;
};

// ## PODSTAWOWE FUNKCJE ZARZĄDZANIA PAMIĘCIĄ ##

export const storeAuthTokens = (tokens: TAuthToken) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    // Oblicz i zapisz dokładny czas wygaśnięcia (w milisekundach)
    if (tokens.expires_in) {
      // Ustawiamy bufor, aby odświeżyć token chwilę PRZED jego faktycznym wygaśnięciem
      const bufferSeconds = 60;
      tokens.expires_at = Date.now() + (tokens.expires_in - bufferSeconds) * 1000;
    }
    sessionStorage.setItem(authConfig.storageKey, JSON.stringify(tokens));
  } catch (error) {
    console.error("Failed to store auth tokens:", error);
  }
};

export const getAuthTokens = (): TAuthToken | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = sessionStorage.getItem(authConfig.storageKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse auth tokens:", error);
    return null;
  }
};

export const removeAuthTokens = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(authConfig.storageKey);
};

export const storeVerifier = (verifier: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(authConfig.storageVerifierKeyName, verifier);
  }
};
export const getVerifier = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(authConfig.storageVerifierKeyName);
  }
  return null;
};
export const removeVerifier = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(authConfig.storageVerifierKeyName);
  }
};

export const storePath = (path: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(authConfig.storagePathKeyName, path);
  }
};
export const getPath = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(authConfig.storagePathKeyName);
  }
  return null;
};
export const removePath = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(authConfig.storagePathKeyName);
  }
};

export const clearAllAuthRelatedStorage = () => {
  removeAuthTokens();
  removeVerifier();
  removePath();
};


// ## ASYNCHRONICZNA LOGIKA ODŚWIEŻANIA TOKENU ##

/**
 * Wewnętrzna funkcja do odświeżania tokenu. Wysyła zapytanie do tokenEndpoint
 * z refresh_token i w odpowiedzi otrzymuje nowy zestaw tokenów.
 * @returns {Promise<TAuthToken | null>} Nowy obiekt tokenu lub null w przypadku błędu.
 */
const refreshToken = async (): Promise<TAuthToken | null> => {
  const currentTokens = getAuthTokens();
  if (!currentTokens?.refresh_token) {
    console.error("No refresh token available. User needs to log in again.");
    clearAllAuthRelatedStorage();
    return null;
  }

  const tokenRequest: TTokenRequestForRefresh = {
    grant_type: 'refresh_token',
    client_id: authConfig.clientId,
    refresh_token: currentTokens.refresh_token,
  };

  try {
    const response = await fetch(authConfig.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenRequest as any).toString(),
    });

    if (!response.ok) {
      // Jeśli odświeżenie się nie powiedzie (np. refresh_token też wygasł),
      // czyścimy sesję i traktujemy użytkownika jako wylogowanego.
      console.error("Failed to refresh token, status:", response.status);
      clearAllAuthRelatedStorage();
      // Można tutaj dodać przekierowanie do strony logowania
      // window.location.href = '/login';
      return null;
    }

    const newTokens: TAuthToken = await response.json();
    storeAuthTokens(newTokens); // Zapisujemy nowe tokeny
    console.log("Token successfully refreshed.");
    return newTokens;

  } catch (error) {
    console.error("Error during token refresh:", error);
    clearAllAuthRelatedStorage();
    return null;
  }
};

/**
 * Główna funkcja do pobierania ważnego tokenu dostępowego.
 * Należy jej używać w aplikacji zamiast bezpośredniego `getAuthTokens()`.
 * Automatycznie sprawdza, czy token wygasł i w razie potrzeby go odświeża.
 * @returns {Promise<string | null>} Ważny access_token lub null, jeśli nie można go uzyskać.
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  let tokens = getAuthTokens();
  
  if (!tokens) {
    return null;
  }
  
  // Sprawdzamy, czy token wygasł (lub zaraz wygaśnie)
  if (tokens.expires_at && tokens.expires_at < Date.now()) {
    console.log("Access token has expired. Attempting to refresh...");
    tokens = await refreshToken();
  }

  return tokens ? tokens.access_token : null;
};


export default authConfig;