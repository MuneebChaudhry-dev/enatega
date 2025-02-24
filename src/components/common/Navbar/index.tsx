'use client';
import Image from 'next/image';
import 'primeicons/primeicons.css';
import CustomButton from '../CustomButton';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { RootState } from '@/store/mapStore';
import { setSelectedCity } from '@/slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {
  const dispatch = useDispatch();
  const { selectedCity, userLocation, cities } = useSelector(
    (state: RootState) => state.location
  );
  const cityOptions = [
    ...(userLocation ? [userLocation] : []),
    ...cities.filter((city) => city.name !== userLocation?.name),
  ];
  const handleCityChange = (e: DropdownChangeEvent) => {
    dispatch(setSelectedCity(e.value));
  };
  return (
    <nav
      className='flex justify-between items-center px-12 h-16 bg-white text-black shadow-sm fixed top-0 left-0 w-full z-50'
      role='navigation'
    >
      <a href='/'>
        <Image src='/img/logo.svg' alt='logo' width={203} height={48} />
      </a>
      <div className='flex gap-4 items-center'>
        <i className='pi pi-map-marker text-gray-600'></i>
        <Dropdown
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          optionLabel='name'
          placeholder='Select a city'
          className=' w-40 border-none shadow-none justify-between text-black font-medium focus:ring-0 focus:outline-none flex items-center truncate'
          panelClassName='bg-white rounded-lg shadow-lg border border-gray-200 cursor-pointer p-4'
          dropdownIcon={<i className='pi pi-chevron-down text-gray-500'></i>}
        />
      </div>

      <div className='flex justify-start gap-5'>
        <CustomButton
          label='Sign In'
          onClick={() => alert('Login clicked')}
          variant='inverted'
        />
        <CustomButton
          label='Sign Up'
          onClick={() => alert('Sign up clicked')}
          variant='filled'
        />
        <CustomButton
          className='bg-transparent text-black hover:bg-transparent p-0'
          onClick={() => alert('Cart clicked')}
        >
          <i
            className='pi pi-shopping-bag'
            style={{ color: 'black', fontSize: '1.2rem' }}
          ></i>
        </CustomButton>
      </div>
    </nav>
  );
};

export default Navbar;
