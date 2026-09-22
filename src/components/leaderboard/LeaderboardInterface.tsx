'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';

export function LeaderboardInterface() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | 'All'>('24h');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-black dark:text-white mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl">
            Discover the top performing traders on TradeNexa. Analyze their strategies or copy their trades directly.
          </p>
        </div>

        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              timeframe === '24h'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              timeframe === '7d'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('All')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              timeframe === 'All'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#101114] border border-zinc-200 dark:border-zinc-800 rounded-3xl min-h-[400px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-black dark:text-white mb-2">No Traders Ranked Yet</h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
          The leaderboard is currently empty. Be the first to start trading and claim the #1 spot on TradeNexa!
        </p>
      </div>
    </div>
  );
}
