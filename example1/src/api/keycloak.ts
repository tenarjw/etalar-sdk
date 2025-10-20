import  {  storeVerifier,
         TTokenRequest,
         TAuthToken,
         TAuthConfig,
         TTokenRequestWithCodeAndVerifier} from "src/configs/auth";

import pkceChallenge from 'pkce-challenge'
import CONFIG from "src/configs/config";


export function keycloak_url(fun : string){
  return CONFIG.keycloak+'/protocol/openid-connect/'+fun
  // np https://login.example.com/realms/example/protocol/openid-connect/auth
}

export function redirectUri(page : string) {
  return window.location.origin+'/'+page
}

export const parseJwt = (token : string) => {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function buildUrlEncodedRequest(request: TTokenRequest): string {
  let queryString = ''
  for (const [key, value] of Object.entries(request)) {
    queryString += `${queryString ? '&' : ''}${key}=${encodeURIComponent(value)}`
  }
  return queryString
}

export class FetchError extends Error {
  status: number
  statusText: string

  constructor(status: number, statusText: string, message: string) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.statusText = statusText
  }
}

async function postWithXForm(url: string, request: TTokenRequest): Promise<Response> {
  //console.debug(request)
  return fetch(url, {
    method: 'POST',
    body: buildUrlEncodedRequest(request),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(async (response: Response) => {
    if (!response.ok) {
      const responseBody = await response.text()
      throw new FetchError(response.status, response.statusText, responseBody)
    }
    return response
  })
}

function isTokenResponse(body: unknown | TAuthToken): body is TAuthToken {
  return (body as TAuthToken).access_token !== undefined
}

function postTokenRequest(tokenEndpoint: string, tokenRequest: TTokenRequest): Promise<TAuthToken> {
  return postWithXForm(tokenEndpoint, tokenRequest).then((response) => {
    return response.json().then((body: TAuthToken | unknown): TAuthToken => {
      if (isTokenResponse(body)) {
        return body
      }
      throw Error(JSON.stringify(body))
    })
  })
}

export const fetchTokens = (config: TAuthConfig,code : string,
                            code_verifier: string,
                            redirectPage : string): Promise<TAuthToken> => {
  const tokenRequest: TTokenRequestWithCodeAndVerifier = {
    grant_type: 'authorization_code',
    code: code,
    client_id: config.clientId,
    redirect_uri: redirectUri(redirectPage),
    code_verifier: code_verifier,
  }
  console.debug('postTokenRequest:'+config.tokenEndpoint)
  console.debug(tokenRequest)
  return postTokenRequest(config.tokenEndpoint, tokenRequest)
}


export const fetchCode = (config: TAuthConfig) => {
    // step 1 - When user opens the web app create the code verifier and challenge and store them in the redux store
    pkceChallenge().then (
      (pkce /*{code_verifier:stringify, code_challenge:string}*/)=>{
      let codeVerifier=pkce.code_verifier
      storeVerifier(codeVerifier||'') // w localStore
      // step 2 - Once the code challenge is created, redirect to the authorization server with code challenge
      const uri=keycloak_url('auth')
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: CONFIG.keycloak_client,
        redirect_uri: redirectUri('login'),
        code_challenge: pkce.code_challenge,
        code_challenge_method: 'S256'
      })
      window.location.assign(`${uri}?${params.toString()}`)
    }
  )
}

