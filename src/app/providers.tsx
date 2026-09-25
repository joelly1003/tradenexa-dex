'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { ink } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e464e7bd741240a12396a9e5bf8dc';

// Define Ink Network as the ONLY network to ensure it stays on Ink and not Sepolia
const networks = [ink] as any;

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'TradeNexa DEX',
    description: 'Institutional-Grade Decentralized Exchange',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://tradenexa.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: false,
    email: false,
    socials: []
  },
  defaultNetwork: ink,
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
