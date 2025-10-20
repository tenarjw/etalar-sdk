// src/store/offers/allOffersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer, OfferCategory, AllOffersState } from '../../types/offer';

const initialState: AllOffersState = {
  offers: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategories: [],
};

const allOffersSlice = createSlice({
  name: 'allOffers',
  initialState,
  reducers: {
    setAllOffers: (state, action: PayloadAction<Offer[]>) => {
      console.log('Payload for setAllOffers:', action.payload);
      state.offers = action.payload;
    },
    setAllOffersLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setAllOffersError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategories: (state, action: PayloadAction<OfferCategory[]>) => {
      state.selectedCategories = action.payload;
    },
  },
});

export const {
  setAllOffers,
  setAllOffersLoading,
  setAllOffersError,
  setSearchQuery,
  setSelectedCategories,
} = allOffersSlice.actions;

export default allOffersSlice.reducer;