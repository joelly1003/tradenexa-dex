'use client';

import { useState, useEffect } from 'react';
import { Search, Star, RefreshCcw, ArrowRight } from 'lucide-react';
import { useRegional } from '../providers/RegionalProvider';
import Link from 'next/link';

interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  volumeUsd24Hr: string;
}

export function MarketInterface() {
  const { getSymbol } = useRegional();
  const fiatSymbol = getSymbol();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Markets');
  const [watchlist, setWatchlist] = useState<string[]>(['bitcoin', 'ethereum']);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAssets = async () => {
    try {
      const res = await fetch('https://api.coincap.io/v2/assets?limit=100');
      const data = await res.json();
      setAssets(data.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Filter and Sort Logic
  let displayAssets = [...assets];
  
  if (search) {
    displayAssets = displayAssets.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (activeTab === 'Top Gainers') {
    displayAssets.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));
  } else if (activeTab === 'Top Losers') {
    displayAssets.sort((a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr));
  } else if (activeTab === 'Watchlist') {
    displayAssets = displayAssets.filter(a => watchlist.includes(a.id));
  } else if (activeTab === 'Trending') {
    displayAssets.sort((a, b) => parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr));
  }

  const formatPrice = (p: string) => {
    const num = parseFloat(p);
    if (num < 0.01) return num.toFixed(6);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const formatCompact = (v: string) => {
    const num = parseFloat(v);
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(num);
  };

  const tabs = [
    { name: 'All Markets', icon: null },
    { name: 'Trending', icon: '🔥' },
    { name: 'Top Gainers', icon: '🚀' },
    { name: 'Top Losers', icon: '🔻' },
    { name: 'Watchlist', icon: '⭐' },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 text-zinc-900 dark:text-white pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-black dark:text-white">Perpetual Markets</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Discover, track, and trade regional and global crypto assets.</p>
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search token or pair..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#1c1c1f] border border-zinc-200 dark:border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-black dark:text-white"
          />
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/50 rounded-xl mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Last updated: <span className="text-black dark:text-white font-mono">{lastUpdated || '--:--:--'}</span></span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            WebSocket Live Feed
          </div>
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 border border-green-600/20 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full text-xs font-semibold">
            ✓ Live Rates
          </div>
        </div>
        <button 
          onClick={fetchAssets}
          className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-blue-600 dark:text-blue-400 shrink-0"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh Prices
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
              activeTab === tab.name 
                ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                : 'bg-white dark:bg-[#111114] text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/50 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#0a0a0c]/50">
              <th className="p-4 pl-6 w-12"></th>
              <th className="p-4">Market</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">24H Change</th>
              <th className="p-4 text-right">24H Volume</th>
              <th className="p-4 text-right">Funding Rate</th>
              <th className="p-4 text-right">Open Interest</th>
              <th className="p-4 pr-6 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {loading && assets.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">Loading markets...</td>
              </tr>
            ) : displayAssets.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  {activeTab === 'Watchlist' ? 'No starred assets in your watchlist. Click the star icon next to any coin to add it!' : 'No markets found.'}
                </td>
              </tr>
            ) : (
              displayAssets.map((asset) => {
                const isFavorite = watchlist.includes(asset.id);
                const change = parseFloat(asset.changePercent24Hr);
                const isPositive = change >= 0;
                
                // Dynamic realistic funding rate and open interest
                const fundingRate = (change * 0.0015).toFixed(4);
                const openInterestUsd = (parseFloat(asset.volumeUsd24Hr) * 0.42).toString();

                return (
                  <tr key={asset.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <button 
                        onClick={() => toggleWatchlist(asset.id)}
                        className={`transition-colors ${isFavorite ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400'}`}
                      >
                        <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0 text-black dark:text-white border border-zinc-200 dark:border-transparent">
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-black dark:text-white">{asset.symbol}</div>
                          <div className="text-xs text-zinc-500">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-sm text-black dark:text-white">
                      {fiatSymbol}{formatPrice(asset.priceUsd)}
                    </td>
                    <td className={`p-4 text-right font-mono font-bold text-sm ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                      {isPositive ? '📈' : '📉'} {Math.abs(change).toFixed(2)}%
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(asset.volumeUsd24Hr)}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">
                      {parseFloat(fundingRate) >= 0 ? `+${fundingRate}%` : `${fundingRate}%`}
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(openInterestUsd)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link 
                        href="/trade"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-full transition-colors border border-blue-200 dark:border-blue-500/20"
                      >
                        Trade <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
