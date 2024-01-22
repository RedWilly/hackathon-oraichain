import React from 'react';

import type { PropsWithChildren } from 'react';

import ReactQueryProvider from './react-query';
import WagmiProvider from './wagmi';

interface IRootProvider extends PropsWithChildren {}

export default function RootProvider({ children }: IRootProvider) {
  return (
    <WagmiProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </WagmiProvider>
  );
}
