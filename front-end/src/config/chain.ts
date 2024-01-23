import type ITemplate from '@/interfaces/template';

import { BadgeCent, BookHeart, Brush, Coins, Store, Vault } from 'lucide-react';

const chainConfig = {
  name: 'Oraichain',
  docs: 'https://docs.defibuilder.com/',
  contractFileExtension: '.sol',
  templates: [
    {
      name: 'Token',
      isActive: true,
      icon: BadgeCent
    },
    {
      name: 'NFT',
      isActive: true,
      icon: Brush
    },
    {
      name: 'Edition',
      isActive: true,
      icon: BookHeart
    },
    {
      name: 'Vault',
      isActive: true,
      icon: Vault
    },
    {
      name: 'Marketplace',
      isActive: true,
      icon: Store
    },
    {
      name: 'Exchange',
      isActive: true,
      icon: Coins
    }
  ] as ITemplate[]
};

export default chainConfig;
