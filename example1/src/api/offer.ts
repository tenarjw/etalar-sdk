import axios, { configs_post, configs_get, originalAxios } from '../api/api_axios';
import { Offer, OfferFormData, ApiResult } from '../types/offer';
import { OfferCategory } from '../types/offer';
import CONFIG from '../configs/config';

import { aint, anum, astr, attps} from '../utils/conv'

// offerService

const OFFERS_API_BASE_URL = CONFIG.apiOfferUrl;

// Funkcje do zarządzania ofertami właściciela
export const createOfferApi = (formDataFromState: OfferFormData): Promise<ApiResult> => {
  return new Promise((resolve, reject) => {
    const configs = configs_post(OFFERS_API_BASE_URL+'/create');
    //data.
    const apiPayload = {
  // id: formDataFromState.id, // id dla aktualizacji
  name: astr(formDataFromState.name),
  productCode: astr(formDataFromState.productCode??''),
  description: astr(formDataFromState.description),
  imageUrl: attps(formDataFromState.imageUrl),
  url: attps(formDataFromState.url),
  categories: formDataFromState.categories, // min 1?
  quantity: aint(formDataFromState.quantity),
  catalogPrice: anum(formDataFromState.catalogPrice),
  catalogCurrency: astr(formDataFromState.catalogCurrency),
  systemPrice: aint(formDataFromState.systemPrice),
  discountPercentage: aint(formDataFromState.discountPercentage),
  additionalRules: formDataFromState.additionalRules,
  };
  configs.data = JSON.stringify(apiPayload);
    configs.headers=   {
      ...configs.headers,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };
    //alert(JSON.stringify(configs))
    axios(configs)
      .then(res => 
        { //alert(JSON.stringify(res))
          resolve(res.data as ApiResult)
        })
      .catch(err => {
        let errorMessage = 'Błąd tworzenia oferty.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = String(err.message);
        }
        reject(new Error(errorMessage));
      });
  });
};

export const fetchOwnerOffersApi = (): Promise<Offer[]> => {
  return new Promise((resolve, reject) => {
    const configs = configs_get(OFFERS_API_BASE_URL + '/my');
    //alert(JSON.stringify(configs))
    axios(configs)
      .then(res =>  {
        //alert(JSON.stringify(res))
        resolve(res.data as Offer[]) 
         })
      .catch(err => {
        // alert(err)
        let errorMessage = 'Błąd pobierania własnych ofert.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};

interface ApiError {
    type: string;
    loc: string[];
    msg: string;
    input: string | Offer; // Could be a string or object depending on the server
}

export const updateOfferApi = (id: string, formDataFromState: OfferFormData): Promise<ApiResult> => {
  return new Promise((resolve, reject) => {
    const configs = configs_post(OFFERS_API_BASE_URL + `/${id}`); // FastAPI PUT może wymagać POST z '_method: PUT' lub po prostu PUT
    configs.method = 'put'; // Ustaw metodę na PUT
//    configs.data = data;
    const apiPayload = {
      id: id,
      name: astr(formDataFromState.name),
      productCode: astr(formDataFromState.productCode??''),
      description: astr(formDataFromState.description),
      imageUrl: attps(formDataFromState.imageUrl),
      url: attps(formDataFromState.url),
      categories: formDataFromState.categories, // min 1?
      quantity: aint(formDataFromState.quantity),
      catalogPrice: anum(formDataFromState.catalogPrice),
      catalogCurrency: astr(formDataFromState.catalogCurrency),
      systemPrice: aint(formDataFromState.systemPrice),
      discountPercentage: aint(formDataFromState.discountPercentage),
      additionalRules: formDataFromState.additionalRules,
      };
    configs.data = JSON.stringify(apiPayload);

    configs.headers=   {
      ...configs.headers,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };

    axios(configs)
      .then(res => resolve(res.data as ApiResult))
      .catch(err => {
        const apiError: ApiError = err.response.data;
        let errorMessage = 'Błąd aktualizacji oferty.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};

export const deleteOfferApi = (id: string): Promise<ApiResult> => {
  return new Promise((resolve, reject) => {
    const configs = configs_post(OFFERS_API_BASE_URL + `/${id}`); // FastAPI DELETE może wymagać POST z '_method: DELETE'
    configs.method = 'delete'; // Ustaw metodę na DELETE
    axios(configs)
      .then(res => resolve(res.data as ApiResult))
      .catch(err => {
        let errorMessage = 'Błąd usuwania oferty.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};

// Funkcje do przeglądania ofert (publiczne)
export const fetchAllOffersApi = (searchQuery?: string, categories?: string[]): Promise<Offer[]> => {
  return new Promise((resolve, reject) => {
    const params: { [key: string]: any } = {};
    if (searchQuery) params.search = searchQuery;
    if (categories && categories.length > 0) params.categories = categories.join(','); // Przekazujemy kategorie jako string rozdzielony przecinkami

    const configs = configs_get(OFFERS_API_BASE_URL+'/all');
    configs.params = params;
    axios(configs)
      .then(res => resolve(res.data as Offer[]))
      .catch(err => {
        let errorMessage = 'Błąd pobierania wszystkich ofert.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};


export const fetchOfferByIdApi = (id: string): Promise<Offer> => {
  return new Promise((resolve, reject) => {
    const configs = configs_get(OFFERS_API_BASE_URL + `/${id}`);
    axios(configs)
      .then(res => resolve(res.data as Offer))
      .catch(err => {
        let errorMessage = 'Błąd pobierania szczegółów oferty.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};

// categoryService

const CATEGORIES_API_URL = CONFIG.apiUrl + 'v1/account/offers/categories';

export const fetchCategoriesApi = (): Promise<OfferCategory[]> => {
  return new Promise((resolve, reject) => {
    const configs = configs_get(CATEGORIES_API_URL);
    axios(configs)
      .then(res => resolve(res.data as OfferCategory[]))
      .catch(err => {
        let errorMessage = 'Błąd pobierania kategorii.';
        if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.message) {
          errorMessage = err.message;
        }
        reject(new Error(errorMessage));
      });
  });
};

// Jeśli potrzebna jest funkcja do dodawania nowych kategorii z poziomu frontendu
export const addCategoryApi = (categoryName: string): Promise<ApiResult> => {
    return new Promise((resolve, reject) => {
        const configs = configs_post(CATEGORIES_API_URL);
        configs.data = { name: categoryName };
        axios(configs)
            .then(res => resolve(res.data as ApiResult))
            .catch(err => {
                let errorMessage = 'Błąd dodawania kategorii.';
                if (originalAxios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                reject(new Error(errorMessage));
            });
    });
};