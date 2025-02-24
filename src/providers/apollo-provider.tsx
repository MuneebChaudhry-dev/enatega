'use client';

import { ApolloProvider as Provider } from '@apollo/client';
import client from '@/api/apolloClient';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
