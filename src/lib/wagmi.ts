import { http, fallback, defineChain } from 'viem';
import { mainnet } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Define Ink Mainnet Chain with failover transports
export const inkMainnet = defineChain({
  id: 57073,
  name: 'Ink',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://rpc-gel.inkonchain.com',
        'https://rpc-qnd.inkonchain.com',
        'https://rpc.inkonchain.com',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://explorer.inkonchain.com' },
  },
});

export const inkChain = inkMainnet;

export const projectId = 
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 
  process.env.NEXT_PUBLIC_PROJECT_ID || 
  '3fcc6bba6f1de962d911bb5b5c3dba68';

export const networks = [inkMainnet, mainnet] as any;

// Use viem's fallback transport to automatically switch endpoints on rate limits or downtime
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  transports: {
    [inkMainnet.id]: fallback([
      http('https://rpc-gel.inkonchain.com', { retryCount: 2, timeout: 4000 }),
      http('https://rpc-qnd.inkonchain.com', { retryCount: 2, timeout: 4000 }),
      http('https://rpc.inkonchain.com', { retryCount: 2, timeout: 4000 }),
    ]),
    [mainnet.id]: http(),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
