'use client';
import { RootState } from '@/store/mapStore';
import { GoogleMap } from '@react-google-maps/api';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
export const defaultMapContainerStyle = {
  width: '100%',
  height: '80vh',
};
const defaultMapCenter = {
  lat: 32.73031773012761,
  lng: 37.838860969312684,
};
const defaultMapZoom = 10;
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'auto',
  mapTypeId: 'terrain',
};
interface MapProps {
  children?: ReactNode;
}
export const Map = ({ children }: MapProps) => {
  const { selectedCity } = useSelector((state: RootState) => state.location);

  return (
    <div className='w-full mt-16'>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={
          selectedCity
            ? { lat: selectedCity.lat, lng: selectedCity.lng }
            : defaultMapCenter
        }
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        {children}
      </GoogleMap>
    </div>
  );
};
