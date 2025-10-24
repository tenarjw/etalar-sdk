// pages/login/index.tsx
import { Button, CircularProgress, Typography, Box } from "@mui/material"; 
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { fetchTokens } from 'src/api/keycloak'; 
import { useAuth } from "src/hooks/useAuth";
import Login from "src/components/login"; // komponent formularza logowania
import authConfig, { getPath, removePath, getVerifier, removeVerifier, TAuthToken } from "src/configs/auth"; // Dodano removePath, removeVerifier
import { Trans } from "react-i18next";
import { useRouter } from "next/router";
import { parseJwt } from "@/utils/jwt";
import { storeAuthTokens } from "../../configs/auth";

const LoginPage = () => {
  const auth = useAuth()
  const router = useRouter()
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginComponent, setShowLoginComponent] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const verifier = getVerifier()
    const storedPath = getPath(); // Pobierz zapamiętaną ścieżkę
  
    // Jeśli użytkownik jest już zalogowany, przekieruj
    if (auth.authToken && auth.user) {
      if (storedPath) {
        router.replace(storedPath);
        removePath(); // Usuń ścieżkę po użyciu
      } else {
        router.replace('/'); // Domyślne przekierowanie po logowaniu
      }
      return;
    }

    // Obsługa przekierowania po autoryzacji z Keycloaka
    if (code && verifier) {
      setLoadingMessage('Potwierdzanie tożsamości...');
      setErrorMessage(null); // Wyczyść poprzednie błędy

      fetchTokens(authConfig, code, verifier, 'login')
        .then((token: TAuthToken) => {
          //? auth.setAuthToken(token) // Ustaw token w kontekście
          //alert(JSON.stringify(token))
          storeAuthTokens(token)

          removeVerifier(); // Usuń verifier po użyciu
          setLoadingMessage('Ustalanie uprawnień...');
          // api_keycloak_access zwraca dodatkowe dane
          // Po pomyślnym pobraniu i ustawieniu tokenów, AuthProvider powinien zaktualizować stan user
          // i przekierować.
    
          let jtoken=parseJwt(token.access_token)
          if (jtoken) {
            //alert(JSON.stringify(jtoken))
            try {
            auth.setUser(             
              {
              "username": jtoken.preferred_username,
              "email": jtoken.email?jtoken.email:jtoken.preferred_username,
              "roles": jtoken.realm_access.roles,
              "groups":[],
              "id": 1,
              "role":"admin", // obsolete
              "idToken": token.access_token, // obsolete
              "userIdent" : jtoken.email?jtoken.email:jtoken.preferred_username
                      })
                    }
                    catch (error) {
                    console.error(error);
                    }
          }
          setLoadingMessage(null)
        })
        .catch((error: Error) => {
          console.error("Login failed!:", error);
          //setErrorMessage('Nie można pobrać tokenu autoryzacji. Spróbuj ponownie.');
          setLoadingMessage(null);
          setShowLoginComponent(true);
          removeVerifier();
        })
    } else {
      // Jeśli nie ma kodu ani verifiera, oznacza to, że strona została otwarta bezpośrednio lub jest błąd
      // Pokaż komponent logowania
      setShowLoginComponent(true);
      setLoadingMessage(null);
      setErrorMessage(null);
    }
  }, [auth , router ]);

  // Efekt do obsługi przekierowania po otrzymaniu tokena i danych użytkownika
  useEffect(() => {
    if (auth.authToken && auth.user && !auth.loading) {
      const storedPath = getPath();
      if (storedPath) {
        router.replace(storedPath);
        removePath();
      } else {
        //router.replace('/'); // Domyślne przekierowanie
      }
    }
  }, [auth.authToken, auth.user, auth.loading, router ]);


  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h4" gutterBottom>Logowanie</Typography>
      {loadingMessage && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography>{loadingMessage}</Typography>
        </Box>
      )}

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
      )}

      {showLoginComponent && <Login page='login' />}

      {/* Przycisk Wróć powinien być widoczny tylko, jeśli jesteśmy w stanie, gdzie można wrócić */}
      {getPath() && !auth.loading && !showLoginComponent && (
        <Button
          color="secondary"
          endIcon={<SendIcon />}
          size='large' type='submit' variant='contained' sx={{ mr: 4 }}
          onClick={() => {
            router.push({ pathname: getPath() || '/', query: {} });
            removePath(); // Usuń ścieżkę po użyciu
          }}
        >
          <Trans>Wróć</Trans>
        </Button>
      )}
    </Box>
  )
  
}


export default LoginPage