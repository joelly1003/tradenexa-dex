'use client';

import Link from 'next/link';
import { Home, Compass, BarChart2, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-black text-white text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-[#B1FA41]/10 border border-[#B1FA41]/20 flex items-center justify-center mb-6 text-[#B1FA41]">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-2">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-bold text-zinc-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-zinc-500 max-w-md text-sm mb-8 leading-relaxed">
        The route you are looking for does not exist or has been moved. You can navigate back to the trading terminal or browse markets.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] text-sm"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Link>
        <Link 
          href="/trade" 
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all text-sm"
        >
          <BarChart2 className="w-4 h-4 text-[#B1FA41]" />
          Go to Trade
        </Link>
        <Link 
          href="/market" 
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition-all text-sm"
        >
          <Compass className="w-4 h-4 text-[#B1FA41]" />
          View Markets
        </Link>
      </div>
    </div>
  );
}
