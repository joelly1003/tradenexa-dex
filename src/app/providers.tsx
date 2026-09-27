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
  // Ensure these always appear prominently without restricting the entire list
  featuredWalletIds: [
    'phantomCustom',
    'metamaskCustom',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Official MetaMask fallback
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // Official Phantom fallback
  ],
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook'],
    allWallets: true
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
    },
    {
      id: 'metamaskCustom',
      name: 'MetaMask',
      homepage: 'https://metamask.io',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      mobile_link: 'metamask://',
      desktop_link: 'metamask://',
      webapp_link: 'https://metamask.io',
      app_store: 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202',
      play_store: 'https://play.google.com/store/apps/details?id=io.metamask'
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
