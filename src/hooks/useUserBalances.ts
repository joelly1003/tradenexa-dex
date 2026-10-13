'use client';

import { useAccount, useBalance } from 'wagmi';
import { INK_VERIFIED_CONTRACTS } from '../config/contracts.config';

export function useUserBalances() {
  const { address, isConnected, chainId } = useAccount();

  // 1. Fetch native ETH balance on the connected network
  const { 
    data: ethData, 
    refetch: refetchEth,
    isLoading: isEthLoading 
  } = useBalance({ 
    address,
  });

  // 2. Fetch Ink USDC balance
  const usdcAddress = (INK_VERIFIED_CONTRACTS.find(c => c.name.startsWith('USDC'))?.address 
    || '0xF181eD86D12255677B13941F7517E862024Ea461') as `0x${string}`;

  const { 
    data: usdcData, 
    refetch: refetchUsdc,
    isLoading: isUsdcLoading 
  } = useBalance({ 
    address,
    token: usdcAddress,
    query: {
      enabled: !!address && isConnected,
      retry: false,
    }
  });

  const ethBalance = (isConnected && ethData) ? parseFloat(ethData.formatted) : 0;
  const ethFormatted = ethBalance > 0 ? ethBalance.toFixed(4) : '0.0000';
  const ethUsd = ethBalance * 3100; // Benchmark approx ETH/USD

  const usdcBalance = (isConnected && usdcData) ? parseFloat(usdcData.formatted) : 0;
  const usdcFormatted = usdcBalance.toFixed(2);

  // Available trading margin prioritizes USDC, or falls back to ETH equivalent if user has ETH
  const availableMargin = usdcBalance > 0 ? usdcBalance : (ethUsd > 0 ? ethUsd : 0);
  const totalCollateralUsd = usdcBalance + ethUsd;

  const refetch = async () => {
    await Promise.allSettled([refetchEth(), refetchUsdc()]);
  };

  return {
    address,
    isConnected,
    chainId,
    ethBalance,
    ethFormatted,
    ethUsd,
    usdcBalance,
    usdcFormatted,
    availableMargin,
    totalCollateralUsd,
    isLoading: isEthLoading || isUsdcLoading,
    refetch,
  };
}
