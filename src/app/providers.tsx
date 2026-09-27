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
  // Force these wallets to appear universally, even if mobile detection hides them
  includeWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Phantom
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
  ],
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook'],
    allWallets: true // Force the 'All Wallets' list to be visible on mobile
  },
  customWallets: [
    {
      id: 'phantomCustom',
      name: 'Phantom',
      homepage: 'https://phantom.app',
      image_url: 'https://play-lh.googleusercontent.com/rNXXBhkG0sW95O5vLqB3uF7R-V8HqN17wG4-G8P_u98fM5o4B5f4M7T2P_R3M_Z2',
      mobile_link: 'phantom://',
      desktop_link: 'phantom://',
      webapp_link: 'https://phantom.app',
      app_store: 'https://apps.apple.com/us/app/phantom-solana-wallet/1598432977',
      play_store: 'https://play.google.com/store/apps/details?id=app.phantom'
    }
  ],
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
