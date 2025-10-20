import originalAxiosLib, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios'; 
import apiClient, { IRequestConfig } from './api_client'; 


export class Result {
  code: number;
  message: string;
  result?: any;

  constructor(data: undefined | any = {}) {
      this['code'] = data['code'];
      this['message'] = data['message'];
      this['result'] = data['result'] || null;
  }
}


export  const create_configs = (method : string, url : string, content='json',
                               token='', session=false) : AxiosRequestConfig => {
  
  //let configs : AxiosRequestConfig
  let configs : IRequestConfig = {
    method: method,
    withCredentials: session, // !!! if session - cookie must be sent
    headers : {
      'Content-Type': 'application/'+(content?content:'json'),
      'Accept': 'application/json'
    },
    data : null,
    params : null,
    url : url,
  };
   
// token oddzielnie - w interception
  if (token)
    configs.headers={...configs.headers, 'Authorization': 'Bearer '+token}
  return configs
}

export const configs_get = (url : string, token='') : AxiosRequestConfig => {
  return create_configs('get', url, token=token);
}

export const configs_post = (url : string, token='') : AxiosRequestConfig => {
  return create_configs('post', url, token=token);
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

export default function axiosInstance(configs: IRequestConfig): AxiosPromise { 
  return apiClient.request(configs);
}

// eksportujemy oryginalny obiekt Axios do używania statycznych metod
export const originalAxios = originalAxiosLib;
