import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  selectedCity: { name: string; lat: number; lng: number } | null;
  userLocation: { name: string; lat: number; lng: number } | null;
  cities: { name: string; lat: number; lng: number }[];
}

const initialState: LocationState = {
  selectedCity: null,
  userLocation: null,
  cities: [
    { name: 'New York', lat: 40.7128, lng: -74.006 },
    { name: 'Rome', lat: 41.9028, lng: 12.4964 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  ],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedCity: (
      state,
      action: PayloadAction<{ name: string; lat: number; lng: number }>
    ) => {
      state.selectedCity = action.payload;
    },
    setUserLocation: (
      state,
      action: PayloadAction<{ name: string; lat: number; lng: number }>
    ) => {
      state.userLocation = action.payload;
    },
  },
});

export const { setSelectedCity, setUserLocation } = locationSlice.actions;
export default locationSlice.reducer;
