'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-black text-white text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-zinc-400 max-w-md text-sm mb-4 leading-relaxed">
        An unexpected error occurred while executing this operation. You can try refreshing the state or return to the main dashboard.
      </p>

      {error.digest && (
        <span className="font-mono text-xs text-zinc-500 bg-white/5 border border-white/10 px-3 py-1 rounded mb-6">
          Digest: {error.digest}
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all text-sm"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
