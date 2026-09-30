'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function TradeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Trade route execution error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-81px)] bg-[#0B0E14] text-white px-4 text-center font-sans">
      <div className="max-w-md w-full bg-[#0e121a] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            Trading Workspace Notice
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Connection Issue Detected
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed">
            The trading interface encountered a network, RPC, or provider synchronization interruption. Your wallet assets and on-chain balances remain completely safe.
          </p>
        </div>

        {/* Error Details */}
        {error?.message && (
          <div className="p-3 bg-black/50 border border-white/5 rounded-xl text-left font-mono text-[11px] text-zinc-400 break-words max-h-24 overflow-y-auto">
            <span className="text-red-400 font-bold block mb-1">Details:</span>
            {error.message}
            {error.digest && (
              <span className="block text-zinc-600 text-[10px] mt-1">
                Digest: {error.digest}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
