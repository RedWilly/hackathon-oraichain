import React from 'react';

import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface IReactQueryProvider extends PropsWithChildren {}

export default function ReactQueryProvider({ children }: IReactQueryProvider) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
