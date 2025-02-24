import { configureStore } from '@reduxjs/toolkit';
import locationReducer from '@/slices/locationSlice';

export const mapStore = configureStore({
  reducer: {
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof mapStore.getState>;
export type AppDispatch = typeof mapStore.dispatch;
