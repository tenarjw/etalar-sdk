// types/account.ts

export interface CardRegistrationData {
  cardNumber: string;
  pin: string;
  email: string;  
  serial: string | null;
}

export interface ApiResult {
  error: string | null;
  successMessage: string | null;
}

export interface ApiError {
  detail: string | null;
}

export interface CardRegistrationState {
  cardNumber: string;
  pin: string;
  email: string;
  serial: string;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// company

export type CompanyUsagePurposeSingle =
  | 'LOCAL_BUSINESS' // Firma lokalna
  | 'PROMOTIONS'     // Promocje
  | 'PRODUCT_OFFER'  // Oferta produktów
  | 'CURRENCY_CREATION'; // Kreowanie waluty

// Zmieniamy na tablicę możliwych celów
export type CompanyUsagePurpose = CompanyUsagePurposeSingle[];


export interface CompanyRegistrationData {
  companyName: string;
  taxId: string; // NIP
  email: string;
  usagePurpose: CompanyUsagePurpose; // Zmieniono na tablicę
}

export interface CompanyApiResult {
  error: string | null;
  successMessage: string | null;
}

export interface CompanyRegistrationState {
  companyName: string;
  taxId: string;
  email: string;
  usagePurpose: CompanyUsagePurpose; // Zmieniono na tablicę
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}


// bankAccount

// Etap 1: Dane do wysłania
export interface BankAccountRegistrationStage1Data {
  accountName: string;
  email: string;
  bankAccount: string; // Numer konta bankowego, np. IBAN
}

// Etap 1: Odpowiedź z API
export interface BankAccountRegistrationStage1Result {
  transactionId: string; // ID transakcji do użycia w Etapie 2
  message: string;
  error?: string | null; // Zakładamy, że API może zwrócić błąd w tej samej strukturze
}

// Etap 2: Dane do wysłania
export interface BankAccountRegistrationStage2Data {
  transactionId: string;
  verificationAmount: number; // Kwota, którą użytkownik otrzymał
}

// Etap 2: Odpowiedź z API
export interface BankAccountRegistrationStage2Result {
  successMessage: string | null;
  error: string | null;
}

// Globalny stan w Redux
export interface BankAccountRegistrationState {
  accountName: string;
  email: string;
  bankAccount: string;
  transactionId: string | null; // ID transakcji otrzymane w Etapie 1
  verificationAmount: string; // Używamy string, bo TextField zwraca string
  currentStage: 1 | 2; // Bieżący etap rejestracji
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}
