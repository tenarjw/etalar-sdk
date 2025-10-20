import CONFIG from '@/configs/config';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosStatic from 'axios';

export interface Offer {
  id: number;
  name: string;
  productCode: string;
  description: string;
  category: string;
  etalar_percent: number;
  discount_percent: number;
  rules: string;
  quantity: number;
  price: number;
  currency: string;
}

interface OfferState {
  data: Offer[];
  saving: boolean;
  error: string | null;
}

const initialState: OfferState = {
  data: [],
  saving: false,
  error: null,
};

const api = axiosStatic.create({
  baseURL: CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pobierz oferty z API
export const fetchOffers = createAsyncThunk('offers/fetch', async () => {
  const res = await api.get<Offer[]>('/v1/account/offers');
    return res.data;
});

// Zapisz wszystkie oferty do API
export const saveOffers = createAsyncThunk(
  'offers/saveAll',
  async (offers: Offer[], { rejectWithValue }) => {
    try {
      const res = await api.put('/v1/account/offers', offers);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Błąd zapisu ofert');
    }
  }
);

// Slice
export const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    updateOffer: (state, action: PayloadAction<{ id: number; data: Offer }>) => {
      const idx = state.data.findIndex(o => o.id === action.payload.id);
      if (idx !== -1) {
        state.data[idx] = action.payload.data;
      }
    },
    addEmptyOffer: (state) => {
      const newId = state.data.length > 0 ? Math.max(...state.data.map(o => o.id)) + 1 : 1;
      state.data.push({
        id: newId,
        name: '',
        productCode: '',
        description: '',
        category: '',
        etalar_percent: 0,
        discount_percent: 0,
        rules: '',
        quantity: 0,
        price: 0,
        currency: 'PLN',
      });
    },
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(saveOffers.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveOffers.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveOffers.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  updateOffer,
  addOffer,
  addEmptyOffer,
} = offerSlice.actions;

export default offerSlice.reducer;
