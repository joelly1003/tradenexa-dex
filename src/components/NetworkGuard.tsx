'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { AlertTriangle, ArrowRight, Loader2, X } from 'lucide-react';
import { inkMainnet } from '../lib/wagmi';

const emptySubscribe = () => () => {};

export function NetworkGuard() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { isConnected, chainId, chain } = useAccount();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // If not mounted or not connected, no guard needed
  if (!isMounted || !isConnected) {
    return null;
  }

  // Check if wallet is connected to a network other than Ink Mainnet (57073)
  const isWrongNetwork = (chainId !== undefined && chainId !== 57073) || (chain && chain.id !== 57073);

  if (!isWrongNetwork) {
    return null;
  }

  const handleSwitchNetwork = async () => {
    setErrorMessage(null);
    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: 57073 });
      } else if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Fallback: direct wallet_switchEthereumChain or wallet_addEthereumChain
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xdef1' }], // 57073 in hex
          });
        } catch (switchError: any) {
          // Chain not added to wallet (4902 error code)
          if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xdef1',
                  chainName: inkMainnet.name,
                  nativeCurrency: inkMainnet.nativeCurrency,
                  rpcUrls: inkMainnet.rpcUrls.default.http,
                  blockExplorerUrls: [inkMainnet.blockExplorers.default.url],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
    } catch (err: any) {
      console.warn('Network switch failed or rejected:', err);
      setErrorMessage(err?.message || 'Network switch rejected by wallet. Please approve the switch in your wallet.');
    }
  };

  // If dismissed, show a compact sticky floating pill so the user can still switch easily
  if (isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce">
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-full font-bold text-xs shadow-2xl hover:bg-amber-400 transition-all border border-amber-300"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Switch to Ink (57073)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 border-b border-amber-500/30 text-white px-4 py-3 relative z-40 backdrop-blur-md transition-all font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        
        {/* Warning Icon & Copy */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-amber-200 flex items-center justify-center sm:justify-start gap-2">
              <span>Unsupported Network Connected</span>
              <span className="text-[10px] font-mono bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300">
                Chain #{chainId || 'Unknown'}
              </span>
            </div>
            <p className="text-xs text-amber-100/80 mt-0.5">
              TradeNexa settles exclusively on Ink Network. Switch your wallet to Ink Mainnet (Chain ID: 57073) to trade.
            </p>
          </div>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            className="flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs px-5 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(177,250,65,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Switching Network...</span>
              </>
            ) : (
              <>
                <span>Switch to Ink Network</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss Network Banner"
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-800/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="max-w-7xl mx-auto mt-2 text-[11px] text-amber-300/90 text-center sm:text-left bg-black/20 px-3 py-1 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
