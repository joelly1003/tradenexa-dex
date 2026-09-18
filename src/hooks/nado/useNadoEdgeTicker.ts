import { useQuery } from '@tanstack/react-query';
import { defaultNadoClient, CachedPriceItem } from '../../lib/nado';

export function useNadoEdgeTicker(productIds?: number[]) {
  return useQuery<CachedPriceItem[]>({
    queryKey: ['nadoEdgeTicker', productIds],
    queryFn: async () => {
      try {
        const res = await defaultNadoClient.edgeQuery<CachedPriceItem[]>({
          type: 'cached_prices',
          product_ids: productIds,
        });
        return Array.isArray(res) ? res : [];
      } catch (err) {
        console.warn('Edge query ticker error, simulating via Binance API:', err);
        // Fallback to Binance ticker for simulated real-time data
        try {
          const binanceRes = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr');
          const data = await binanceRes.json();
          
          const toX18 = (numStr: string | number) => {
            const str = numStr.toString();
            let [intPart, fracPart = ''] = str.split('.');
            fracPart = fracPart.padEnd(18, '0').slice(0, 18);
            return intPart + fracPart;
          };

          return data.map((d: any, index: number) => {
            const baseAsset = d.symbol.replace('USDT', '');
            
            // Scale to 18 decimals for Nado structs using string parsing to avoid float limits
            const priceX18 = toX18(d.lastPrice || '0');
            const bidX18 = toX18(d.bidPrice || d.lastPrice || '0');
            const askX18 = toX18(d.askPrice || d.lastPrice || '0');
            const volumeX18 = toX18(d.quoteVolume || '0');

            return {
              product_id: index + 1,
              symbol: baseAsset,
              price_x18: priceX18,
              bid_x18: bidX18,
              ask_x18: askX18,
              change_24h_percent: d.priceChangePercent?.toString() || '0',
              volume_24h_x18: volumeX18,
              timestamp: Date.now()
            } as CachedPriceItem;
          });
        } catch(binanceErr) {
            console.warn('Fallback failed', binanceErr);
            return [];
        }
      }
    },
    refetchInterval: 3000,
    staleTime: 1500,
  });
}
