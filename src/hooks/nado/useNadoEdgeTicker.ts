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
        console.warn('Edge query ticker error, returning fallback data:', err);
        return [];
      }
    },
    refetchInterval: 3000,
    staleTime: 1500,
  });
}
