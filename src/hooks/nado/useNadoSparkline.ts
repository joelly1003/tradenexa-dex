import { useQuery } from '@tanstack/react-query';
import { defaultNadoClient, CachedBboHistoryItem } from '../../lib/nado';

export function useNadoSparkline(productId: number) {
  return useQuery<CachedBboHistoryItem[]>({
    queryKey: ['nadoSparkline', productId],
    queryFn: async () => {
      try {
        const res = await defaultNadoClient.edgeQuery<CachedBboHistoryItem[]>({
          type: 'cached_bbo_history',
          product_id: productId,
          limit: 30,
        });
        return Array.isArray(res) ? res : [];
      } catch (err) {
        console.warn(`Sparkline edge query error for product ${productId}:`, err);
        return [];
      }
    },
    refetchInterval: 10000,
    staleTime: 5000,
    enabled: productId > 0,
  });
}
