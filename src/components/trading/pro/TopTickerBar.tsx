'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNadoEdgeTicker } from '../../../hooks/nado/useNadoEdgeTicker';

interface TopTickerBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function TopTickerBar({ selectedSymbol, onSelectSymbol }: TopTickerBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: tickers, isLoading, isError } = useNadoEdgeTicker();

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
      color: 'bg-blue-600 text-white',
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
  const coins = Array.from(uniqueCoinsMap.values());

  const currentCoin = coins.find(c => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || {
    symbol: selectedSymbol.toUpperCase(),
    name: `${selectedSymbol.toUpperCase()}-PERP`,
    color: 'bg-blue-600 text-white',
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
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(parseFloat(v));
  };

  return (
    <div className="flex items-center gap-6 p-3 bg-zinc-950 border-b border-zinc-800 text-sm overflow-x-visible whitespace-nowrap shrink-0">
      <div className="flex items-center pr-6 border-r border-zinc-800 shrink-0 relative" ref={dropdownRef}>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-zinc-900 px-2 py-1 -ml-2 rounded-lg transition-colors"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${currentCoin.color}`}>
            {selectedSymbol.charAt(0)}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white flex items-center gap-2">
              {selectedSymbol} <span className="text-xs font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Perp</span>
            </h1>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-3 w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 transform origin-top-left transition-all ring-1 ring-white/5">
            <div className="p-3 text-[11px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950/80 border-b border-zinc-800">Select Market</div>
            <div className="flex flex-col max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {coins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => {
                    onSelectSymbol(coin.symbol);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors w-full text-left ${selectedSymbol.toUpperCase() === coin.symbol.toUpperCase() ? 'bg-blue-600/20 text-blue-400' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${coin.color}`}>
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{coin.symbol}-PERP</div>
                    <div className="text-zinc-400 text-xs">{coin.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono font-bold text-lg`}>
          {currentCoin.price !== '--' ? `$${formatPrice(currentCoin.price)}` : '--'}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Change</span>
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono`}>
          {isPositive ? '+' : ''}{currentCoin.change !== '--' ? parseFloat(currentCoin.change).toFixed(2) : '--'}%
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Volume</span>
        <span className="text-white font-mono">{currentCoin.vol !== '--' ? `$${formatVol(currentCoin.vol)}` : '--'}</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Est. Funding (1h)</span>
        <span className="text-green-500 font-mono">+0.0011%</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Status</span>
        {isLoading ? (
          <span className="text-yellow-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Connecting
          </span>
        ) : isError ? (
          <span className="text-red-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Offline
          </span>
        ) : (
          <span className="text-green-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
          </span>
        )}
      </div>
    </div>
  );
}
