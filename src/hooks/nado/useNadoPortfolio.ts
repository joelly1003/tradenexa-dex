import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { defaultNadoClient, buildSender } from '../../lib/nado';

export interface NadoPortfolioData {
  subaccount: string;
  subaccountInfo: any;
  isolatedPositions: any[];
  feeRates: any;
}

export function useNadoPortfolio(customSubaccount?: string) {
  const { address } = useAccount();
  const targetSender = customSubaccount || (address ? buildSender(address) : null);

  return useQuery<NadoPortfolioData | null>({
    queryKey: ['nadoPortfolio', targetSender],
    queryFn: async () => {
      if (!targetSender) return null;

      try {
        const [subaccountInfo, isolatedPositions, feeRates] = await Promise.all([
          defaultNadoClient.query({ type: 'subaccount_info', subaccount: targetSender }),
          defaultNadoClient.query({ type: 'isolated_positions', subaccount: targetSender }),
          defaultNadoClient.query({ type: 'fee_rates', subaccount: targetSender }),
        ]);

        return {
          subaccount: targetSender,
          subaccountInfo,
          isolatedPositions: Array.isArray(isolatedPositions) ? isolatedPositions : [],
          feeRates,
        };
      } catch (err) {
        console.warn('Error fetching Nado portfolio data:', err);
        return {
          subaccount: targetSender,
          subaccountInfo: null,
          isolatedPositions: [],
          feeRates: null,
        };
      }
    },
    enabled: !!targetSender,
    refetchInterval: 5000,
  });
}
