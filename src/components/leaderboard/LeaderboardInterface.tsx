'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  ArrowUpRight, 
  ShieldCheck, 
  Search, 
  ArrowUpDown, 
  Copy, 
  Check, 
  ExternalLink,
  Flame,
  Activity,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNadoLeaderboard, LeaderboardSortField } from '../../hooks/nado/useNadoLeaderboard';
import { useAppKit } from '@reown/appkit/react';

export function LeaderboardInterface() {
  const { open } = useAppKit();
  const {
    traders,
    podium,
    userRankData,
    timeframe,
    setTimeframe,
    sortField,
    sortAsc,
    handleSort,
    searchQuery,
    setSearchQuery,
    summary,
    isConnected,
  } = useNadoLeaderboard();

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const renderSortIndicator = (field: LeaderboardSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-600 inline ml-1 opacity-60" />;
    }
    return (
      <span className="text-[#B1FA41] inline ml-1 font-mono text-xs">
        {sortAsc ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 text-white min-h-[calc(100vh-80px)] font-sans">
      
      {/* 1. Header & Live Telemetry Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/30 rounded-full px-3 py-1 text-xs font-bold text-[#B1FA41] shadow-[0_0_12px_rgba(177,250,65,0.15)]">
              <Trophy className="w-3.5 h-3.5" />
              <span>NADO DEX Season 1</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#B1FA41] animate-pulse" />
              <span>Ink Network (57073)</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Top Traders Leaderboard
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Live leaderboard powered by NADO&apos;s off-chain matching engine and settled on Ink Network. Ranked dynamically by verified PnL and trade execution volume.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center bg-[#101217] border border-white/10 p-1 rounded-xl w-fit self-start md:self-end">
          {(['24h', '7d', '30d', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-[#B1FA41] text-black shadow-[0_0_15px_rgba(177,250,65,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'all' ? 'All Time' : t === '30d' ? '30 Days' : t === '7d' ? '7 Days' : '24 Hours'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Protocol Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#B1FA41]" />
            Volume ({timeframe.toUpperCase()})
          </div>
          <div className="text-2xl font-black font-mono text-white">{summary.totalVolumeFormatted}</div>
        </div>

        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#B1FA41]" />
            Realized PnL
          </div>
          <div className="text-2xl font-black font-mono text-[#B1FA41]">+{summary.totalPnlFormatted}</div>
        </div>

        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Total Trades
          </div>
          <div className="text-2xl font-black font-mono text-white">{summary.totalTrades.toLocaleString()}</div>
        </div>

        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            Ranked Subaccounts
          </div>
          <div className="text-2xl font-black font-mono text-white">{summary.activeTradersCount}</div>
        </div>
      </div>

      {/* 3. Connected User Performance Card */}
      {isConnected && userRankData ? (
        <div className="bg-gradient-to-r from-[#B1FA41]/10 via-[#0e1219] to-[#0e1219] border border-[#B1FA41]/30 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(177,250,65,0.08)]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#B1FA41]/20 border border-[#B1FA41]/40 flex items-center justify-center font-black text-black shrink-0">
              <span className="text-[#B1FA41] text-lg font-mono">#{userRankData.rank}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#B1FA41] uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Your Subaccount
                </span>
                <span className="text-xs font-mono text-zinc-400">{userRankData.displayAddress}</span>
              </div>
              <div className="text-lg font-black text-white">
                Rank #{userRankData.rank} in Season 1
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Your PnL</span>
              <span className="text-base font-black font-mono text-[#B1FA41]">{userRankData.pnl}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Your Volume</span>
              <span className="text-base font-black font-mono text-white">{userRankData.volume}</span>
            </div>
            <Link
              href="/trade"
              className="px-4 py-2 bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(177,250,65,0.2)]"
            >
              Trade Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-zinc-500" />
            <span className="text-xs text-zinc-400">
              Connect your Web3 wallet to check your rank, volume, and rewards in the NADO competition.
            </span>
          </div>
          <button
            onClick={() => open()}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* 4. Podium Highlights (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {podium.map((trader) => (
          <div 
            key={trader.address}
            className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all ${
              trader.rank === 1 
                ? 'bg-gradient-to-b from-[#B1FA41]/15 to-[#0e1118] border-[#B1FA41]/40 shadow-[0_0_30px_rgba(177,250,65,0.12)]' 
                : trader.rank === 2
                ? 'bg-gradient-to-b from-zinc-400/10 to-[#0e1118] border-zinc-400/30'
                : 'bg-gradient-to-b from-amber-600/10 to-[#0e1118] border-amber-600/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                trader.rank === 1 ? 'bg-[#B1FA41] text-black' : trader.rank === 2 ? 'bg-zinc-300 text-black' : 'bg-amber-600 text-white'
              }`}>
                RANK #{trader.rank}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {trader.topMarket}
              </span>
            </div>
            
            <div className="mb-4">
              <span className="text-[11px] text-zinc-400 block mb-0.5 font-mono">{trader.displayAddress}</span>
              <div className="text-2xl font-black font-mono text-[#B1FA41]">{trader.pnl}</div>
              <span className="text-xs font-bold font-mono text-zinc-400">({trader.pnlPercent})</span>
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-zinc-400 pt-3 border-t border-white/5">
              <span>Vol: {trader.volume}</span>
              <span>{trader.trades} trades • {trader.winRate}% win</span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Main Ranking Table & Controls */}
      <div className="bg-[#0c0d10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.01]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by address or market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-[#B1FA41]/50"
            />
          </div>
          <div className="text-xs text-zinc-500 self-end sm:self-auto">
            Showing <span className="text-white font-bold">{traders.length}</span> active traders
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
                <th onClick={() => handleSort('rank')} className="py-3.5 px-6 cursor-pointer hover:text-white">
                  Rank {renderSortIndicator('rank')}
                </th>
                <th className="py-3.5 px-6">Trader Subaccount</th>
                <th className="py-3.5 px-4 text-center">Top Market</th>
                <th onClick={() => handleSort('pnl')} className="py-3.5 px-6 text-right cursor-pointer hover:text-white">
                  Realized PnL {renderSortIndicator('pnl')}
                </th>
                <th onClick={() => handleSort('pnlPercent')} className="py-3.5 px-6 text-right cursor-pointer hover:text-white">
                  PnL % {renderSortIndicator('pnlPercent')}
                </th>
                <th onClick={() => handleSort('volume')} className="py-3.5 px-6 text-right cursor-pointer hover:text-white">
                  Volume {renderSortIndicator('volume')}
                </th>
                <th onClick={() => handleSort('trades')} className="py-3.5 px-6 text-right cursor-pointer hover:text-white">
                  Trades {renderSortIndicator('trades')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-mono">
              {traders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                    No traders found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                traders.map((row) => (
                  <tr 
                    key={row.address} 
                    className={`transition-colors ${
                      row.isUser 
                        ? 'bg-[#B1FA41]/10 border-l-2 border-[#B1FA41] hover:bg-[#B1FA41]/15' 
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="py-4 px-6 font-black">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                        row.rank === 1 ? 'bg-[#B1FA41] text-black font-black' :
                        row.rank === 2 ? 'bg-zinc-300 text-black font-black' :
                        row.rank === 3 ? 'bg-amber-600 text-white font-black' :
                        row.isUser ? 'bg-[#B1FA41] text-black font-black' :
                        'text-zinc-500 font-bold'
                      }`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${row.isUser ? 'bg-[#B1FA41]' : 'bg-[#B1FA41]/50'}`} />
                        <span>{row.displayAddress}</span>
                        {row.isUser && (
                          <span className="bg-[#B1FA41] text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            YOU
                          </span>
                        )}
                        <button
                          onClick={(e) => handleCopy(row.address, e)}
                          title="Copy address"
                          className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {copiedAddress === row.address ? (
                            <Check className="w-3 h-3 text-[#B1FA41]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <a
                          href={`https://explorer.inkonchain.com/address/${row.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/10 transition-colors"
                          title="View on Ink Explorer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                        {row.topMarket}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-black ${row.isPositive ? 'text-[#B1FA41]' : 'text-red-400'}`}>
                      {row.pnl}
                    </td>
                    <td className={`py-4 px-6 text-right font-bold ${row.isPositive ? 'text-[#B1FA41]' : 'text-red-400'}`}>
                      {row.pnlPercent}
                    </td>
                    <td className="py-4 px-6 text-right text-zinc-300">
                      {row.volume}
                    </td>
                    <td className="py-4 px-6 text-right text-zinc-400">
                      {row.trades}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#B1FA41]" />
            Rankings and trades verified on-chain via Ink Network (Chain ID: 57073)
          </div>
          <Link
            href="/trade"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
          >
            Trade on TradeNexa to Climb Rank
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
