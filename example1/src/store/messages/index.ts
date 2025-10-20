import { createSlice, } from '@reduxjs/toolkit'

export type Message = {
  class : string;
  color : string;
  size: string;
  weight: string;
  message :string
};

export const appMessagesSlice = createSlice({
  name: 'appMessages',
  initialState: {
    messages: [] as Message[],
    mBoxOpened: false,
  },
  reducers: {
    setMBoxOpened: (state, action) => {
      state.mBoxOpened = action.payload;
      if (!state.mBoxOpened) state.messages=[]
    },
    pushMessage: (state, action) => {
      let m = action.payload as Message;
      if (! m.size) m.size='1em';
      if (! m.weight) m.weight='normal';
      if (! m.color) m.color='black'
      state.messages.push(m)
    },
  },
})
export const { setMBoxOpened,pushMessage
             } = appMessagesSlice.actions

export default appMessagesSlice.reducer
