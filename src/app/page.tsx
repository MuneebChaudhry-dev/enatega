import Navbar from '@/components/common/Navbar';
import HomePage from '@/components/HomePage';

import { GoogleMapProvider } from '@/providers/google-map-provider';

export default function Home() {
  return (
    <main>
      <Navbar />
      <GoogleMapProvider>
        <HomePage />
      </GoogleMapProvider>
    </main>
  );
}
