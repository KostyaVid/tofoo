import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IHomeUser } from '../../types';

const initialState: IHomeUser = {
  user_id: -1,
  username: '',
  email: '',
};

export const homeUserSlice = createSlice({
  name: 'homeUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IHomeUser>) => {
      state = { ...action.payload };
    },
  },
});

export const { setUser } = homeUserSlice.actions;

export default homeUserSlice.reducer;
