'use client';

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { ink, mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Hardcoding the exact working project ID. If a user's env var is invalid/unwhitelisted, 
// the WalletConnect native option completely disappears on mobile. This guarantees it works.
const projectId = '3fcc6bba6f1de962d911bb5b5c3dba68';

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
  // We use custom injected wallets to guarantee they show perfectly with logos
  featuredWalletIds: [
    'phantomCustom',
    'metamaskCustom',
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
      // Highly reliable Github Avatar URL
      image_url: 'https://avatars.githubusercontent.com/u/78782331?s=200&v=4',
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
      // Highly reliable Github Avatar URL
      image_url: 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4',
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
