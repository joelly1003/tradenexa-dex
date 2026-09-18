'use client';

import { useState, useEffect, useRef } from 'react';

type Tab = 'book' | 'trades';

interface Trade {
  id: number;
  price: number;
  size: string;
  time: string;
  isBuy: boolean;
}

export function Orderbook({ symbol = 'BTC' }: { symbol?: string }) {
  const [centerPrice, setCenterPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('book');
  const [trades, setTrades] = useState<Trade[]>([]);
  const tradeIdCounter = useRef(0);

  const fallbackPrices: Record<string, number> = {
    'BTC': 75267.00,
    'ETH': 2383.40,
    'SOL': 96.56,
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const symUpper = symbol.toUpperCase();
      let fetchedPrice: number | null = null;

      try {
        // Fetch via local proxy to bypass CORS/ad-blockers and sync with TradingView
        const bRes = await fetch(`/api/binance?symbol=${symUpper === 'KPEPE' ? 'PEPE' : symUpper}`);
        if (bRes.ok) {
          const bData = await bRes.json();
          if (bData && bData.lastPrice) {
            fetchedPrice = parseFloat(bData.lastPrice);
          }
        }
        
        const priceToUse = fetchedPrice || fallbackPrices[symUpper] || 100.0;
        setCenterPrice(prev => {
          if (prev !== null && prev !== priceToUse) setLastPrice(prev);
          return priceToUse;
        });
      } catch (e) {
        console.error("Failed to fetch Binance price for Orderbook", e);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 1500); // 1.5s refresh to match TV closer
    return () => clearInterval(interval);
  }, [symbol]);

  // Fast interval for live motion tick & simulating incoming trades
  useEffect(() => {
    const motionInterval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(motionInterval);
  }, []);

  const basePrice = centerPrice || fallbackPrices[symbol.toUpperCase()] || 100.0;
  const tickSize = basePrice > 1000 ? 10 : basePrice > 100 ? 0.5 : basePrice > 10 ? 0.1 : basePrice > 1 ? 0.01 : basePrice > 0.01 ? 0.0005 : 0.00001;

  // Simulate incoming trades based on the live center price
  useEffect(() => {
    if (activeTab !== 'trades' || !basePrice) return;
    
    // Simulate 1-3 new trades every tick
    const newTradesCount = Math.floor(Math.random() * 3) + 1;
    const newTrades: Trade[] = [];
    
    for (let i = 0; i < newTradesCount; i++) {
      tradeIdCounter.current += 1;
      const isBuy = Math.random() > 0.5;
      const priceOffset = (Math.random() * tickSize * 2) * (isBuy ? 1 : -1);
      const tradePrice = basePrice + priceOffset;
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      newTrades.push({
        id: tradeIdCounter.current,
        price: tradePrice,
        size: (Math.random() * (basePrice > 1000 ? 2 : 200)).toFixed(4),
        time: timeStr,
        isBuy
      });
    }

    setTrades(prev => [...newTrades, ...prev].slice(0, 50));
  }, [tick, basePrice, activeTab, tickSize]);

  // Initial population of trades if empty
  useEffect(() => {
    if (activeTab === 'trades' && trades.length === 0 && basePrice) {
      const initial: Trade[] = [];
      const now = new Date();
      for (let i = 0; i < 30; i++) {
        tradeIdCounter.current += 1;
        const isBuy = Math.random() > 0.5;
        const time = new Date(now.getTime() - i * 2000);
        initial.push({
          id: tradeIdCounter.current,
          price: basePrice + (Math.random() * tickSize * 2 * (isBuy ? 1 : -1)),
          size: (Math.random() * (basePrice > 1000 ? 2 : 200)).toFixed(4),
          time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`,
          isBuy
        });
      }
      setTrades(initial);
    }
  }, [activeTab, basePrice, trades.length, tickSize]);

  // 15 lines for Asks and 15 lines for Bids
  const asks = Array.from({ length: 15 }).map((_, i) => {
    const noise = Math.sin(tick + i) * 0.15 + 1;
    const sizeVal = (Math.random() * (basePrice > 1000 ? 5 : 500) * noise).toFixed(4);
    const totalVal = (Math.random() * (basePrice > 1000 ? 20 : 2000) * noise).toFixed(4);
    return {
      price: basePrice + (tickSize * (i + 1)),
      size: sizeVal,
      total: totalVal
    };
  }).reverse();
  
  const bids = Array.from({ length: 15 }).map((_, i) => {
    const noise = Math.cos(tick + i) * 0.15 + 1;
    const sizeVal = (Math.random() * (basePrice > 1000 ? 5 : 500) * noise).toFixed(4);
    const totalVal = (Math.random() * (basePrice > 1000 ? 20 : 2000) * noise).toFixed(4);
    return {
      price: basePrice - (tickSize * (i + 1)),
      size: sizeVal,
      total: totalVal
    };
  });

  const isUp = !lastPrice || !centerPrice || centerPrice >= lastPrice;

  const formatPrice = (p: number) => {
    if (p < 0.01) return p.toFixed(6);
    if (p < 1) return p.toFixed(4);
    if (p < 100) return p.toFixed(2);
    return p.toFixed(2);
  };

  const displayPrice = basePrice < 0.01 ? basePrice.toFixed(6) : basePrice < 1 ? basePrice.toFixed(4) : basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-xs font-mono border-l border-r border-zinc-900 shrink-0">
      <div className="flex gap-4 p-3 border-b border-zinc-900 text-zinc-500 font-sans font-semibold text-sm">
        <button 
          onClick={() => setActiveTab('book')}
          className={`transition-colors pb-1 -mb-[13px] ${activeTab === 'book' ? 'text-white border-b-2 border-zinc-700' : 'hover:text-white border-b-2 border-transparent'}`}
        >
          Book
        </button>
        <button 
          onClick={() => setActiveTab('trades')}
          className={`transition-colors pb-1 -mb-[13px] ${activeTab === 'trades' ? 'text-white border-b-2 border-zinc-700' : 'hover:text-white border-b-2 border-transparent'}`}
        >
          Trades
        </button>
      </div>
      
      {activeTab === 'book' ? (
        <>
          <div className="flex justify-between px-3 py-2 text-zinc-500 border-b border-zinc-900 font-sans text-[10px] uppercase tracking-wider font-semibold">
            <span>Price</span>
            <span>Size</span>
            <span>Total {symbol.toUpperCase()}</span>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
            {/* Asks (Red) */}
            <div className="flex flex-col-reverse flex-1 justify-end">
              {asks.map((ask, i) => (
                <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-zinc-800/50 cursor-pointer relative group">
                  <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${Math.min(100, Number(ask.total) * (basePrice > 1000 ? 5 : 0.5))}%` }} />
                  <span className="text-red-500 relative z-10 w-1/3 text-left">{formatPrice(ask.price)}</span>
                  <span className="text-zinc-300 relative z-10 w-1/3 text-right">{ask.size}</span>
                  <span className="text-zinc-500 relative z-10 w-1/3 text-right">{ask.total}</span>
                </div>
              ))}
            </div>

            {/* Current Price */}
            <div className="py-2 px-3 border-y border-zinc-900 my-1 flex items-center justify-between font-sans">
              <span className={`text-lg font-bold flex items-center gap-2 font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                ${displayPrice} <span className="text-sm">{isUp ? '↑' : '↓'}</span>
              </span>
              <span className="text-zinc-500 font-semibold text-[10px]">Spread: 0.01%</span>
            </div>

            {/* Bids (Green) */}
            <div className="flex flex-col flex-1 justify-start">
              {bids.map((bid, i) => (
                <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-zinc-800/50 cursor-pointer relative group">
                  <div className="absolute right-0 top-0 h-full bg-green-500/10" style={{ width: `${Math.min(100, Number(bid.total) * (basePrice > 1000 ? 5 : 0.5))}%` }} />
                  <span className="text-green-500 relative z-10 w-1/3 text-left">{formatPrice(bid.price)}</span>
                  <span className="text-zinc-300 relative z-10 w-1/3 text-right">{bid.size}</span>
                  <span className="text-zinc-500 relative z-10 w-1/3 text-right">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between px-3 py-2 text-zinc-500 border-b border-zinc-900 font-sans text-[10px] uppercase tracking-wider font-semibold">
            <span className="w-1/3 text-left">Price</span>
            <span className="w-1/3 text-right">Size</span>
            <span className="w-1/3 text-right">Time</span>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
            {trades.map((trade) => (
              <div key={trade.id} className="flex justify-between px-3 py-1 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <span className={`w-1/3 text-left ${trade.isBuy ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPrice(trade.price)}
                </span>
                <span className="text-zinc-300 w-1/3 text-right">{trade.size}</span>
                <span className="text-zinc-500 w-1/3 text-right">{trade.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

