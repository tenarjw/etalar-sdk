// src/store/offers/offerFormSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfferFormData, OfferCategory, OfferFormState } from '../../types/offer';

const initialState: OfferFormState = {
  name: '',
  productCode: '',
  description: '',
  imageUrl: '',
  url: '',
  categories: [],
  quantity: 1,
  catalogPrice: 0,
  catalogCurrency: 'PLN', // Domyślna waluta
  systemPrice: null,
  discountPercentage: null,
  additionalRules: [''], // Jedno puste pole na początek
  isLoading: false,
  error: null,
  successMessage: null,
};

const offerFormSlice = createSlice({
  name: 'offerForm',
  initialState,
  reducers: {
    setOfferFormData: (state, action: PayloadAction<Partial<OfferFormData>>) => {
      return { ...state, ...action.payload };
    },
    setAdditionalRule: (state, action: PayloadAction<{ index: number; value: string }>) => {
      state.additionalRules[action.payload.index] = action.payload.value;
    },
    addAdditionalRule: (state) => {
      if (state.additionalRules.length < 5) {
        state.additionalRules.push('');
      }
    },
    removeAdditionalRule: (state, action: PayloadAction<number>) => {
      state.additionalRules.splice(action.payload, 1);
    },
    resetOfferForm: () => initialState,
    setFormLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setFormError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    setFormSuccessMessage: (state, action: PayloadAction<string | null>) => { state.successMessage = action.payload; },
  },
});

export const {
  setOfferFormData,
  setAdditionalRule,
  addAdditionalRule,
  removeAdditionalRule,
  resetOfferForm,
  setFormLoading,
  setFormError,
  setFormSuccessMessage,
} = offerFormSlice.actions;

export default offerFormSlice.reducer;