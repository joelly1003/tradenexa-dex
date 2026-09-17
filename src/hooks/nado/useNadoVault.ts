import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { defaultNadoClient, buildSender } from '../../lib/nado';

export interface NadoVaultData {
  poolInfo: any;
  lockedBalances: any[];
}

export function useNadoVault(customSubaccount?: string) {
  const { address } = useAccount();
  const targetSender = customSubaccount || (address ? buildSender(address) : null);

  return useQuery<NadoVaultData>({
    queryKey: ['nadoVault', targetSender],
    queryFn: async () => {
      try {
        const poolInfoPromise = defaultNadoClient.query({ type: 'nlp_pool_info' });
        const lockedBalancesPromise = targetSender
          ? defaultNadoClient.query({ type: 'nlp_locked_balances', subaccount: targetSender })
          : Promise.resolve([]);

        const [poolInfo, lockedBalances] = await Promise.all([
          poolInfoPromise,
          lockedBalancesPromise,
        ]);

        return {
          poolInfo,
          lockedBalances: Array.isArray(lockedBalances) ? lockedBalances : [],
        };
      } catch (err) {
        console.warn('Error fetching Nado Vault information:', err);
        return {
          poolInfo: null,
          lockedBalances: [],
        };
      }
    },
    refetchInterval: 10000,
  });
}
