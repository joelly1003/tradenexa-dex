'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface TraderRank {
  rank: number;
  address: string;
  pnl: string;
  pnlPercent: string;
  volume: string;
  trades: number;
  isPositive: boolean;
}

const SAMPLE_LEADERBOARD: TraderRank[] = [
  { rank: 1, address: '0x8b32...4e19', pnl: '+$142,580.40', pnlPercent: '+348.2%', volume: '$4,890,200', trades: 142, isPositive: true },
  { rank: 2, address: '0x3c71...9a04', pnl: '+$98,340.15', pnlPercent: '+215.7%', volume: '$3,410,500', trades: 98, isPositive: true },
  { rank: 3, address: '0xf4a9...11c2', pnl: '+$67,820.90', pnlPercent: '+164.3%', volume: '$2,750,000', trades: 84, isPositive: true },
  { rank: 4, address: '0x12d5...88b6', pnl: '+$45,210.00', pnlPercent: '+98.4%', volume: '$1,920,400', trades: 61, isPositive: true },
  { rank: 5, address: '0x99e0...74f3', pnl: '+$31,450.80', pnlPercent: '+74.2%', volume: '$1,340,900', trades: 45, isPositive: true },
  { rank: 6, address: '0x71a2...55e8', pnl: '+$19,830.20', pnlPercent: '+52.1%', volume: '$890,000', trades: 39, isPositive: true },
  { rank: 7, address: '0x55b4...22d1', pnl: '+$12,400.50', pnlPercent: '+36.8%', volume: '$620,000', trades: 28, isPositive: true },
  { rank: 8, address: '0x44c9...66a7', pnl: '+$8,750.00', pnlPercent: '+24.5%', volume: '$480,200', trades: 22, isPositive: true },
];

export function LeaderboardInterface() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | 'All'>('24h');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)] font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded-full px-3 py-1 text-xs font-bold text-[#B1FA41] mb-3">
            <Trophy className="w-3.5 h-3.5" />
            Ink Network Season 1
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Top Traders Leaderboard
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Track top-performing algorithmic and discretionary traders on TradeNexa. Ranked by realized PnL and executed volume on Ink Network.
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

      {/* Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {SAMPLE_LEADERBOARD.slice(0, 3).map((trader) => (
          <div 
            key={trader.rank}
            className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
              trader.rank === 1 
                ? 'bg-gradient-to-b from-[#B1FA41]/15 to-[#0e1118] border-[#B1FA41]/30 shadow-[0_0_25px_rgba(177,250,65,0.1)]' 
                : 'bg-[#0e1118] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                trader.rank === 1 ? 'bg-[#B1FA41] text-black' : trader.rank === 2 ? 'bg-zinc-300 text-black' : 'bg-amber-600 text-white'
              }`}>
                RANK #{trader.rank}
              </span>
              <span className="text-xs font-mono text-zinc-400">{trader.address}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block mb-1">Realized PnL</span>
              <div className="text-2xl font-black font-mono text-[#B1FA41]">{trader.pnl}</div>
              <div className="text-xs font-mono text-zinc-400 mt-1">Volume: {trader.volume}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Ranking Table */}
      <div className="bg-[#0c0d10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Trader Address</th>
                <th className="py-3.5 px-6 text-right">Realized PnL</th>
                <th className="py-3.5 px-6 text-right">PnL %</th>
                <th className="py-3.5 px-6 text-right">Volume</th>
                <th className="py-3.5 px-6 text-right">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-mono">
              {SAMPLE_LEADERBOARD.map((row) => (
                <tr key={row.rank} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-6 font-black">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                      row.rank === 1 ? 'bg-[#B1FA41] text-black font-black' :
                      row.rank === 2 ? 'bg-zinc-300 text-black font-black' :
                      row.rank === 3 ? 'bg-amber-600 text-white font-black' :
                      'text-zinc-500 font-bold'
                    }`}>
                      #{row.rank}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B1FA41]/50" />
                      {row.address}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-[#B1FA41]">
                    {row.pnl}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-[#B1FA41]">
                    {row.pnlPercent}
                  </td>
                  <td className="py-4 px-6 text-right text-zinc-300">
                    {row.volume}
                  </td>
                  <td className="py-4 px-6 text-right text-zinc-400">
                    {row.trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#B1FA41]" />
            Rankings verified via on-chain events on Ink Network (Chain ID: 57073)
          </div>
          <Link
            href="/trade"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
          >
            Trade to Climb Rank
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
