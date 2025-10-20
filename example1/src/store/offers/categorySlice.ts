// src/store/offers/categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfferCategory, CategoryState } from '../../types/offer';

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<OfferCategory[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<OfferCategory>) => {
      state.categories.push(action.payload);
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setCategoriesError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
  },
});

export const {
  setCategories,
  addCategory,
  setCategoriesLoading,
  setCategoriesError,
} = categorySlice.actions;

export default categorySlice.reducer;