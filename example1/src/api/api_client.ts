// api_client.ts

import axios from 'axios';
import { getValidAccessToken } from '../configs/auth';
import CONFIG from '../configs/config';

export interface IRequestOptions {
  headers?: any;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  baseURL?: any;
  url?: any;
  data?: any;
  params?: any;
  withCredentials?: boolean;
}

// 1. Dedykowana instancja Axios
const apiClient = axios.create({
  baseURL: CONFIG.apiUrl,
});

// 2. Interceptor do tej konkretnej instancji
apiClient.interceptors.request.use(
  async (config) => {
    //console.log("Interceptor is running...");  
    const accessToken = await getValidAccessToken();
    if (accessToken) {
       // Type assertion dla headers
      if (!config.headers) {
        config.headers = {} as any; //  lub new AxiosHeaders();
      }
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Wyeksportuj skonfigurowaną instancję
export default apiClient;