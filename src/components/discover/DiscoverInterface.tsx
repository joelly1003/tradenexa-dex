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
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setAssets(data.data);
            return;
          }
        }
        throw new Error('CoinCap rate limit or format error');
      } catch (e) {
        console.warn('Falling back to Binance API for Discover data', e);
        try {
          const bRes = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr');
          const bData = await bRes.json();
          const mapped = bData.slice(0, 100).map((d: any) => ({
            id: d.symbol.toLowerCase(),
            symbol: d.symbol.replace('USDT', ''),
            name: d.symbol.replace('USDT', ''),
            priceUsd: d.lastPrice,
            changePercent24Hr: d.priceChangePercent,
            volumeUsd24Hr: d.quoteVolume
          }));
          setAssets(mapped);
        } catch (err) {
          console.error(err);
          setAssets([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const formatPrice = (usdPrice: string) => {
    const local = parseFloat(usdPrice) * rate;
    return local < 1 ? local.toFixed(4) : local.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (changeStr: string) => {
    return parseFloat(changeStr).toFixed(2);
  };

  if (loading || assets.length === 0) {
    return <div className="p-8 text-center text-zinc-500 font-bold animate-pulse mt-10">Loading live market data...</div>;
  }

  // Dynamically calculate curated lists
  const validAssets = [...assets].filter(a => a.priceUsd && a.changePercent24Hr && a.volumeUsd24Hr);
  
  const trendingList = [...validAssets].sort((a, b) => parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr)).slice(0, 4);
  const gainersList = [...validAssets].sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)).slice(0, 4);
  const losersList = [...validAssets].sort((a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)).slice(0, 4);
  const emergingList = [...validAssets].slice(40, 43); // pick some mid-cap assets

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
          {trendingList.map((coin) => (
            <Link href="/trade" key={coin.symbol} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors group shadow-sm">
              <div className="font-bold text-lg mb-2">{coin.symbol} <span className="text-xs font-normal text-zinc-500">{coin.name}</span></div>
              <div className="text-2xl font-mono mb-1 font-bold text-blue-500">{symbol}{formatPrice(coin.priceUsd)}</div>
              <div className={`text-sm font-semibold flex items-center ${parseFloat(coin.changePercent24Hr) >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {parseFloat(coin.changePercent24Hr) >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {formatChange(coin.changePercent24Hr)}% 24h
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
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl font-medium">
          Based on your region, these are the most active trading pairs denominated in {currency}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {trendingList.slice(0, 3).map((coin) => {
            const isPositive = parseFloat(coin.changePercent24Hr) >= 0;
            return (
              <Link href="/trade" key={coin.symbol} className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur p-5 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-colors shadow-sm">
                <div className="text-lg font-bold mb-4">{coin.symbol} / {currency}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs font-bold text-zinc-500 mb-1">Local Price</div>
                    <div className="font-mono text-xl font-bold">{symbol}{formatPrice(coin.priceUsd)}</div>
                  </div>
                  <div className={`text-sm font-bold bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="w-1/3">Token</span>
              <span className="w-1/3 text-right">Price</span>
              <span className="w-1/3 text-right">24h %</span>
            </div>
            {gainersList.map((coin) => (
              <Link href="/trade" key={coin.symbol} className="flex justify-between px-4 py-3.5 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors items-center group">
                <span className="font-bold w-1/3 group-hover:text-blue-500 transition-colors">{coin.symbol} <span className="hidden sm:inline font-normal text-xs text-zinc-500">{coin.name}</span></span>
                <span className="font-mono font-medium w-1/3 text-right">{symbol}{formatPrice(coin.priceUsd)}</span>
                <span className="text-green-600 dark:text-green-500 font-bold w-1/3 text-right bg-green-500/10 px-2 py-1 rounded-md ml-4">+{formatChange(coin.changePercent24Hr)}%</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 rotate-180" /> Top Losers
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span className="w-1/3">Token</span>
              <span className="w-1/3 text-right">Price</span>
              <span className="w-1/3 text-right">24h %</span>
            </div>
            {losersList.map((coin) => (
              <Link href="/trade" key={coin.symbol} className="flex justify-between px-4 py-3.5 border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors items-center group">
                <span className="font-bold w-1/3 group-hover:text-blue-500 transition-colors">{coin.symbol} <span className="hidden sm:inline font-normal text-xs text-zinc-500">{coin.name}</span></span>
                <span className="font-mono font-medium w-1/3 text-right">{symbol}{formatPrice(coin.priceUsd)}</span>
                <span className="text-red-600 dark:text-red-500 font-bold w-1/3 text-right bg-red-500/10 px-2 py-1 rounded-md ml-4">{formatChange(coin.changePercent24Hr)}%</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Markets */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingList.slice(0, 2).map((coin) => {
            const isPositive = parseFloat(coin.changePercent24Hr) >= 0;
            return (
              <Link href="/trade" key={coin.symbol} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center hover:border-blue-500 transition-colors group shadow-sm">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{coin.symbol} / USDT</h3>
                  <div className="text-3xl font-mono mb-3 font-bold">{symbol}{formatPrice(coin.priceUsd)}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold flex items-center px-2 py-0.5 rounded ${isPositive ? 'text-green-600 bg-green-500/10 dark:text-green-500' : 'text-red-600 bg-red-500/10 dark:text-red-500'}`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />} 
                      {formatChange(coin.changePercent24Hr)}%
                    </span>
                    <span className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">Vol {symbol}{(parseFloat(coin.volumeUsd24Hr) * rate / 1e9).toFixed(2)}B</span>
                  </div>
                </div>
                <div className={`w-32 h-16 flex items-end opacity-50 group-hover:opacity-100 transition-opacity ${isPositive ? 'stroke-green-500' : 'stroke-red-500'}`}>
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
        <section className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" /> Market Insights
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold mb-2 text-lg">{trendingList[0]?.name} activity is skyrocketing</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Trading volume is up significantly in the last 24 hours.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-bold mb-2 text-lg">USDT is the most traded asset in your region</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{region} traders favor stablecoins for hedging volatility.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">New / Emerging</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {emergingList.map((coin) => (
              <div key={coin.symbol} className="p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-0 flex justify-between items-center group">
                <div>
                  <div className="font-bold flex items-center gap-2 text-lg group-hover:text-blue-500 transition-colors">
                    {coin.symbol}
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Risk
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{coin.name}</div>
                </div>
                <Link href="/trade" className="text-blue-500 text-sm font-bold hover:underline bg-blue-500/10 px-3 py-1.5 rounded-lg">Trade</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
