import React from 'react';

import type { PropsWithChildren } from 'react';
import type { EIP1193Provider } from 'viem';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { WagmiProvider as WagmiContext } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import config from '../../_config';

const metadata = {
  name: config.metadata.title,
  description: config.metadata.description,
  url: 'https://web3modal.com',
  verifyUrl: '',
  icons: ['https://avatars.githubusercontent.com/u/142919060']
};

const projectId = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '') as string;
const wagmiConfig = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata
});

createWeb3Modal({
  chains: [sepolia],
  projectId,
  wagmiConfig,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': '',
    '--w3m-accent': '#6d28d9',
    '--w3m-color-mix': '#6d28d9',
    '--w3m-color-mix-strength': 1,
    '--w3m-border-radius-master': '0.5rem'
  }
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum as EIP1193Provider)
});

export const [account] = await walletClient.getAddresses();

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: custom(window.ethereum as EIP1193Provider)
});

interface IWagmiProvider extends PropsWithChildren {}

export default function WagmiProvider({ children }: IWagmiProvider) {
  return <WagmiContext config={wagmiConfig}>{children}</WagmiContext>;
}
