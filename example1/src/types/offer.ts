// src/types/offer.ts

// Typ dla pojedynczej kategorii (np. 'ELECTRONICS', 'CLOTHING')
export type OfferCategory = string;

// Typ dla dodatkowych zasad (max 5 wierszy)
export type AdditionalRules = string[];

export interface Offer {
  id: string; // ID oferty, generowane przez backend
  productCode?: string;
  ownerId: number; // ID właściciela (użytkownika Keycloak)
  name: string;
  description: string; // W przypadku RTF, to będzie tekst w formacie RTF (np. HTML lub Markdown)
  imageUrl: string; // Link do zdjęcia/grafiki
  url: string; // Link do oferty
  categories: OfferCategory[]; // Wiele kategorii
  quantity: number;
  catalogPrice: number;
  catalogCurrency: string; // np. 'PLN', 'EUR', 'USD'
  systemPrice: number | null; // Cena dla użytkowników systemu
  discountPercentage: number | null; // Procent zniżki (0-100)
  additionalRules: AdditionalRules;
  // Dodatkowe pola, np. createdAt, updatedAt
  createdAt?: string;
  updatedAt?: string;
}

// Dane potrzebne do utworzenia/aktualizacji oferty
export interface OfferFormData {
  id?: string; // Opcjonalne dla tworzenia, wymagane dla aktualizacji
  name: string;
  productCode?: string;
  description: string;
  imageUrl: string;
  url: string;
  categories: OfferCategory[];
  quantity: number;
  catalogPrice: number;
  catalogCurrency: string;
  systemPrice: number | null;
  discountPercentage: number | null;
  additionalRules: AdditionalRules;
}

// Wynik operacji API
export interface ApiResult {
  error: string | null;
  successMessage: string | null;
}

// Stan slice'a Redux dla formularza oferty
export interface OfferFormState extends OfferFormData {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Stan slice'a Redux dla listy ofert właściciela
export interface OwnerOffersState {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
}

// Stan slice'a Redux dla listy wszystkich ofert (do przeglądania)
export interface AllOffersState {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategories: OfferCategory[];
}

// Stan slice'a Redux dla kategorii
export interface CategoryState {
  categories: OfferCategory[];
  isLoading: boolean;
  error: string | null;
}