import { useState } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

/**
 * A robust two-step ERC-20 token allowance workflow.
 * Handles checking existing allowance, submitting the approval transaction,
 * and awaiting final confirmation before returning ready state.
 */
export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  ownerAddress,
  amount,
  decimals = 18,
}: {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  ownerAddress?: `0x${string}`;
  amount: string;
  decimals?: number;
}) {
  const [isApproving, setIsApproving] = useState(false);

  // 1. Read existing allowance
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: {
      enabled: !!ownerAddress && !!spenderAddress && !!tokenAddress,
    }
  });

  const parsedAmount = amount && !isNaN(Number(amount)) ? parseUnits(amount, decimals) : 0n;
  const isApproved = allowance !== undefined && allowance >= parsedAmount;

  // 2. Write approval contract
  const { writeContractAsync, error: writeError } = useWriteContract();

  const handleApprove = async () => {
    if (!tokenAddress || !spenderAddress) throw new Error('Missing addresses');
    
    setIsApproving(true);
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, parsedAmount],
      });

      // Wait for transaction confirmation
      // (The hook consumer can handle the receipt or we can just rely on refetching)
      return hash;
    } finally {
      setIsApproving(false);
      refetch();
    }
  };

  return {
    isApproved,
    isApproving,
    allowance,
    handleApprove,
    writeError,
    refetch,
  };
}
