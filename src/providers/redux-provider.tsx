'use client';

import { Provider } from 'react-redux';
import { mapStore } from '@/store/mapStore';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={mapStore}>{children}</Provider>;
}
