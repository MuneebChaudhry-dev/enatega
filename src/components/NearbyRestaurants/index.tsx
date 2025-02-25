import React from 'react';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';

interface NearbyRestaurantsProps {
  restaurants: any[] | null;
  loading: boolean;
  error: boolean;
}

const NearbyRestaurants: React.FC<NearbyRestaurantsProps> = ({
  restaurants,
  loading,
  error,
}) => {
  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Service Unavailable</p>}
      {!loading && !error && (!restaurants || restaurants.length === 0) && (
        <p className='text-center'>
          Click &quot;Find Restaurants&quot; to search for nearby restaurants.
        </p>
      )}

      <div className='w-full grid grid-cols-4 px-10 gap-4'>
        {restaurants?.map((restaurant) => (
          <div key={restaurant._id}>
            <Card
              title={restaurant.name}
              subTitle={restaurant.address}
              className='md:w-25rem bg-slate-800 text-white rounded-xl text-center p-2 min-h-60'
              footer={
                <div className='flex justify-center mt-6'>
                  <Rating
                    value={restaurant.rating}
                    readOnly
                    cancel={false}
                    className='flex'
                  />
                </div>
              }
              header={
                <img
                  className='rounded-lg mx-auto'
                  alt={restaurant.name}
                  src={restaurant.image}
                  width={200}
                  height={144}
                />
              }
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default NearbyRestaurants;
