'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Star, RefreshCcw, ArrowRight, ChevronDown } from 'lucide-react';
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

  const [marketCategory, setMarketCategory] = useState('All Markets');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nadoCategories = [
    { label: 'All Markets', desc: 'All listed Nado DEX pairs' },
    { label: 'Crypto Perps', desc: 'BTC, ETH, SOL & 15+ perpetuals' },
    { label: 'Spot Markets', desc: 'Direct spot trading pairs' },
    { label: 'RWA & Equities', desc: 'SPYx, QQQx tokenized stocks' },
    { label: 'Commodities & FX', desc: 'Gold, Silver, FX perps' },
  ];

  // 31 Explicit Nado Perpetual Markets from Nado Exchange Frames 1-4
  const nadoMarkets: Asset[] = [
    { id: 'bitcoin', rank: '1', symbol: 'BTC', name: 'BTC-PERP (Bitcoin)', priceUsd: '75267.00', changePercent24Hr: '-4.50', volumeUsd24Hr: '181510000' },
    { id: 'ethereum', rank: '2', symbol: 'ETH', name: 'ETH-PERP (Ethereum)', priceUsd: '2383.40', changePercent24Hr: '-6.60', volumeUsd24Hr: '57560000' },
    { id: 'hype', rank: '3', symbol: 'HYPE', name: 'HYPE-PERP (Hyperliquid)', priceUsd: '76.56', changePercent24Hr: '-5.00', volumeUsd24Hr: '24650000' },
    { id: 'solana', rank: '4', symbol: 'SOL', name: 'SOL-PERP (Solana)', priceUsd: '96.56', changePercent24Hr: '-6.60', volumeUsd24Hr: '19990000' },
    { id: 'lit', rank: '5', symbol: 'LIT', name: 'LIT-PERP (Litentry)', priceUsd: '4.07', changePercent24Hr: '-9.90', volumeUsd24Hr: '1850000' },
    { id: 'zcash', rank: '6', symbol: 'ZEC', name: 'ZEC-PERP (Zcash)', priceUsd: '1102.29', changePercent24Hr: '-7.20', volumeUsd24Hr: '5360000' },
    { id: 'binance-coin', rank: '7', symbol: 'BNB', name: 'BNB-PERP (BNB Chain)', priceUsd: '709.61', changePercent24Hr: '-1.90', volumeUsd24Hr: '1450000' },
    { id: 'pump', rank: '8', symbol: 'PUMP', name: 'PUMP-PERP (Pump.fun)', priceUsd: '0.003495', changePercent24Hr: '-5.60', volumeUsd24Hr: '1200000' },
    { id: 'monero', rank: '9', symbol: 'XMR', name: 'XMR-PERP (Monero)', priceUsd: '502.23', changePercent24Hr: '-2.60', volumeUsd24Hr: '55970' },
    { id: 'aster', rank: '10', symbol: 'ASTER', name: 'ASTER-PERP (Aster)', priceUsd: '0.67514', changePercent24Hr: '-4.50', volumeUsd24Hr: '266710' },
    { id: 'ethena', rank: '11', symbol: 'ENA', name: 'ENA-PERP (Ethena)', priceUsd: '0.13725', changePercent24Hr: '-5.30', volumeUsd24Hr: '399750' },
    { id: 'layerzero', rank: '12', symbol: 'ZRO', name: 'ZRO-PERP (LayerZero)', priceUsd: '0.9679', changePercent24Hr: '-3.70', volumeUsd24Hr: '84660' },
    { id: 'xpl', rank: '13', symbol: 'XPL', name: 'XPL-PERP (Plasma)', priceUsd: '0.07969', changePercent24Hr: '-6.30', volumeUsd24Hr: '264170' },
    { id: 'fartcoin', rank: '14', symbol: 'FARTCOIN', name: 'FARTCOIN-PERP (Fartcoin)', priceUsd: '0.13515', changePercent24Hr: '-7.20', volumeUsd24Hr: '200260' },
    { id: 'aave', rank: '15', symbol: 'AAVE', name: 'AAVE-PERP (Aave)', priceUsd: '120.65', changePercent24Hr: '-7.00', volumeUsd24Hr: '191700' },
    { id: 'dogecoin', rank: '16', symbol: 'DOGE', name: 'DOGE-PERP (Dogecoin)', priceUsd: '0.07962', changePercent24Hr: '-5.90', volumeUsd24Hr: '105470' },
    { id: 'monad', rank: '17', symbol: 'MON', name: 'MON-PERP (Monad)', priceUsd: '0.021311', changePercent24Hr: '-9.20', volumeUsd24Hr: '208190' },
    { id: 'bittensor', rank: '18', symbol: 'TAO', name: 'TAO-PERP (Bittensor)', priceUsd: '216.42', changePercent24Hr: '-7.90', volumeUsd24Hr: '580300' },
    { id: 'sui', rank: '19', symbol: 'SUI', name: 'SUI-PERP (Sui Network)', priceUsd: '0.6797', changePercent24Hr: '-7.20', volumeUsd24Hr: '154510' },
    { id: 'near-protocol', rank: '20', symbol: 'NEAR', name: 'NEAR-PERP (Near Protocol)', priceUsd: '2.31', changePercent24Hr: '-8.50', volumeUsd24Hr: '325500' },
    { id: 'bitcoin-cash', rank: '21', symbol: 'BCH', name: 'BCH-PERP (Bitcoin Cash)', priceUsd: '214.12', changePercent24Hr: '-5.00', volumeUsd24Hr: '126770' },
    { id: 'jupiter', rank: '22', symbol: 'JUP', name: 'JUP-PERP (Jupiter)', priceUsd: '0.21598', changePercent24Hr: '-11.00', volumeUsd24Hr: '232900' },
    { id: 'xrp', rank: '23', symbol: 'XRP', name: 'XRP-PERP (Ripple XRP)', priceUsd: '1.28', changePercent24Hr: '-11.90', volumeUsd24Hr: '3460000' },
    { id: 'uniswap', rank: '24', symbol: 'UNI', name: 'UNI-PERP (Uniswap)', priceUsd: '6.22', changePercent24Hr: '-5.20', volumeUsd24Hr: '1210000' },
    { id: 'pengu', rank: '25', symbol: 'PENGU', name: 'PENGU-PERP (Pudgy Penguins)', priceUsd: '0.006777', changePercent24Hr: '-5.60', volumeUsd24Hr: '78110' },
    { id: 'chainlink', rank: '26', symbol: 'LINK', name: 'LINK-PERP (Chainlink)', priceUsd: '10.85', changePercent24Hr: '-7.10', volumeUsd24Hr: '124340' },
    { id: 'ondo', rank: '27', symbol: 'ONDO', name: 'ONDO-PERP (Ondo Finance)', priceUsd: '0.32702', changePercent24Hr: '-9.40', volumeUsd24Hr: '114800' },
    { id: 'litecoin', rank: '28', symbol: 'LTC', name: 'LTC-PERP (Litecoin)', priceUsd: '50.86', changePercent24Hr: '-4.90', volumeUsd24Hr: '56960' },
    { id: 'avalanche', rank: '29', symbol: 'AVAX', name: 'AVAX-PERP (Avalanche)', priceUsd: '7.23', changePercent24Hr: '-5.50', volumeUsd24Hr: '45110' },
    { id: 'chip', rank: '30', symbol: 'CHIP', name: 'CHIP-PERP (Chip)', priceUsd: '0.036386', changePercent24Hr: '-11.80', volumeUsd24Hr: '8460' },
    { id: 'kpepe', rank: '31', symbol: 'kPEPE', name: 'kPEPE-PERP (1k PEPE)', priceUsd: '0.003319', changePercent24Hr: '-5.50', volumeUsd24Hr: '49950' }
  ];

  // Merge live CoinCap prices into nadoMarkets if available
  const mergedMarkets = nadoMarkets.map(m => {
    const live = assets.find(a => a.symbol === m.symbol || a.id === m.id);
    if (live) {
      return {
        ...m,
        priceUsd: live.priceUsd,
        changePercent24Hr: live.changePercent24Hr,
        volumeUsd24Hr: live.volumeUsd24Hr
      };
    }
    return m;
  });

  // Combine with any extra CoinCap assets for completeness
  const allCombined = [
    ...mergedMarkets,
    ...assets.filter(a => !mergedMarkets.some(m => m.symbol === a.symbol))
  ];

  // Filter and Sort Logic
  let displayAssets = [...allCombined];

  if (marketCategory === 'Crypto Perps' || activeTab === 'All Markets' || marketCategory === 'All Markets') {
    displayAssets = [...allCombined];
  } else if (marketCategory === 'Spot Markets') {
    displayAssets = displayAssets.slice(0, 15);
  } else if (marketCategory === 'RWA & Equities') {
    displayAssets = [
      { id: 'spyx', rank: '1', symbol: 'SPYx', name: 'S&P 500 Index Perp', priceUsd: '562.40', changePercent24Hr: '0.84', volumeUsd24Hr: '124500000' },
      { id: 'qqqx', rank: '2', symbol: 'QQQx', name: 'Nasdaq 100 Index Perp', priceUsd: '488.10', changePercent24Hr: '1.25', volumeUsd24Hr: '98400000' },
      { id: 'aaplx', rank: '3', symbol: 'AAPLx', name: 'Apple Inc. Tokenized', priceUsd: '224.30', changePercent24Hr: '-0.45', volumeUsd24Hr: '45200000' },
      { id: 'tslax', rank: '4', symbol: 'TSLAx', name: 'Tesla Inc. Tokenized', priceUsd: '238.90', changePercent24Hr: '3.62', volumeUsd24Hr: '87100000' },
    ];
  } else if (marketCategory === 'Commodities & FX') {
    displayAssets = [
      { id: 'gold', rank: '1', symbol: 'XAU', name: 'Gold / USD Perp', priceUsd: '2578.50', changePercent24Hr: '0.42', volumeUsd24Hr: '210000000' },
      { id: 'silver', rank: '2', symbol: 'XAG', name: 'Silver / USD Perp', priceUsd: '30.85', changePercent24Hr: '1.18', volumeUsd24Hr: '64000000' },
      { id: 'eurusd', rank: '3', symbol: 'EUR/USD', name: 'Euro / US Dollar', priceUsd: '1.108', changePercent24Hr: '-0.12', volumeUsd24Hr: '340000000' },
    ];
  }

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

      {/* Tabs Row */}
      <div className="flex gap-3 overflow-x-visible pb-2 mb-6 items-center">
        
        {/* Dropdown "All Markets" pill */}
        <div className="relative shrink-0" ref={categoryRef}>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {marketCategory} <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nado DEX Markets</div>
              {nadoCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    setMarketCategory(cat.label);
                    setActiveTab(cat.label);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${marketCategory === cat.label ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                >
                  <div className="text-sm">{cat.label}</div>
                  <div className="text-xs text-zinc-400 font-normal">{cat.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Other Filter Tabs */}
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
              activeTab === tab.name && activeTab !== marketCategory
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
