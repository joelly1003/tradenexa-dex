import React from 'react';

export default function TradeLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-[#0B0E14] text-white overflow-hidden w-full font-sans animate-pulse">
      
      {/* Top Ticker Skeleton */}
      <div className="flex items-center px-4 md:px-6 py-2.5 bg-[#0B0E14] border-b border-white/5 min-h-[64px] gap-6 md:gap-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10" />
          <div className="flex flex-col gap-1.5">
            <div className="w-20 h-5 bg-white/10 rounded" />
            <div className="w-14 h-3 bg-white/5 rounded" />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <div className="w-14 h-3 bg-white/5 rounded" />
            <div className="w-24 h-5 bg-[#B1FA41]/20 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-14 h-3 bg-white/5 rounded" />
            <div className="w-16 h-5 bg-white/10 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-14 h-3 bg-white/5 rounded" />
            <div className="w-20 h-5 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden border-t border-white/5">
        
        {/* Left Column: Chart & Positions Skeleton */}
        <div className="flex-[3] flex flex-col min-w-0 bg-[#0B0E14]">
          {/* Chart Skeleton */}
          <div className="flex-[2] min-h-[400px] p-6 flex flex-col justify-between border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-24 h-4 bg-white/10 rounded" />
                <div className="w-16 h-4 bg-white/5 rounded" />
              </div>
              <div className="flex gap-2">
                {['1m', '5m', '15m', '1h', '4h', '1D'].map((t) => (
                  <div key={t} className="w-7 h-5 bg-white/5 rounded" />
                ))}
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-zinc-600">
                <div className="w-10 h-10 rounded-full border-2 border-[#B1FA41]/30 border-t-[#B1FA41] animate-spin" />
                <span className="text-xs font-mono text-zinc-500">Connecting to NADO Orderbook Stream...</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-600 font-mono">
              <span>09:00</span>
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>21:00</span>
              <span>00:00</span>
            </div>
          </div>

          {/* Positions Panel Skeleton */}
          <div className="flex-1 min-h-[220px] p-4 bg-[#0a0c10] border-t border-white/5 space-y-3">
            <div className="flex gap-4 border-b border-white/5 pb-2">
              <div className="w-20 h-4 bg-white/10 rounded" />
              <div className="w-24 h-4 bg-white/5 rounded" />
              <div className="w-16 h-4 bg-white/5 rounded" />
            </div>
            <div className="w-full h-8 bg-white/[0.02] rounded" />
            <div className="w-full h-8 bg-white/[0.02] rounded" />
          </div>
        </div>

        {/* Middle Column: Orderbook Skeleton */}
        <div className="w-full lg:w-[320px] flex flex-col min-h-[400px] lg:min-h-0 bg-[#0B0E14] border-l border-white/10 p-3 space-y-2 shrink-0">
          <div className="flex justify-between pb-2 border-b border-white/5">
            <div className="w-16 h-4 bg-white/10 rounded" />
            <div className="w-12 h-4 bg-white/5 rounded" />
          </div>
          {/* Asks */}
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`ask-${i}`} className="w-full h-4 bg-red-500/10 rounded" />
            ))}
          </div>
          {/* Spread */}
          <div className="py-2 border-y border-white/5 text-center">
            <div className="w-24 h-5 bg-[#B1FA41]/20 rounded mx-auto" />
          </div>
          {/* Bids */}
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`bid-${i}`} className="w-full h-4 bg-green-500/10 rounded" />
            ))}
          </div>
        </div>

        {/* Right Column: Order Entry Skeleton */}
        <div className="w-full lg:w-[360px] flex flex-col min-h-[400px] lg:min-h-0 bg-[#0B0E14] border-l border-white/10 p-4 space-y-4 shrink-0">
          <div className="flex justify-between items-center">
            <div className="w-20 h-6 bg-white/10 rounded" />
            <div className="w-20 h-5 bg-white/5 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-green-500/20 rounded-lg" />
            <div className="flex-1 h-9 bg-red-500/20 rounded-lg" />
          </div>
          <div className="h-14 bg-white/5 rounded-xl" />
          <div className="h-14 bg-white/5 rounded-xl" />
          <div className="h-8 bg-white/5 rounded-lg" />
          <div className="h-28 bg-white/5 rounded-xl" />
          <div className="h-12 bg-[#B1FA41]/20 rounded-xl" />
        </div>

      </div>

    </div>
  );
}
