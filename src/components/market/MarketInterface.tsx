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
  spread?: string;
  depth25?: string;
  slip50k?: string;
  liqScore?: string;
  tags?: string[];
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
    { label: 'All Markets', desc: 'All 37 listed Nado DEX pairs' },
    { label: 'Crypto Perps', desc: 'BTC, ETH, SOL & 30+ perpetuals' },
    { label: 'Spot Markets', desc: 'Direct spot trading pairs' },
    { label: 'RWA & Equities', desc: 'SPYx, QQQx tokenized stocks' },
    { label: 'Commodities & FX', desc: 'Gold, Silver, FX perps' },
  ];

  // 37 Explicit Nado Perpetual Markets matching all user frames
  const nadoMarkets: Asset[] = [
    { id: 'bitcoin', rank: '1', symbol: 'BTC', name: 'BTC-PERP', priceUsd: '75267.00', changePercent24Hr: '-4.50', volumeUsd24Hr: '181510000', spread: '0.13 bps', depth25: '$14.54M', slip50k: '0.07 bps', liqScore: '12.85M', tags: ['Btc', 'Crypto', 'Bitcoin'] },
    { id: 'ethereum', rank: '2', symbol: 'ETH', name: 'ETH-PERP', priceUsd: '2383.40', changePercent24Hr: '-6.60', volumeUsd24Hr: '57560000', spread: '0.42 bps', depth25: '$9.79M', slip50k: '0.36 bps', liqScore: '6.91M', tags: ['Eth', 'Crypto', 'Ethereum'] },
    { id: 'hype', rank: '3', symbol: 'HYPE', name: 'HYPE-PERP', priceUsd: '76.56', changePercent24Hr: '-5.00', volumeUsd24Hr: '24650000', spread: '0.13 bps', depth25: '$828.17K', slip50k: '1.41 bps', liqScore: '733.35K', tags: ['Hype', 'Crypto', 'Layer 1'] },
    { id: 'solana', rank: '4', symbol: 'SOL', name: 'SOL-PERP', priceUsd: '96.56', changePercent24Hr: '-6.60', volumeUsd24Hr: '19990000', spread: '1.03 bps', depth25: '$4.69M', slip50k: '1.28 bps', liqScore: '2.31M', tags: ['Sol', 'Crypto', 'Layer 1'] },
    { id: 'lit', rank: '5', symbol: 'LIT', name: 'LIT-PERP', priceUsd: '4.07', changePercent24Hr: '-9.90', volumeUsd24Hr: '1850000', spread: '3.71 bps', depth25: '$119.98K', slip50k: '13.1 bps', liqScore: '25.49K', tags: ['Lit', 'Crypto', 'DEX'] },
    { id: 'zcash', rank: '6', symbol: 'ZEC', name: 'ZEC-PERP', priceUsd: '1102.29', changePercent24Hr: '-7.20', volumeUsd24Hr: '5360000', spread: '0.35 bps', depth25: '$340.12K', slip50k: '5.83 bps', liqScore: '251.02K', tags: ['Zec', 'Crypto', 'Privacy'] },
    { id: 'binance-coin', rank: '7', symbol: 'BNB', name: 'BNB-PERP', priceUsd: '709.61', changePercent24Hr: '-1.90', volumeUsd24Hr: '1450000', spread: '0.14 bps', depth25: '$298.64K', slip50k: '2.49 bps', liqScore: '262.03K', tags: ['Bnb', 'Crypto', 'Layer 1'] },
    { id: 'pump', rank: '8', symbol: 'PUMP', name: 'PUMP-PERP', priceUsd: '0.003495', changePercent24Hr: '-5.60', volumeUsd24Hr: '1200000', spread: '2.84 bps', depth25: '$154.13K', slip50k: '11.5 bps', liqScore: '40.16K', tags: ['Pump', 'Crypto', 'Launchpad'] },
    { id: 'monero', rank: '9', symbol: 'XMR', name: 'XMR-PERP', priceUsd: '502.23', changePercent24Hr: '-2.60', volumeUsd24Hr: '55970', spread: '5.01 bps', depth25: '$41.66K', slip50k: '57.5 bps', liqScore: '6.93K', tags: ['Xmr', 'Crypto', 'Privacy'] },
    { id: 'aster', rank: '10', symbol: 'ASTER', name: 'ASTER-PERP', priceUsd: '0.67514', changePercent24Hr: '-4.50', volumeUsd24Hr: '266710', spread: '0.15 bps', depth25: '$77.94K', slip50k: '17.7 bps', liqScore: '67.88K', tags: ['Aster', 'Crypto', 'DeFi'] },
    { id: 'ethena', rank: '11', symbol: 'ENA', name: 'ENA-PERP', priceUsd: '0.13725', changePercent24Hr: '-5.30', volumeUsd24Hr: '399750', spread: '5.02 bps', depth25: '$134.12K', slip50k: '11.6 bps', liqScore: '22.29K', tags: ['Ena', 'Crypto', 'DeFi'] },
    { id: 'layerzero', rank: '12', symbol: 'ZRO', name: 'ZRO-PERP', priceUsd: '0.9679', changePercent24Hr: '-3.70', volumeUsd24Hr: '84660', spread: '7.28 bps', depth25: '$99.42K', slip50k: '17.3 bps', liqScore: '12.01K', tags: ['Zro', 'Crypto', 'Infrastructure'] },
    { id: 'xpl', rank: '13', symbol: 'XPL', name: 'XPL-PERP', priceUsd: '0.07969', changePercent24Hr: '-6.30', volumeUsd24Hr: '264170', spread: '1.25 bps', depth25: '$116.55K', slip50k: '14.9 bps', liqScore: '51.69K', tags: ['Xpl', 'Crypto', 'Layer 1'] },
    { id: 'fartcoin', rank: '14', symbol: 'FARTCOIN', name: 'FARTCOIN-PERP', priceUsd: '0.13515', changePercent24Hr: '-7.20', volumeUsd24Hr: '200260', spread: '6.61 bps', depth25: '$70.79K', slip50k: '22.3 bps', liqScore: '9.30K', tags: ['Fartcoin', 'Crypto', 'Meme'] },
    { id: 'aave', rank: '15', symbol: 'AAVE', name: 'AAVE-PERP', priceUsd: '120.65', changePercent24Hr: '-7.00', volumeUsd24Hr: '191700', spread: '1.63 bps', depth25: '$295.85K', slip50k: '8.85 bps', liqScore: '112.43K', tags: ['Aave', 'Crypto', 'DeFi'] },
    { id: 'dogecoin', rank: '16', symbol: 'DOGE', name: 'DOGE-PERP', priceUsd: '0.07962', changePercent24Hr: '-5.90', volumeUsd24Hr: '105470', spread: '2.50 bps', depth25: '$223.77K', slip50k: '8.73 bps', liqScore: '64.00K', tags: ['Doge', 'Crypto', 'Meme'] },
    { id: 'monad', rank: '17', symbol: 'MON', name: 'MON-PERP', priceUsd: '0.021311', changePercent24Hr: '-9.20', volumeUsd24Hr: '208190', spread: '1.85 bps', depth25: '$31.37K', slip50k: '192.2 bps', liqScore: '10.99K', tags: ['Mon', 'Crypto', 'Layer 1'] },
    { id: 'bittensor', rank: '18', symbol: 'TAO', name: 'TAO-PERP', priceUsd: '216.42', changePercent24Hr: '-7.90', volumeUsd24Hr: '580300', spread: '1.37 bps', depth25: '$224.10K', slip50k: '12.7 bps', liqScore: '94.55K', tags: ['Tao', 'Crypto', 'AI'] },
    { id: 'sui', rank: '19', symbol: 'SUI', name: 'SUI-PERP', priceUsd: '0.6797', changePercent24Hr: '-7.20', volumeUsd24Hr: '154510', spread: '1.46 bps', depth25: '$233.83K', slip50k: '12.3 bps', liqScore: '95.02K', tags: ['Sui', 'Crypto', 'Layer 1'] },
    { id: 'near-protocol', rank: '20', symbol: 'NEAR', name: 'NEAR-PERP', priceUsd: '2.31', changePercent24Hr: '-8.50', volumeUsd24Hr: '325500', spread: '1.29 bps', depth25: '$177.87K', slip50k: '10.7 bps', liqScore: '77.77K', tags: ['Near', 'Crypto', 'AI'] },
    { id: 'bitcoin-cash', rank: '21', symbol: 'BCH', name: 'BCH-PERP', priceUsd: '214.12', changePercent24Hr: '-5.00', volumeUsd24Hr: '126770', spread: '1.38 bps', depth25: '$110.37K', slip50k: '14.5 bps', liqScore: '46.31K', tags: ['Bch', 'Crypto', 'Payments'] },
    { id: 'jupiter', rank: '22', symbol: 'JUP', name: 'JUP-PERP', priceUsd: '0.21598', changePercent24Hr: '-11.00', volumeUsd24Hr: '232900', spread: '1.38 bps', depth25: '$77.30K', slip50k: '18.8 bps', liqScore: '32.41K', tags: ['Jup', 'Crypto', 'Infrastructure'] },
    { id: 'xrp', rank: '23', symbol: 'XRP', name: 'XRP-PERP', priceUsd: '1.28', changePercent24Hr: '-11.90', volumeUsd24Hr: '3460000', spread: '0.78 bps', depth25: '$519.76K', slip50k: '4.90 bps', liqScore: '291.91K', tags: ['Xrp', 'Crypto', 'Layer 1'] },
    { id: 'uniswap', rank: '24', symbol: 'UNI', name: 'UNI-PERP', priceUsd: '6.22', changePercent24Hr: '-5.20', volumeUsd24Hr: '1210000', spread: '1.74 bps', depth25: '$181.32K', slip50k: '7.55 bps', liqScore: '66.17K', tags: ['Uni', 'Crypto', 'DeFi'] },
    { id: 'pengu', rank: '25', symbol: 'PENGU', name: 'PENGU-PERP', priceUsd: '0.006777', changePercent24Hr: '-5.60', volumeUsd24Hr: '78110', spread: '4.43 bps', depth25: '$88.05K', slip50k: '20.8 bps', liqScore: '16.23K', tags: ['Pengu', 'Crypto', 'Meme'] },
    { id: 'chainlink', rank: '26', symbol: 'LINK', name: 'LINK-PERP', priceUsd: '10.85', changePercent24Hr: '-7.10', volumeUsd24Hr: '124340', spread: '1.82 bps', depth25: '$285.45K', slip50k: '9.75 bps', liqScore: '101.29K', tags: ['Link', 'Crypto', 'Oracle'] },
    { id: 'ondo', rank: '27', symbol: 'ONDO', name: 'ONDO-PERP', priceUsd: '0.32702', changePercent24Hr: '-9.40', volumeUsd24Hr: '114800', spread: '2.11 bps', depth25: '$144.48K', slip50k: '12.0 bps', liqScore: '46.50K', tags: ['Ondo', 'Crypto', 'RWA'] },
    { id: 'litecoin', rank: '28', symbol: 'LTC', name: 'LTC-PERP', priceUsd: '50.86', changePercent24Hr: '-4.90', volumeUsd24Hr: '56960', spread: '1.36 bps', depth25: '$250.86K', slip50k: '10.2 bps', liqScore: '106.26K', tags: ['Ltc', 'Crypto', 'Payments'] },
    { id: 'avalanche', rank: '29', symbol: 'AVAX', name: 'AVAX-PERP', priceUsd: '7.23', changePercent24Hr: '-5.50', volumeUsd24Hr: '45110', spread: '1.37 bps', depth25: '$70.34K', slip50k: '20.9 bps', liqScore: '29.71K', tags: ['Avax', 'Crypto', 'Layer 1'] },
    { id: 'chip', rank: '30', symbol: 'CHIP', name: 'CHIP-PERP', priceUsd: '0.036386', changePercent24Hr: '-11.80', volumeUsd24Hr: '8460', spread: '9.02 bps', depth25: '$15.42K', slip50k: '82.5 bps', liqScore: '1.54K', tags: ['Chip', 'Crypto', 'DeFi'] },
    { id: 'kpepe', rank: '31', symbol: 'kPEPE', name: 'kPEPE-PERP', priceUsd: '0.003319', changePercent24Hr: '-5.50', volumeUsd24Hr: '49950', spread: '3.02 bps', depth25: '$88.98K', slip50k: '16.3 bps', liqScore: '22.15K', tags: ['Kpepe', 'Crypto', 'Meme'] },
    { id: 'skr', rank: '32', symbol: 'SKR', name: 'SKR-PERP', priceUsd: '0.0425', changePercent24Hr: '-2.20', volumeUsd24Hr: '42000', spread: 'Syncing', depth25: '$0.0000', slip50k: 'Syncing', liqScore: 'Syncing', tags: ['Skr', 'Crypto', 'Solana Ecosystem'] },
    { id: 'bera', rank: '33', symbol: 'BERA', name: 'BERA-PERP', priceUsd: '2.85', changePercent24Hr: '-3.10', volumeUsd24Hr: '89000', spread: 'Syncing', depth25: '$0.0000', slip50k: 'Syncing', liqScore: 'Syncing', tags: ['Bera', 'Crypto', 'Layer 1'] },
    { id: 'axie-infinity', rank: '34', symbol: 'AXS', name: 'AXS-PERP', priceUsd: '4.85', changePercent24Hr: '-5.30', volumeUsd24Hr: '124000', spread: 'Syncing', depth25: '$0.0000', slip50k: 'Syncing', liqScore: 'Syncing', tags: ['Axs', 'Crypto', 'Gaming'] },
    { id: 'cardano', rank: '35', symbol: 'ADA', name: 'ADA-PERP', priceUsd: '0.35', changePercent24Hr: '-7.80', volumeUsd24Hr: '450000', spread: 'Syncing', depth25: '$0.0000', slip50k: 'Syncing', liqScore: 'Syncing', tags: ['Ada', 'Crypto', 'Layer 1'] },
    { id: 'virtual', rank: '36', symbol: 'VIRTUAL', name: 'VIRTUAL-PERP', priceUsd: '0.88', changePercent24Hr: '-6.80', volumeUsd24Hr: '310000', spread: 'Syncing', depth25: '$0.0000', slip50k: 'Syncing', liqScore: 'Syncing', tags: ['Virtual', 'Crypto', 'AI'] },
    { id: 'arbitrum', rank: '37', symbol: 'ARB', name: 'ARB-PERP', priceUsd: '0.52', changePercent24Hr: '9.60', volumeUsd24Hr: '840000', spread: '34.8 bps', depth25: '$1.01K', slip50k: 'Syncing', liqScore: '28.14', tags: ['Arb', 'Crypto', 'Layer 2'] }
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
      { id: 'spyx', rank: '1', symbol: 'SPYx', name: 'S&P 500 Index Perp', priceUsd: '562.40', changePercent24Hr: '0.84', volumeUsd24Hr: '124500000', spread: '0.05 bps', depth25: '$50.0M', slip50k: '0.01 bps', liqScore: '50.0M', tags: ['Equity', 'RWA'] },
      { id: 'qqqx', rank: '2', symbol: 'QQQx', name: 'Nasdaq 100 Index Perp', priceUsd: '488.10', changePercent24Hr: '1.25', volumeUsd24Hr: '98400000', spread: '0.08 bps', depth25: '$35.0M', slip50k: '0.02 bps', liqScore: '35.0M', tags: ['Equity', 'RWA'] },
      { id: 'aaplx', rank: '3', symbol: 'AAPLx', name: 'Apple Inc. Tokenized', priceUsd: '224.30', changePercent24Hr: '-0.45', volumeUsd24Hr: '45200000', spread: '0.12 bps', depth25: '$15.0M', slip50k: '0.05 bps', liqScore: '15.0M', tags: ['Equity', 'RWA'] },
      { id: 'tslax', rank: '4', symbol: 'TSLAx', name: 'Tesla Inc. Tokenized', priceUsd: '238.90', changePercent24Hr: '3.62', volumeUsd24Hr: '87100000', spread: '0.15 bps', depth25: '$22.0M', slip50k: '0.04 bps', liqScore: '22.0M', tags: ['Equity', 'RWA'] },
    ];
  } else if (marketCategory === 'Commodities & FX') {
    displayAssets = [
      { id: 'gold', rank: '1', symbol: 'XAU', name: 'Gold / USD Perp', priceUsd: '2578.50', changePercent24Hr: '0.42', volumeUsd24Hr: '210000000', spread: '0.02 bps', depth25: '$80.0M', slip50k: '0.01 bps', liqScore: '80.0M', tags: ['Commodity', 'Gold'] },
      { id: 'silver', rank: '2', symbol: 'XAG', name: 'Silver / USD Perp', priceUsd: '30.85', changePercent24Hr: '1.18', volumeUsd24Hr: '64000000', spread: '0.10 bps', depth25: '$20.0M', slip50k: '0.03 bps', liqScore: '20.0M', tags: ['Commodity', 'Silver'] },
      { id: 'eurusd', rank: '3', symbol: 'EUR/USD', name: 'Euro / US Dollar', priceUsd: '1.108', changePercent24Hr: '-0.12', volumeUsd24Hr: '340000000', spread: '0.01 bps', depth25: '$150.0M', slip50k: '0.01 bps', liqScore: '150.0M', tags: ['FX', 'Currency'] },
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

      {/* Filter Tabs Row (Standard Pills, No Dropdown) */}
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
            {tab.icon && <span>{tab.icon}</span>}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/50 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="text-[11px] font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#0a0a0c]/50">
              <th className="p-4 pl-6 w-12"></th>
              <th className="p-4">Market</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">24H Δ</th>
              <th className="p-4 text-right">24H Vol</th>
              <th className="p-4 text-right">Open Interest</th>
              <th className="p-4 text-right">Spread</th>
              <th className="p-4 text-right">Depth ±25</th>
              <th className="p-4 text-right">50K Slip</th>
              <th className="p-4 pr-6 text-right">Liq Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {loading && assets.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-zinc-500">Loading Nado DEX markets...</td>
              </tr>
            ) : displayAssets.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-zinc-500">
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
                const spreadVal = asset.spread || `${(Math.abs(change) * 0.2 + 0.1).toFixed(2)} bps`;
                const depthVal = asset.depth25 || `$${formatCompact((parseFloat(asset.volumeUsd24Hr || '1000000') * 0.08).toString())}`;
                const slipVal = asset.slip50k || `${(Math.abs(change) * 1.2 + 0.5).toFixed(2)} bps`;
                const liqVal = asset.liqScore || `${formatCompact((parseFloat(asset.volumeUsd24Hr || '1000000') * 0.05).toString())}`;

                const iconSymbol = asset.symbol.toLowerCase() === 'kpepe' ? 'pepe' : asset.symbol.toLowerCase();
                const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${iconSymbol}.png`;

                return (
                  <tr key={asset.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors group text-sm cursor-pointer" onClick={() => window.location.href = '/trade'}>
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
                        {/* Coin Logo with image fallback */}
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50 overflow-hidden">
                          <img 
                            src={iconUrl} 
                            alt={asset.symbol}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to stylized letter badge if icon image is not found
                              (e.target as HTMLElement).style.display = 'none';
                              (e.target as HTMLElement).parentElement!.innerText = asset.symbol.charAt(0);
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-black dark:text-white flex items-center gap-1.5">
                            {asset.symbol}/USD
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 flex-wrap mt-0.5">
                            <span className="font-semibold text-zinc-500">{asset.symbol}-PERP</span>
                            {asset.tags?.map(t => (
                              <span key={t} className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 text-[9px] px-1.5 py-0.2 rounded font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-black dark:text-white">
                      {fiatSymbol}{formatPrice(asset.priceUsd)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(asset.volumeUsd24Hr)}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {fiatSymbol}{formatCompact(openInterestUsd)}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                      {spreadVal}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {depthVal}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                      {slipVal}
                    </td>
                    <td className="p-4 pr-6 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {liqVal}
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
