import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { homeUserSlice } from './slices/homeUserSlice';

export const store = configureStore({
  reducer: {
    homeUser: homeUserSlice.reducer,
  },
  // middleware: (getDefaultMiddleware) => {
  //   return getDefaultMiddleware().concat(userHomeSlice.middleware);
  // },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
