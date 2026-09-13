'use client';

import { useState, useEffect } from 'react';

export function Orderbook({ symbol = 'BTC' }: { symbol?: string }) {
  const [centerPrice, setCenterPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const idMap: Record<string, string> = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'SOL': 'solana',
          'AVAX': 'avalanche',
          'LINK': 'chainlink'
        };
        const id = idMap[symbol] || 'bitcoin';
        const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        const data = await res.json();
        if (data && data.data) {
          const p = parseFloat(data.data.priceUsd);
          setCenterPrice(prev => {
            if (prev) setLastPrice(prev);
            return p;
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Generate dynamic orderbook rows based on live centerPrice
  const tickSize = centerPrice ? (centerPrice > 1000 ? 10 : centerPrice > 10 ? 0.1 : 0.01) : 10;
  const basePrice = centerPrice || 77068;

  const asks = Array.from({ length: 14 }).map((_, i) => ({
    price: basePrice + (tickSize * (i + 1)),
    size: (Math.random() * (centerPrice && centerPrice > 1000 ? 5 : 500)).toFixed(4),
    total: (Math.random() * (centerPrice && centerPrice > 1000 ? 20 : 2000)).toFixed(4)
  })).reverse();
  
  const bids = Array.from({ length: 14 }).map((_, i) => ({
    price: basePrice - (tickSize * (i + 1)),
    size: (Math.random() * (centerPrice && centerPrice > 1000 ? 5 : 500)).toFixed(4),
    total: (Math.random() * (centerPrice && centerPrice > 1000 ? 20 : 2000)).toFixed(4)
  }));

  const isUp = !lastPrice || !centerPrice || centerPrice >= lastPrice;

  const formatPrice = (p: number) => p < 1 ? p.toFixed(6) : p < 100 ? p.toFixed(4) : p.toFixed(2);
  const displayPrice = centerPrice ? centerPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '--';

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-xs font-mono border-l border-r border-zinc-900 shrink-0">
      <div className="flex gap-4 p-3 border-b border-zinc-900 text-zinc-500 font-sans font-semibold text-sm">
        <button className="text-white border-b-2 border-zinc-700 pb-1 -mb-[13px]">Book</button>
        <button className="hover:text-white transition-colors">Trades</button>
      </div>
      
      <div className="flex justify-between px-3 py-2 text-zinc-500 border-b border-zinc-900 font-sans text-[10px] uppercase tracking-wider font-semibold">
        <span>Price</span>
        <span>Size</span>
        <span>Total {symbol}</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col py-1">
        {/* Asks (Red) */}
        <div className="flex flex-col-reverse flex-1 justify-end">
          {asks.map((ask, i) => (
            <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-zinc-800/50 cursor-pointer relative group">
              <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${Math.min(100, Number(ask.total) * (centerPrice && centerPrice > 1000 ? 5 : 0.5))}%` }} />
              <span className="text-red-500 relative z-10 w-1/3 text-left">{formatPrice(ask.price)}</span>
              <span className="text-zinc-300 relative z-10 w-1/3 text-right">{ask.size}</span>
              <span className="text-zinc-500 relative z-10 w-1/3 text-right">{ask.total}</span>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="py-2 px-3 border-y border-zinc-900 my-1 flex items-center justify-between font-sans">
          <span className={`text-lg font-bold flex items-center gap-2 font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {displayPrice} <span className="text-sm">{isUp ? '↑' : '↓'}</span>
          </span>
          <span className="text-zinc-500 font-semibold text-[10px]">Spread: 0.01%</span>
        </div>

        {/* Bids (Green) */}
        <div className="flex flex-col flex-1 justify-start">
          {bids.map((bid, i) => (
            <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-zinc-800/50 cursor-pointer relative group">
              <div className="absolute right-0 top-0 h-full bg-green-500/10" style={{ width: `${Math.min(100, Number(bid.total) * (centerPrice && centerPrice > 1000 ? 5 : 0.5))}%` }} />
              <span className="text-green-500 relative z-10 w-1/3 text-left">{formatPrice(bid.price)}</span>
              <span className="text-zinc-300 relative z-10 w-1/3 text-right">{bid.size}</span>
              <span className="text-zinc-500 relative z-10 w-1/3 text-right">{bid.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
