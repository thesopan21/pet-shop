import { configureStore } from '@reduxjs/toolkit';
import petReducer from './slices/petsSlices';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    pets: petReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
