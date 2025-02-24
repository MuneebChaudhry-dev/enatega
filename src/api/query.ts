import { gql } from '@apollo/client';
export const GET_RESTAURANTS = gql`
  query Restaurants($latitude: Float, $longitude: Float) {
    nearByRestaurants(latitude: $latitude, longitude: $longitude) {
      restaurants {
        _id
        name
        image
        address
        rating
      }
    }
  }
`;
