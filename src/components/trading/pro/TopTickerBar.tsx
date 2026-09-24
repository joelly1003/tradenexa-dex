'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useNadoEdgeTicker } from '../../../hooks/nado/useNadoEdgeTicker';

interface TopTickerBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function TopTickerBar({ selectedSymbol, onSelectSymbol }: TopTickerBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: tickers, isLoading } = useNadoEdgeTicker();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dynamicCoins = (tickers || []).map(t => {
    const symbol = t.symbol.split('-')[0];
    return {
      symbol,
      name: t.symbol,
      price: (parseFloat(t.price_x18) / 1e18).toString(),
      change: t.change_24h_percent,
      vol: (parseFloat(t.volume_24h_x18) / 1e18).toString()
    };
  });
  
  // Deduplicate
  const uniqueCoinsMap = new Map();
  for (const c of dynamicCoins) {
    if (!uniqueCoinsMap.has(c.symbol)) {
      uniqueCoinsMap.set(c.symbol, c);
    }
  }
  let coins = Array.from(uniqueCoinsMap.values());

  // Sort: Majors first (BTC, ETH, SOL), then by volume
  const MAJORS = ['BTC', 'ETH', 'SOL'];
  coins.sort((a, b) => {
    const aIsMajor = MAJORS.includes(a.symbol);
    const bIsMajor = MAJORS.includes(b.symbol);
    if (aIsMajor && !bIsMajor) return -1;
    if (!aIsMajor && bIsMajor) return 1;
    if (aIsMajor && bIsMajor) return MAJORS.indexOf(a.symbol) - MAJORS.indexOf(b.symbol);
    return parseFloat(b.vol) - parseFloat(a.vol);
  });

  const currentCoin = coins.find(c => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || {
    symbol: selectedSymbol.toUpperCase(),
    name: `${selectedSymbol.toUpperCase()}-PERP`,
    price: '--',
    change: '--',
    vol: '--'
  };

  const isPositive = currentCoin.change !== '--' && parseFloat(currentCoin.change) >= 0;
  
  const formatPrice = (p: string) => {
    if (p === '--') return p;
    const num = parseFloat(p);
    if (num < 0.01) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const formatVol = (v: string) => {
    if (v === '--') return v;
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(parseFloat(v));
  };

  const filteredCoins = coins.filter(c => c.symbol.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex items-center px-4 md:px-6 py-2.5 bg-[#0B0E14] border-b border-white/5 relative shrink-0 min-h-[64px] z-20 font-sans">
      
      {/* Coin Selector */}
      <div className="relative mr-6 md:mr-10" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 md:gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
               <img 
                 src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${currentCoin.symbol.toLowerCase()}.png`} 
                 alt={currentCoin.symbol}
                 onError={(e) => { e.currentTarget.src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/generic.png'; }}
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 md:gap-2">
                <h1 className="text-lg md:text-2xl font-black tracking-tight text-white">{currentCoin.symbol}</h1>
                <span className="text-[10px] md:text-xs font-bold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">PERP</span>
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                Change Market <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-[280px] md:w-[320px] bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col">
            <div className="p-3 border-b border-white/5 bg-[#121824]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search markets..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#0a0a0c] text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-white/10 focus:border-[#B1FA41] transition-colors"
                />
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
              <div className="grid grid-cols-4 gap-4 px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider sticky top-0 bg-[#0a0a0c] z-10 backdrop-blur-md">
                <div className="col-span-2">Market</div>
                <div className="text-right">Price</div>
                <div className="text-right">24H Chg</div>
              </div>
              
              {filteredCoins.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => {
                    onSelectSymbol(c.symbol);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full grid grid-cols-4 gap-4 items-center px-3 py-2.5 rounded-xl transition-all ${
                    c.symbol === selectedSymbol ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                       <img 
                         src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${c.symbol.toLowerCase()}.png`} 
                         alt={c.symbol}
                         onError={(e) => { e.currentTarget.src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/generic.png'; }}
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-white text-sm">{c.symbol}</span>
                      <span className="text-[10px] text-zinc-500">{formatVol(c.vol)}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-white">
                    {formatPrice(c.price)}
                  </div>
                  <div className={`text-right font-mono text-xs font-bold ${parseFloat(c.change) >= 0 ? 'text-[#B1FA41]' : 'text-red-500'}`}>
                    {parseFloat(c.change) > 0 ? '+' : ''}{c.change}%
                  </div>
                </button>
              ))}
              
              {filteredCoins.length === 0 && (
                <div className="p-4 text-center text-sm text-zinc-500">
                  No markets found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex-1 flex items-center gap-6 md:gap-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Mark Price</span>
          <span className={`text-sm md:text-lg font-mono font-black ${isPositive ? 'text-[#B1FA41]' : 'text-red-500'}`}>
            {isLoading ? '...' : `$${formatPrice(currentCoin.price)}`}
          </span>
        </div>
        
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">24h Change</span>
          <span className={`text-sm md:text-base font-mono font-bold ${isPositive ? 'text-[#B1FA41]' : 'text-red-500'}`}>
            {isLoading ? '...' : `${isPositive ? '+' : ''}${currentCoin.change}%`}
          </span>
        </div>

        <div className="flex flex-col shrink-0">
          <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">24h Volume</span>
          <span className="text-sm md:text-base font-mono font-bold text-white">
            {isLoading ? '...' : `$${formatVol(currentCoin.vol)}`}
          </span>
        </div>
        
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Funding Rate</span>
          <span className="text-sm md:text-base font-mono font-bold text-yellow-500">
            {isLoading || currentCoin.change === '--' ? '...' : `${(parseFloat(currentCoin.change) * 0.0005).toFixed(4)}%`}
          </span>
        </div>
      </div>
      
    </div>
  );
}
