'use client';

import { useState, useEffect } from 'react';

interface TopTickerBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function TopTickerBar({ selectedSymbol, onSelectSymbol }: TopTickerBarProps) {
  const [priceData, setPriceData] = useState<{ price: string, change: string, vol: string }>({
    price: '--', change: '--', vol: '--'
  });

  useEffect(() => {
    // Fetch live price for the selected symbol to replace mock data
    const fetchPrice = async () => {
      try {
        const idMap: Record<string, string> = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'SOL': 'solana',
          'AVAX': 'avalanche',
          'LINK': 'chainlink'
        };
        const id = idMap[selectedSymbol] || 'bitcoin';
        const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        const data = await res.json();
        if (data && data.data) {
          const price = parseFloat(data.data.priceUsd);
          const change = parseFloat(data.data.changePercent24Hr);
          const vol = parseFloat(data.data.volumeUsd24Hr);
          setPriceData({
            price: price < 0.01 ? price.toFixed(6) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: change.toFixed(2),
            vol: Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(vol)
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const isPositive = parseFloat(priceData.change) >= 0;

  return (
    <div className="flex items-center gap-6 p-3 bg-zinc-950 border-b border-zinc-800 text-sm overflow-x-auto whitespace-nowrap shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center gap-3 pr-6 border-r border-zinc-800 shrink-0">
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white">
          {selectedSymbol.charAt(0)}
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedSymbol}
            onChange={(e) => onSelectSymbol(e.target.value)}
            className="bg-transparent font-bold text-lg text-white outline-none cursor-pointer hover:text-blue-400 transition-colors appearance-none"
          >
            <option value="BTC" className="bg-zinc-900 text-white">BTC</option>
            <option value="ETH" className="bg-zinc-900 text-white">ETH</option>
            <option value="SOL" className="bg-zinc-900 text-white">SOL</option>
            <option value="AVAX" className="bg-zinc-900 text-white">AVAX</option>
            <option value="LINK" className="bg-zinc-900 text-white">LINK</option>
          </select>
          <span className="text-xs font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded pointer-events-none">▼ Perp</span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono font-bold text-lg`}>
          {priceData.price !== '--' ? `$${priceData.price}` : '--'}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Oracle Price</span>
        <span className="text-white font-mono">{priceData.price !== '--' ? `$${priceData.price}` : '--'}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Change</span>
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono`}>
          {isPositive ? '+' : ''}{priceData.change}%
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Volume</span>
        <span className="text-white font-mono">{priceData.vol !== '--' ? `$${priceData.vol}` : '--'}</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Est. Funding (1h)</span>
        <span className="text-green-500 font-mono">+0.0011%</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Status</span>
        <span className="text-green-500 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
        </span>
      </div>
    </div>
  );
}
