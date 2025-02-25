'use client';
import React, { useState, useRef } from 'react';
import { Map } from '../Map';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import CustomButton from '../common/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/mapStore';
import { setUserLocation, setSelectedCity } from '@/slices/locationSlice';
import { useLazyQuery } from '@apollo/client';
import { GET_RESTAURANTS } from '@/api/query';
import NearbyRestaurants from '../NearbyRestaurants';
import {
  initAutocompleteService,
  getCoordinates,
  reverseGeocode,
} from '@/utils/helperFn';

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { selectedCity } = useSelector((state: RootState) => state.location);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const restaurantsSectionRef = useRef<HTMLElement | null>(null);

  const [getRestaurants, { data, loading, error }] =
    useLazyQuery(GET_RESTAURANTS);

  const handleFindRestaurants = () => {
    if (!selectedCity) {
      alert('Please select a city first!');
      return;
    }
    getRestaurants({
      variables: { latitude: selectedCity.lat, longitude: selectedCity.lng },
    });
    setTimeout(() => {
      restaurantsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handleCompleteMethod = async (event: AutoCompleteCompleteEvent) => {
    const { query } = event;
    setQuery(query);
    if (!query.trim()) return setSuggestions([]);
    initAutocompleteService(autocompleteServiceRef);

    autocompleteServiceRef.current?.getPlacePredictions(
      { input: query },
      (predictions) => {
        setSuggestions(
          predictions ? predictions.map((p) => p.description) : []
        );
      }
    );
  };

  const handleChange = async (e: { value: string }) => {
    const coordinates = await getCoordinates(e.value);
    if (coordinates) {
      dispatch(setSelectedCity({ name: e.value, ...coordinates }));
      dispatch(setUserLocation({ name: e.value, ...coordinates }));
    }
  };

  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const address = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude
        );
        dispatch(
          setUserLocation({
            name: address,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
        dispatch(
          setSelectedCity({
            name: address,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
      });
    }
  };

  return (
    <>
      <section className='mt-16'>
        <Map>
          <div className='w-full flex justify-center'>
            <div className='flex flex-col md:flex-row items-center gap-4 bg-gray-800 text-white px-4 py-3 rounded-lg absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <div className='flex bg-white items-center justify-between rounded-lg px-2 py-2'>
                <AutoComplete
                  inputClassName='w-80 border-none focus:ring-0 focus:outline-none text-black font-medium pr-10'
                  panelClassName='w-80 bg-white rounded-lg shadow-lg border border-gray-200 cursor-pointer p-4'
                  value={selectedCity?.name || query}
                  suggestions={suggestions}
                  completeMethod={handleCompleteMethod}
                  onChange={handleChange}
                  placeholder='Enter Delivery Address'
                />
                <Button
                  label='Share Location'
                  icon='pi pi-expand'
                  className='text-black text-sm font-medium bg-white text-nowrap flex items-center gap-2'
                  onClick={handleShareLocation}
                />
              </div>
              <CustomButton
                className='text-nowrap'
                label='Find Restaurants'
                icon='pi pi-search'
                onClick={handleFindRestaurants}
              />
            </div>
          </div>
        </Map>
      </section>
      <section className='py-8' ref={restaurantsSectionRef}>
        <h2 className='text-3xl text-center font-bold mb-8'>
          Restaurants Near You
        </h2>
        <NearbyRestaurants
          restaurants={data?.nearByRestaurants?.restaurants || []}
          loading={loading}
          error={!!error}
        />
      </section>
    </>
  );
}
