'use client';

import { useState } from 'react';
import { useTokenApproval } from '../../hooks/useTokenApproval';
import { useAccount, useWriteContract } from 'wagmi';
import { ArrowDownUp, ShieldCheck, Loader2 } from 'lucide-react';
import { erc20Abi, parseUnits } from 'viem';

// Example addresses for Ink Network (Chain ID: 57073)
const USDC_ADDRESS = '0x...'; // Replace with actual USDC address
const ROUTER_ADDRESS = '0x...'; // Replace with DEX Router address

export function SwapInterface() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // 1. Two-step approval hook
  const { isApproved, isApproving, handleApprove, writeError } = useTokenApproval({
    tokenAddress: USDC_ADDRESS,
    spenderAddress: ROUTER_ADDRESS,
    ownerAddress: address,
    amount: amount,
    decimals: 6, // USDC uses 6 decimals
  });

  const { writeContractAsync } = useWriteContract();

  // 2. Swap execution
  const handleSwap = async () => {
    if (!isApproved) return;
    setIsSwapping(true);
    try {
      // Mock swap function on router
      /*
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: 'swapExactTokensForTokens',
        args: [parseUnits(amount, 6), 0n, [USDC_ADDRESS, WETH_ADDRESS], address, BigInt(Math.floor(Date.now()/1000) + 3600)],
      });
      */
      alert('Swap executed successfully!');
    } catch (e) {
      console.error('Swap failed:', e);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="bg-[#0c0d10] border border-white/5 p-6 rounded-2xl w-full max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-white">Swap</h2>
        <div className="p-2 bg-[#B1FA41]/10 rounded-full">
          <ArrowDownUp className="w-4 h-4 text-[#B1FA41]" />
        </div>
      </div>

      <div className="bg-[#1a1c23] rounded-xl p-4 mb-2 border border-white/5 focus-within:border-white/20 transition-all">
        <label className="text-xs text-zinc-500 font-bold mb-2 block">You Pay</label>
        <div className="flex justify-between items-center">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent text-2xl font-black text-white outline-none w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="bg-white/10 px-3 py-1.5 rounded-lg text-white font-bold text-sm">USDC</div>
        </div>
      </div>

      <div className="bg-[#1a1c23] rounded-xl p-4 mb-6 border border-white/5">
        <label className="text-xs text-zinc-500 font-bold mb-2 block">You Receive</label>
        <div className="flex justify-between items-center">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent text-2xl font-black text-white outline-none w-full cursor-not-allowed"
            readOnly
            value={amount ? (parseFloat(amount) * 0.99).toFixed(4) : ''}
          />
          <div className="bg-white/10 px-3 py-1.5 rounded-lg text-white font-bold text-sm">ETH</div>
        </div>
      </div>

      {!address ? (
        <button className="w-full bg-[#1e293b] text-zinc-400 py-4 rounded-xl font-bold cursor-not-allowed">
          Connect Wallet to Swap
        </button>
      ) : !isApproved ? (
        <button 
          onClick={handleApprove}
          disabled={isApproving || !amount}
          className="w-full bg-[#B1FA41] hover:bg-[#9de036] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isApproving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {isApproving ? 'Approving...' : 'Approve USDC'}
        </button>
      ) : (
        <button 
          onClick={handleSwap}
          disabled={isSwapping || !amount}
          className="w-full bg-[#B1FA41] hover:bg-[#9de036] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSwapping ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isSwapping ? 'Swapping...' : 'Execute Swap'}
        </button>
      )}
      
      {writeError && (
        <p className="text-red-400 text-xs mt-3 text-center">
          {writeError.message || 'Transaction failed or was rejected.'}
        </p>
      )}
    </div>
  );
}
