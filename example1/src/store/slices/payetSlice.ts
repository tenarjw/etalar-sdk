// redux/payetSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrderCreateRequest, OrderCreateResponse, PayETState } from '../../types/payet';
import { startPayment } from '../../api/payet'

const initialState: PayETState = {
  loading: false,
  error: null,
  paymentRedirectUrl: null,
  currentOrderId: null,
  currentAmount:0,
  jwtToken : '',
  paymentStatus: 'idle',
};

// Async Thunk do tworzenia zamówienia payet
export const createpayetOrder = createAsyncThunk(
  'payet/createOrder',
  async (orderData: OrderCreateRequest, { rejectWithValue }) => {
    try {      
      const response = await startPayment(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create payet order');
    }
  }
);


const payetSlice = createSlice({
  name: 'payet',
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentRedirectUrl = null;
      state.currentOrderId = null;
      state.currentAmount = 0;
      state.jwtToken = '';
      state.paymentStatus = 'idle';
    },
    setPaymentStatus: (state, action: PayloadAction<PayETState['paymentStatus']>) => {
      state.paymentStatus = action.payload;
    },
    setCurrentAmount: (state, action: PayloadAction<number>) => {
      state.currentAmount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createpayetOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentRedirectUrl = null;
        state.paymentStatus = 'pending';
      })
      .addCase(createpayetOrder.fulfilled, (state, action: PayloadAction<OrderCreateResponse>) => {
        state.loading = false;
        state.paymentRedirectUrl = action.payload.redirectUri;
        state.currentOrderId = action.payload.orderId;
        // Po udanym utworzeniu zamówienia i otrzymaniu redirectUri, 
        // automatycznie przekierowujemy
        // Można to zrobić tutaj lub w komponencie, po odczytaniu stanu
        /* w komponencie lepiej, bo umożliwia odpalenie kilku równocześnie
        if (action.payload.redirectUri) { // przekierowanie na redirectUri
          window.open(action.payload.redirectUri, "_blank"); // nowa zakładka
          // window.location.href = action.payload.redirectUri;
        }*/
      })
      .addCase(createpayetOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.paymentStatus = 'error';
      })
  },
});
 
export const { resetPayment, setPaymentStatus, setCurrentAmount } = payetSlice.actions;
export default payetSlice.reducer;