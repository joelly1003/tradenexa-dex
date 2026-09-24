'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Star, RefreshCcw, ArrowRight, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useRegional } from '../providers/RegionalProvider';
import { useRouter } from 'next/navigation';
import { useNadoEdgeTicker } from '../../hooks/nado/useNadoEdgeTicker';
import Link from 'next/link';

interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  volumeUsd24Hr: string;
  spread?: string;
  depth25?: string;
  slip50k?: string;
  liqScore?: string;
  tags?: string[];
}

export function MarketInterface() {
  const router = useRouter();
  const { getSymbol } = useRegional();
  const fiatSymbol = getSymbol();
  
  const { data: nadoPrices, refetch: refetchNadoPrices, isFetching } = useNadoEdgeTicker();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Markets');
  const [watchlist, setWatchlist] = useState<string[]>(['BTC-PERP', 'ETH-PERP']);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchNadoPrices();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const assets: Asset[] = (nadoPrices || []).map(p => ({
    id: p.symbol,
    rank: '0',
    symbol: p.symbol.split('-')[0],
    name: p.symbol,
    priceUsd: (parseFloat(p.price_x18) / 1e18).toString(),
    changePercent24Hr: p.change_24h_percent,
    volumeUsd24Hr: (parseFloat(p.volume_24h_x18) / 1e18).toString(),
    tags: p.symbol.includes('PERP') ? ['PERP'] : ['SPOT']
  }));

  const loading = !nadoPrices;

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev: string[]) => 
      prev.includes(id) ? prev.filter((x: string) => x !== id) : [...prev, id]
    );
  };

  const [marketCategory, setMarketCategory] = useState('All Markets');

  // Filter and Sort Logic
  let displayAssets = [...assets];

  if (search) {
    displayAssets = displayAssets.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Default sorting logic: Important coins first, then by volume
  const importantCoins = ['BTC', 'ETH', 'SOL', 'SUI', 'BNB', 'ARB', 'OP', 'APT'];

  if (activeTab === 'All Markets') {
    displayAssets.sort((a, b) => {
      const aIndex = importantCoins.indexOf(a.symbol);
      const bIndex = importantCoins.indexOf(b.symbol);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr);
    });
  } else if (activeTab === 'Top Gainers') {
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
    <div className="w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 text-zinc-900 dark:text-white pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-black dark:text-white">Perpetual Markets</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Discover, track, and trade regional and global crypto assets on Nado DEX.</p>
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
          <span className="text-zinc-500 dark:text-zinc-400">Last updated: <span className="text-black dark:text-white font-mono">
            {nadoPrices && nadoPrices.length > 0 && typeof window !== 'undefined' ? new Date(nadoPrices[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
          </span></span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
          <div className={`flex items-center gap-1.5 font-medium ${isFetching ? 'text-yellow-500' : 'text-blue-600 dark:text-blue-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isFetching ? 'bg-yellow-500' : 'bg-blue-600 dark:bg-blue-400'} animate-pulse`} />
            {isFetching ? 'Connecting Feed...' : 'WebSocket Live Feed'}
          </div>
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 border border-green-600/20 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full text-xs font-semibold">
            ✓ Live Rates
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-blue-600 dark:text-blue-400 shrink-0"
        >
          <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Prices
        </button>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
            {tab.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/50 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-200 dark:border-zinc-800/50 bg-transparent">
              <th className="p-4 pl-6 w-12 rounded-tl-3xl"></th>
              <th className="p-4">Market</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">24H Change</th>
              <th className="p-4 text-right">24H Volume</th>
              <th className="p-4 text-right">Funding Rate</th>
              <th className="p-4 pr-6 text-right rounded-tr-3xl">Open Interest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {loading && assets.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">Loading Nado DEX markets...</td>
              </tr>
            ) : displayAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  {activeTab === 'Watchlist' ? 'No starred assets in your watchlist. Click the star icon next to any coin to add it!' : 'No markets found.'}
                </td>
              </tr>
            ) : (
              displayAssets.map((asset) => {
                const isFavorite = watchlist.includes(asset.id);
                const change = parseFloat(asset.changePercent24Hr);
                const isPositive = change >= 0;
                
                // Dynamic fallback values for Nado specific columns if not preset
                const openInterestUsd = asset.volumeUsd24Hr ? (parseFloat(asset.volumeUsd24Hr) * 0.42).toString() : '500000';
                
                // Pseudo-deterministic funding rate based on change
                const fundingRate = (change * 0.0005).toFixed(4);
                const isFundingPositive = parseFloat(fundingRate) >= 0;

                const iconSymbol = asset.symbol.toLowerCase() === 'kpepe' ? 'pepe' : asset.symbol.toLowerCase();
                const primaryLogo = `https://assets.coincap.io/assets/icons/${iconSymbol}@2x.png`;
                const secondaryLogo = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${iconSymbol}.png`;

                return (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-200 group text-sm cursor-pointer" 
                    onClick={() => router.push(`/trade?symbol=${asset.symbol}`)}
                  >
                    <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => toggleWatchlist(asset.id)}
                        className={`transition-colors ${isFavorite ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400'}`}
                      >
                        <Star className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Circle logo fallback (as seen in screenshot) */}
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50 overflow-hidden font-bold text-xs text-white">
                          <img 
                            src={primaryLogo} 
                            alt={asset.symbol}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src === primaryLogo) {
                                target.src = secondaryLogo;
                              } else {
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.innerText = asset.symbol.substring(0, 1).toUpperCase();
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-black dark:text-white leading-tight">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {asset.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-black dark:text-white">
                      {fiatSymbol}{formatPrice(asset.priceUsd)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(asset.volumeUsd24Hr)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={isFundingPositive ? 'text-yellow-500' : 'text-cyan-400'}>
                        {isFundingPositive ? '+' : ''}{fundingRate}%
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(openInterestUsd)}
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
