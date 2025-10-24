// redux/index.ts
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'

import user from './user'
import messages from './messages'
//import appointmentReducer from './features/appointmentsSlice'

// reducery dla ofert
import offerReducer from './offers/offerSlice';

import offerFormReducer from './offers/offerFormSlice';
import allOffersReducer from './offers/allOffersSlice';
import categoryReducer from './offers/categorySlice';

// płatności
import payetReducer from './slices/payetSlice';


export const store = configureStore({
  reducer: {
    messages,
    user,
    // oferty
    offerForm: offerFormReducer,
    allOffers: allOffersReducer,
    offer: offerReducer,
    categories: categoryReducer,
    payet: payetReducer,

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
