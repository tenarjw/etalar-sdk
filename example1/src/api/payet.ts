//api/payet.ts
import axios, { configs_post, originalAxios } from '../api/api_axios';
import CONFIG from '../configs/config';
import { OrderCreateRequest, OrderCreateResponse } from '@/types/payet';

const PAYMENT_API_BASE_URL = CONFIG.apiUrl + 'v2/payet'; 
export const PAYMENT_API_WS = CONFIG.apiWs;

interface ApiErrorDetail {
    loc?: string[];
    msg: string;
    type: string;
}

interface AxiosErrorResponse {
    detail?: string | ApiErrorDetail[];
     // FastAPI może zwracać string lub listę detali
}


// --- funkcja API do inicjowania płatności payet ---
export const startPayment = async (payload: OrderCreateRequest): Promise<OrderCreateResponse> => {
  try {
    const configs = configs_post(PAYMENT_API_BASE_URL + '/create_order');
    
    configs.data = JSON.stringify(payload);

    const response = await axios(configs);
    return response.data as OrderCreateResponse;
  } catch (err: any) {
    let errorMessage = 'Wystąpił nieoczekiwany błąd podczas inicjowania płatności.';
    if (originalAxios.isAxiosError(err) && err.response) {
      const errorData: AxiosErrorResponse = err.response.data;
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
        errorMessage = errorData.detail.map(d => d.msg).join('; ');
      } else if (err.message) {
        errorMessage = err.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    console.error("Error initiating payet payment:", errorMessage, err.response?.data);
    throw new Error(errorMessage);
  }
};

