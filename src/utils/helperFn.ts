export const initAutocompleteService = (
  serviceRef: React.MutableRefObject<google.maps.places.AutocompleteService | null>
) => {
  if (!serviceRef.current && window.google) {
    serviceRef.current = new window.google.maps.places.AutocompleteService();
  }
};

export const getCoordinates = async (address: string) => {
  if (!window.google) return;
  const geocoder = new window.google.maps.Geocoder();
  return new Promise<{ lat: number; lng: number } | null>((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.length) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        resolve(null);
      }
    });
  });
};

export const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });
    return (
      response.results?.[0]?.formatted_address || `Lat: ${lat}, Lng: ${lng}`
    );
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return `Lat: ${lat}, Lng: ${lng}`;
  }
};
