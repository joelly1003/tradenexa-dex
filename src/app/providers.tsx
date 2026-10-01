'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { networks, projectId, wagmiAdapter, inkChain } from '../lib/wagmi';

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'TradeNexa',
    description: 'Decentralized Trading Interface on Ink Network',
    url: 'https://tradenexa.com',
    icons: ['https://tradenexa.com/favicon.ico']
  },
  // We use custom injected wallets to guarantee they show perfectly with logos
  featuredWalletIds: [
    'phantomCustom'
  ],
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github'],
    allWallets: true
  },
  customWallets: [
    {
      id: 'phantomCustom',
      name: 'Phantom',
      homepage: 'https://phantom.app',
      // Highly reliable Github Avatar URL
      image_url: 'https://avatars.githubusercontent.com/u/78782331?s=200&v=4',
      mobile_link: 'phantom://',
      desktop_link: 'phantom://',
      webapp_link: 'https://phantom.app',
      app_store: 'https://apps.apple.com/us/app/phantom-solana-wallet/1598432977',
      play_store: 'https://play.google.com/store/apps/details?id=app.phantom'
    }
  ],
  defaultNetwork: inkChain,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#B1FA41',
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 40
  }
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
