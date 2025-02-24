'use client';
import React, { useState, useRef } from 'react';
import { Map } from '../Map';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Button } from 'primereact/button';

declare global {
  interface Window {
    google: any;
  }
}

export default function HomePage() {
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

  const handleChange = async (e: any) => {
    const address = e.value;
    setQuery(address);

    const coordinates = await getCoordinates(address);
    if (coordinates) {
      setUserLatLng(coordinates);
    }
  };

  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLatLng({ lat, lng });

          const address = await reverseGeocode(lat, lng);
          setQuery(address);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
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

  const handleFindRestaurants = () => {
    alert(`Finding restaurants near: ${query}`);
  };

  return (
    <div className='mt-16'>
      <Map center={userLatLng || undefined}>
        <div className='w-full flex justify-center'>
          <div
            className='flex flex-col md:flex-row items-center gap-2 md:gap-4 
                          bg-gray-800 text-white px-4 py-3 rounded-lg 
                          absolute z-10 top-1/2 left-1/2 
                          transform -translate-x-1/2 -translate-y-1/2'
          >
            <AutoComplete
              className='w-64 md:w-80 text-black'
              value={query}
              suggestions={suggestions}
              completeMethod={handleCompleteMethod}
              onChange={handleChange}
              placeholder='Enter Delivery Address'
            />

            <Button
              label='Share Location'
              icon='pi pi-map-marker'
              className='p-button-outlined p-button-warning'
              onClick={handleShareLocation}
            />

            <Button
              label='Find Restaurants'
              icon='pi pi-search'
              className='p-button-success'
              onClick={handleFindRestaurants}
            />
          </div>
        </div>
      </Map>
    </div>
  );
}
