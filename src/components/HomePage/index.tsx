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
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_RESTAURANTS } from '@/api/query';
declare global {
  interface Window {
    google: typeof google;
  }
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { selectedCity, userLocation } = useSelector(
    (state: RootState) => state.location
  );
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userLatLng, setUserLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const initAutocompleteService = () => {
    if (!autocompleteServiceRef.current && window.google) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  };
  const [getRestaurants, { data, loading, error }] =
    useLazyQuery(GET_RESTAURANTS);
  const handleFindRestaurants = () => {
    if (!selectedCity) {
      alert('Please select a city first!');
      return;
    }

    getRestaurants({
      variables: {
        latitude: selectedCity.lat,
        longitude: selectedCity.lng,
      },
    });
  };

  const handleCompleteMethod = async (event: AutoCompleteCompleteEvent) => {
    const { query } = event;
    setQuery(query);

    if (!query.trim().length) {
      setSuggestions([]);
      return;
    }

    initAutocompleteService();

    if (!autocompleteServiceRef.current) {
      setSuggestions([`Mock result for: ${query}`]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: query },
      async (
        predictions: google.maps.places.AutocompletePrediction[] | null
      ) => {
        if (predictions) {
          const results = predictions.map((p) => p.description);
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const getCoordinates = async (address: string) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          resolve(null);
        }
      });
    });
  };

  const handleChange = async (e: { value: string }) => {
    const address = e.value;

    const coordinates = await getCoordinates(address);
    if (coordinates) {
      dispatch(
        setSelectedCity({
          name: address,
          lat: coordinates.lat,
          lng: coordinates.lng,
        })
      );
      dispatch(
        setUserLocation({
          name: address,
          lat: coordinates.lat,
          lng: coordinates.lng,
        })
      );
    }
  };
  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const address = await reverseGeocode(lat, lng);
        dispatch(setUserLocation({ name: address, lat, lng }));
        dispatch(setSelectedCity({ name: address, lat, lng }));
      });
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    console.log('lat', lat, 'lng', lng);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results.length > 0) {
        return response.results[0].formatted_address;
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
    }

    return `Lat: ${lat}, Lng: ${lng}`;
  };

  return (
    <div className='mt-16'>
      <Map>
        <div className='w-full flex justify-center'>
          <div
            className='flex flex-col md:flex-row items-center gap-2 md:gap-4 
                          bg-gray-800 text-white px-4 py-3 rounded-lg 
                          absolute z-10 top-1/2 left-1/2 
                          transform -translate-x-1/2 -translate-y-1/2'
          >
            <div className='flex bg-white items-center justify-between rounded-lg px-2 py-2'>
              <div className='relative w-80'>
                <AutoComplete
                  inputClassName='w-80 border-none focus:ring-0 focus:outline-none text-black font-medium pr-10 '
                  panelClassName='w-80 bg-white rounded-lg shadow-lg border border-gray-200 cursor-pointer p-4'
                  loadingIcon={
                    <i className='pi pi-spinner animate-spin text-gray-800 text-xl absolute right-3 top-1/2 -translate-y-1/2'></i>
                  }
                  value={selectedCity?.name || query}
                  suggestions={suggestions}
                  completeMethod={handleCompleteMethod}
                  onChange={handleChange}
                  placeholder='Enter Delivery Address'
                />
              </div>

              <Button
                label='Share Location'
                icon='pi pi-expand'
                iconPos='left'
                className='text-black text-sm font-medium bg-white text-nowrap flex items-center gap-2'
                onClick={handleShareLocation}
              />
            </div>

            <CustomButton
              label='Find Restaurants'
              icon='pi pi-search'
              className='text-nowrap'
              onClick={handleFindRestaurants}
            />
          </div>
        </div>
      </Map>
      <div className='mt-16'>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching restaurants</p>}
        {data?.nearByRestaurants?.restaurants?.map((restaurant) => (
          <p key={restaurant._id}>{restaurant.name}</p>
        ))}
      </div>
    </div>
  );
}
