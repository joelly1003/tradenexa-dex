'use client';

import { useRegional } from '../providers/RegionalProvider';
import { ArrowUpRight, ArrowDownRight, Flame, Globe, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export function DiscoverInterface() {
  const { region, currency, getSymbol } = useRegional();
  const symbol = getSymbol();

  return (
    <div className="flex flex-col gap-12 w-full text-zinc-900 dark:text-white pb-12 pt-8">
      
      {/* 1. Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Explore. Discover. Trade.</h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
          Explore trending assets, regional opportunities, and market insights.
        </p>
      </div>

      {/* 2. Trending Now */}
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Flame className="text-orange-500" /> Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Trending Cards */}
          {['ETH', 'SOL', 'BTC', 'PEPE'].map((coin, i) => (
            <Link href="/trade" key={coin} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors group">
              <div className="font-bold text-lg mb-2">{coin}</div>
              <div className="text-2xl font-mono mb-1">{symbol}{(1000 * (4-i)).toLocaleString()}</div>
              <div className="text-green-500 text-sm font-semibold flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" /> +{(Math.random() * 10).toFixed(2)}% 24h
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Regional Picks */}
      <section className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Globe className="w-48 h-48" />
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          ⭐ Popular in {region}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl">
          Based on your region, these are the most active trading pairs denominated in {currency}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {['ETH', 'USDT', 'BTC'].map((coin) => (
            <Link href="/trade" key={coin} className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur p-5 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-colors">
              <div className="text-lg font-bold mb-4">{coin} / {currency}</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Local Price</div>
                  <div className="font-mono text-xl">{symbol}{(Math.random() * 50000).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="text-green-500 text-sm font-semibold">
                  +2.4%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Top Gainers & Losers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Top Gainers
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-500">
              <span>Token</span>
              <span>Price</span>
              <span>24h %</span>
            </div>
            {['SOL', 'LINK', 'UNI', 'AAVE'].map((coin, i) => (
              <Link href="/trade" key={coin} className="flex justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <span className="font-bold">{coin}</span>
                <span className="font-mono">{symbol}{(100 * (4-i)).toFixed(2)}</span>
                <span className="text-green-500 font-semibold">+{((5-i)*3.2).toFixed(2)}%</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 rotate-180" /> Top Losers
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-500">
              <span>Token</span>
              <span>Price</span>
              <span>24h %</span>
            </div>
            {['CRV', 'MKR', 'SNX', 'LDO'].map((coin, i) => (
              <Link href="/trade" key={coin} className="flex justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <span className="font-bold">{coin}</span>
                <span className="font-mono">{symbol}{(50 * (i+1)).toFixed(2)}</span>
                <span className="text-red-500 font-semibold">-{((i+1)*2.4).toFixed(2)}%</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Markets */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['ETH / USDC', 'BTC / USDT'].map((pair) => (
            <Link href="/trade" key={pair} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center hover:border-blue-500 transition-colors group">
              <div>
                <h3 className="text-xl font-bold mb-2">{pair}</h3>
                <div className="text-2xl font-mono mb-2">{symbol}3,420.50</div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-500 font-semibold flex items-center"><ArrowUpRight className="w-4 h-4 mr-1" /> +2.4%</span>
                  <span className="text-zinc-500">Vol {symbol}1.2B</span>
                </div>
              </div>
              <div className="w-32 h-16 flex items-end opacity-50 group-hover:opacity-100 transition-opacity">
                {/* Mini chart mock */}
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-green-500 stroke-[3] fill-none" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <path d="M 0 25 L 20 20 L 40 22 L 60 10 L 80 15 L 100 5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Market Insights & 7. Emerging Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Market Insights */}
        <section className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" /> Market Insights
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold mb-1 text-lg">Ethereum activity is increasing</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Trading volume is up 18% in the last 24 hours.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold mb-1 text-lg">USDT is the most traded asset in your region</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{region} traders favor stablecoins for hedging volatility.</p>
            </div>
          </div>
        </section>

        {/* New / Emerging Assets */}
        <section>
          <h2 className="text-2xl font-bold mb-6">New / Emerging</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {['JTO', 'PYTH', 'TIA'].map((coin) => (
              <div key={coin} className="p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 flex justify-between items-center">
                <div>
                  <div className="font-bold flex items-center gap-2 text-lg">
                    {coin}
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Risk
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Recently listed</div>
                </div>
                <Link href="/trade" className="text-blue-500 text-sm font-semibold hover:underline">Trade</Link>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
