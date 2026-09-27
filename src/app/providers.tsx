'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { ink, mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Use a highly reliable public fallback project ID for WalletConnect to ensure QR code generation works
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '3fcc6bba6f1de962d911bb5b5c3dba68';

// Adding mainnet alongside ink ensures WalletConnect relay namespace accepts the session
const networks = [ink, mainnet] as any;

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
  featuredWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook']
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
