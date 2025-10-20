import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from "src/hooks/useAuth";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
//import { useMessages } from 'src/components/dialog/useMessages';
import authConfig, { storeVerifier,
         storePath,
         TAuthConfig } from "src/configs/auth";

//import { useRouter } from 'next/router'
//import Router from 'next/router'

import { savePkce  } from 'src/store/user'

import pkceChallenge from 'pkce-challenge'
import CONFIG from "src/configs/config";
import { keycloak_url, redirectUri } from "src/api/keycloak";



type TLoginParams = {
  page? : string
  code?:string
}

const LoginButton = (params : TLoginParams) => {
  const dispatch = useDispatch()
//  const router = useRouter();
  const auth=useAuth()

  // redux store:
 // const authAccessToken = useSelector<RootState, string | null>((state) => state.user.authAccessToken)
 //  let codeVerifier = useSelector<RootState, string | null>((state) => state.user.pkce.code_verifier)
 //  const codeChallenge = useSelector<RootState, string | null>((state) => state.user.pkce.code_challenge)

  let codeVerifier = ''
 // TODO: zrobić z użyciem  rtk query - obsłuży odświeżenie tokenu:
 //  const [getToken] = useAuthorizeMutation()


  const fetchCode= () => {
    let returnPath :string
    if (params.page) {
      returnPath=window.location.origin+'/'+params.page
    } else {
      returnPath=window.location.origin
    }
//    alert(returnPath)

//    if (!codeVerifier) {
      // step 1 - When user opens the web app create the code verifier and challenge and store them in the redux store
      pkceChallenge().then (
        (pkce /*{code_verifier:stringify, code_challenge:string}*/)=>{
        dispatch(savePkce(pkce)) // to niestety ginie przy drugim wejściu na stronę
        codeVerifier=pkce.code_verifier
        storeVerifier(codeVerifier||'') // dlatego w localStore
        storePath(returnPath) // gdzie wrócić
        // step 2 - Once the code challenge is created, redirect to the authorization server with code challenge
        const uri=keycloak_url('auth')
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: CONFIG.keycloak_client,
          redirect_uri: redirectUri('login'),
          code_challenge: pkce.code_challenge,
          code_challenge_method: 'S256'
        })
        // params.append('scope', config.scope)
        // storage.removeItem(stateStorageKey)
        /* if (state) {
          storage.setItem(stateStorageKey, state)
          params.append('state', state)
        }*/
        window.location.assign(`${uri}?${params.toString()}`)
     }
    )
  }

 if (auth.user?.username)
  return(
      <Button color="secondary"
        endIcon={<SendIcon />}
        size='large' type='submit' variant='contained' sx={{ mr: 4 }}
        onClick={ () => {auth.logout();/*signOut()*/} }>
        <Trans>Logout</Trans> {auth.user?.email}
      </Button>

    )
  else {
    return (
    <>
    <Button color="secondary"
      endIcon={<SendIcon />}
      size='large' type='submit' variant='contained' sx={{ mr: 4 }}    onClick={() => {
      storeVerifier('')
      fetchCode();
    }}
    >
    <Trans>Login</Trans> 
    </Button>
    </>)
  }
}

const Logout = () => {
  const auth = useAuth()
    return (
  <>
    <Button color="secondary"
      endIcon={<SendIcon />}
      size='large' type='submit' variant='contained' sx={{ mr: 4 }}
      onClick={ () => {auth.logout();/*signOut()*/} }>
      <Trans>Logout</Trans> {auth.user?.email}
    </Button>
  </>

)
}

export default LoginButton
export {Logout}
