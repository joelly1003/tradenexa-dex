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
  'BTC': { price: 84604.45, change: 2.60, vol: 45000000000 },
  'ETH': { price: 3120.50, change: 1.12, vol: 15000000000 },
  'SOL': { price: 198.40, change: 5.67, vol: 3000000000 },
  'PENGU': { price: 0.038, change: 12.4, vol: 50000000 },
  'ASTER': { price: 0.72, change: -2.3, vol: 20000000 },
  'USDC': { price: 1.00, change: 0.01, vol: 50000000000 },
  'PUMP': { price: 0.0032, change: 45.6, vol: 150000000 },
  'HYPE': { price: 24.50, change: -5.4, vol: 25000000 },
  'AVAX': { price: 32.10, change: 3.2, vol: 500000000 },
  'DOGE': { price: 0.38, change: 1.5, vol: 1200000000 },
  'XRP': { price: 2.45, change: -0.5, vol: 900000000 },
  'BNB': { price: 685.20, change: 0.8, vol: 1500000000 }
};

// We will maintain the current randomized prices in memory so they can jitter
let currentPrices = JSON.parse(JSON.stringify(BASE_PRICES));

let hasFetchedLive = false;

export function useNadoEdgeTicker() {
  return useQuery({
    queryKey: ['nadoEdgeTickerMock'],
    queryFn: async () => {
      const now = Date.now();

      // Try fetching real Binance ticker once on client-side if available
      if (!hasFetchedLive && typeof window !== 'undefined') {
        hasFetchedLive = true;
        try {
          const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
          if (res.ok) {
            const data = await res.json();
            if (data && data.lastPrice) {
              const btcLive = parseFloat(data.lastPrice);
              if (btcLive > 0) {
                currentPrices['BTC'].price = btcLive;
                if (data.priceChangePercent) {
                  currentPrices['BTC'].change = parseFloat(data.priceChangePercent);
                }
              }
            }
          }
        } catch (e) {
          // Fallback to updated base prices
        }
      }
      
      // Update prices with slight random jitter (-0.1% to +0.1%)
      Object.keys(currentPrices).forEach(symbol => {
        if (symbol === 'USDC') {
          // Stablecoin jitter is very small
          const jitter = 1 + (Math.random() - 0.5) * 0.0001; 
          currentPrices[symbol].price *= jitter;
        } else {
          const jitter = 1 + (Math.random() - 0.5) * 0.0002;
          currentPrices[symbol].price *= jitter;
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
