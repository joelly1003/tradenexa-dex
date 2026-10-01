import { http, fallback } from 'viem';
import { mainnet } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Define Ink Chain with multiple RPC URLs
export const inkChain = {
  id: 57073,
  name: 'Ink',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-gel.inkonchain.com', 'https://rpc.inkonchain.com'],
    },
    public: {
      http: ['https://rpc-gel.inkonchain.com', 'https://rpc.inkonchain.com'],
    }
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://explorer.inkonchain.com' },
  },
} as const;

export const projectId = 
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 
  process.env.NEXT_PUBLIC_PROJECT_ID || 
  '3fcc6bba6f1de962d911bb5b5c3dba68';

export const networks = [inkChain, mainnet] as any;

// Use viem's fallback transport to automatically switch endpoints on rate limits or downtime
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  transports: {
    [inkChain.id]: fallback([
      http('/api/rpc'),
      http('https://rpc-gel.inkonchain.com'),
      http('https://rpc.inkonchain.com'),
    ]),
    [mainnet.id]: http(),
  },
});
