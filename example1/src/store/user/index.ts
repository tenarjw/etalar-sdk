// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export type PkceCode = {
  code_verifier : string;
  code_challenge : string;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    authAccessToken: '',
    pkce: {
      code_verifier : '',
      code_challenge : ''
    } as PkceCode,
    codeChallenge:'',
    groups : <string[]>[],
    accessToken:''
  },
  reducers: {
    savePkce: (state,action ) => {
      state.pkce=action.payload as PkceCode
    },
    setUser: (state, action) => {
      state.email = action.payload;
    },
    setAuthAccessToken: (state, action) => {
      state.authAccessToken = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  }
})

export default userSlice.reducer
export const { savePkce,setAuthAccessToken } = userSlice.actions
