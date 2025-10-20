// types/payet.ts

export interface Product {
  name: string;
  unitPrice: string; // Kwota w groszach, np. "12300" dla 123.00 PLN
  quantity: string;
}

export interface Buyer {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export interface OrderCreateRequest {
  description: string;
  currencyCode?: string;
  totalAmount: string; // Suma wszystkich produktów w groszach
  products: Product[];
  buyer: Buyer;
  extOrderId?: string;
  continueUrl?: string;
  notifyUrl?: string;
}

export interface OrderCreateResponse {
  redirectUri: string;
  orderId: string;
  extOrderId: string;
  jwtToken : string;
}

export interface PayETState {
  loading: boolean;
  error: string | null;
  paymentRedirectUrl: string | null;
  currentOrderId: string | null;
  currentAmount : number;
  jwtToken : string;
  paymentStatus: 'idle' | 'pending' | 'completed' | 'canceled' | 'rejected' | 'error';
}