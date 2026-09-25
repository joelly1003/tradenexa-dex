'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';

export function LeaderboardInterface() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | 'All'>('24h');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-white mb-2">
            <Trophy className="w-8 h-8 text-[#B1FA41]" />
            Leaderboard
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Discover the top performing traders on TradeNexa. Analyze their PnL, volume, and rank across the Ink Network.
          </p>
        </div>

        <div className="flex items-center bg-[#101114] border border-white/10 p-1 rounded-xl w-fit">
          {(['24h', '7d', 'All'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === t
                  ? 'bg-[#B1FA41] text-black shadow-[0_0_15px_rgba(177,250,65,0.2)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'All' ? 'All Time' : t === '7d' ? '7 Days' : '24 Hours'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0c0d10] border border-white/5 rounded-3xl min-h-[420px] flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 bg-[#B1FA41]/10 text-[#B1FA41] border border-[#B1FA41]/20 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(177,250,65,0.15)]">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">No Traders Ranked Yet</h2>
        <p className="text-zinc-400 max-w-md text-sm leading-relaxed mb-6">
          The leaderboard updates periodically based on executed volume and realized PnL. Trade on-chain to claim the top spot!
        </p>
        <a 
          href="/trade"
          className="px-6 py-2.5 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
        >
          Start Trading
        </a>
      </div>
    </div>
  );
}
