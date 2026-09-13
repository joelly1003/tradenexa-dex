'use client';

import { useRegional } from '../providers/RegionalProvider';
import { ArrowUpRight, ArrowDownRight, Flame, Globe, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  volumeUsd24Hr: string;
}

export function DiscoverInterface() {
  const { region, currency, getSymbol } = useRegional();
  const symbol = getSymbol();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcode some simple exchange rates for demonstration, or default to 1
  const rates: Record<string, number> = {
    'USD': 1,
    'GBP': 0.79,
    'EUR': 0.92,
    'NGN': 1150
  };
  const rate = rates[currency] || 1;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('https://api.coincap.io/v2/assets?limit=100');
        const data = await res.json();
        setAssets(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getAsset = (sym: string) => assets.find(a => a.symbol === sym);

  const formatPrice = (usdPrice: string) => {
    const local = parseFloat(usdPrice) * rate;
    return local < 1 ? local.toFixed(4) : local.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (changeStr: string) => {
    return parseFloat(changeStr).toFixed(2);
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading live market data...</div>;
  }

  // Curated lists
  const trendingList = ['ETH', 'SOL', 'BTC', 'PEPE'];
  const gainersList = ['SOL', 'LINK', 'UNI', 'AAVE'];
  const losersList = ['CRV', 'MKR', 'SNX', 'LDO'];

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
          {trendingList.map((sym) => {
            const coin = getAsset(sym);
            if (!coin) return null;
            return (
              <Link href="/trade" key={coin.symbol} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors group">
                <div className="font-bold text-lg mb-2">{coin.symbol}</div>
                <div className="text-2xl font-mono mb-1">{symbol}{formatPrice(coin.priceUsd)}</div>
                <div className={`text-sm font-semibold flex items-center ${parseFloat(coin.changePercent24Hr) >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {parseFloat(coin.changePercent24Hr) >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {formatChange(coin.changePercent24Hr)}% 24h
                </div>
              </Link>
            )
          })}
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
          {['ETH', 'USDT', 'BTC'].map((sym) => {
            const coin = getAsset(sym);
            if (!coin) return null;
            const isPositive = parseFloat(coin.changePercent24Hr) >= 0;
            return (
              <Link href="/trade" key={sym} className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur p-5 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-colors">
                <div className="text-lg font-bold mb-4">{coin.symbol} / {currency}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Local Price</div>
                    <div className="font-mono text-xl">{symbol}{formatPrice(coin.priceUsd)}</div>
                  </div>
                  <div className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                    {isPositive ? '+' : ''}{formatChange(coin.changePercent24Hr)}%
                  </div>
                </div>
              </Link>
            )
          })}
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
              <span className="w-1/3">Token</span>
              <span className="w-1/3 text-right">Price</span>
              <span className="w-1/3 text-right">24h %</span>
            </div>
            {gainersList.map((sym) => {
              const coin = getAsset(sym);
              if (!coin) return null;
              return (
                <Link href="/trade" key={coin.symbol} className="flex justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors items-center">
                  <span className="font-bold w-1/3">{coin.symbol}</span>
                  <span className="font-mono w-1/3 text-right">{symbol}{formatPrice(coin.priceUsd)}</span>
                  <span className="text-green-600 dark:text-green-500 font-semibold w-1/3 text-right">+{formatChange(coin.changePercent24Hr)}%</span>
                </Link>
              )
            })}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 rotate-180" /> Top Losers
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-500">
              <span className="w-1/3">Token</span>
              <span className="w-1/3 text-right">Price</span>
              <span className="w-1/3 text-right">24h %</span>
            </div>
            {losersList.map((sym) => {
              const coin = getAsset(sym);
              if (!coin) return null;
              return (
                <Link href="/trade" key={coin.symbol} className="flex justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors items-center">
                  <span className="font-bold w-1/3">{coin.symbol}</span>
                  <span className="font-mono w-1/3 text-right">{symbol}{formatPrice(coin.priceUsd)}</span>
                  <span className="text-red-600 dark:text-red-500 font-semibold w-1/3 text-right">{formatChange(coin.changePercent24Hr)}%</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Markets */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['ETH', 'BTC'].map((sym) => {
            const coin = getAsset(sym);
            if (!coin) return null;
            const isPositive = parseFloat(coin.changePercent24Hr) >= 0;
            return (
              <Link href="/trade" key={sym} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center hover:border-blue-500 transition-colors group">
                <div>
                  <h3 className="text-xl font-bold mb-2">{coin.symbol} / {sym === 'ETH' ? 'USDC' : 'USDT'}</h3>
                  <div className="text-2xl font-mono mb-2">{symbol}{formatPrice(coin.priceUsd)}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-semibold flex items-center ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />} 
                      {formatChange(coin.changePercent24Hr)}%
                    </span>
                    <span className="text-zinc-500">Vol {symbol}{(parseFloat(coin.volumeUsd24Hr) * rate / 1e9).toFixed(2)}B</span>
                  </div>
                </div>
                <div className={`w-32 h-16 flex items-end opacity-50 group-hover:opacity-100 transition-opacity ${isPositive ? 'stroke-green-500' : 'stroke-red-500'}`}>
                  {/* Mini chart mock */}
                  <svg viewBox="0 0 100 30" className="w-full h-full stroke-[3] fill-none" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <path d={isPositive ? "M 0 25 L 20 20 L 40 22 L 60 10 L 80 15 L 100 5" : "M 0 5 L 20 10 L 40 8 L 60 20 L 80 15 L 100 25"} />
                  </svg>
                </div>
              </Link>
            )
          })}
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
