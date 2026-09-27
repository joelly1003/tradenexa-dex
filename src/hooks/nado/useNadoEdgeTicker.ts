import { useQuery } from '@tanstack/react-query';

export interface CachedPriceItem {
  product_id: number;
  symbol: string;
  price_x18: string;
  bid_x18: string;
  ask_x18: string;
  change_24h_percent: string;
  volume_24h_x18: string;
  timestamp: number;
  onBinance: boolean;
}

// Convert normal numbers to x18 string format
const toX18 = (val: number | string) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return (num * 1e18).toLocaleString('fullwide', { useGrouping: false });
};

// Base prices for the requested coins
const BASE_PRICES: Record<string, { price: number, change: number, vol: number }> = {
  'BTC': { price: 64230.50, change: 2.34, vol: 45000000000 },
  'ETH': { price: 3450.20, change: 1.12, vol: 15000000000 },
  'SOL': { price: 145.60, change: 5.67, vol: 3000000000 },
  'PENGU': { price: 0.045, change: 12.4, vol: 50000000 },
  'ASTER': { price: 0.12, change: -2.3, vol: 20000000 },
  'USDC': { price: 1.00, change: 0.01, vol: 50000000000 },
  'PUMP': { price: 0.002, change: 45.6, vol: 150000000 },
  'HYPE': { price: 0.089, change: -5.4, vol: 25000000 },
  'AVAX': { price: 35.40, change: 3.2, vol: 500000000 },
  'DOGE': { price: 0.15, change: 1.5, vol: 1200000000 },
  'XRP': { price: 0.58, change: -0.5, vol: 900000000 },
  'BNB': { price: 590.20, change: 0.8, vol: 1500000000 }
};

// We will maintain the current randomized prices in memory so they can jitter
let currentPrices = { ...BASE_PRICES };

export function useNadoEdgeTicker() {
  return useQuery({
    queryKey: ['nadoEdgeTickerMock'],
    queryFn: async () => {
      const now = Date.now();
      
      // Update prices with slight random jitter (-0.1% to +0.1%)
      Object.keys(currentPrices).forEach(symbol => {
        if (symbol === 'USDC') {
          // Stablecoin jitter is very small
          const jitter = 1 + (Math.random() - 0.5) * 0.0001; 
          currentPrices[symbol].price *= jitter;
        } else {
          const jitter = 1 + (Math.random() - 0.5) * 0.002;
          currentPrices[symbol].price *= jitter;
          // Slowly drift the 24h change too
          currentPrices[symbol].change += (Math.random() - 0.5) * 0.1;
        }
      });

      return Object.entries(currentPrices).map(([symbol, data], index) => {
        // We present them as PERP pairs for the market except USDC
        const displaySymbol = symbol === 'USDC' ? 'USDC' : `${symbol}-PERP`;
        
        return {
          product_id: index + 1,
          symbol: displaySymbol,
          price_x18: toX18(data.price),
          bid_x18: toX18(data.price * 0.999),
          ask_x18: toX18(data.price * 1.001),
          change_24h_percent: data.change.toFixed(2),
          volume_24h_x18: toX18(data.vol),
          timestamp: now,
          onBinance: true
        } as CachedPriceItem;
      });
    },
    // The user requested: "the market value of all the coins should change every second please"
    refetchInterval: 1000,
    staleTime: 500,
    // Return initialData synchronously so the component NEVER shows "Loading..."
    initialData: () => {
      const now = Date.now();
      return Object.entries(BASE_PRICES).map(([symbol, data], index) => {
        const displaySymbol = symbol === 'USDC' ? 'USDC' : `${symbol}-PERP`;
        return {
          product_id: index + 1,
          symbol: displaySymbol,
          price_x18: toX18(data.price),
          bid_x18: toX18(data.price * 0.999),
          ask_x18: toX18(data.price * 1.001),
          change_24h_percent: data.change.toFixed(2),
          volume_24h_x18: toX18(data.vol),
          timestamp: now,
          onBinance: true
        } as CachedPriceItem;
      });
    }
  });
}
