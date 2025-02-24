'use client';
import { GoogleMap } from '@react-google-maps/api';
import React, { ReactNode, useState, useEffect } from 'react';

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
  center?: google.maps.LatLngLiteral;
}
export const Map = ({ children, center }: MapProps) => {
  const [mapCenter, setMapCenter] = useState(center || defaultMapCenter);

  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  return (
    <div className='w-full mt-16'>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={mapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        {children}
      </GoogleMap>
    </div>
  );
};
