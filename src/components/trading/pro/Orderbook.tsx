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

interface OrderbookEntry {
  price: number;
  size: string;
  total: string;
}

export function Orderbook({ symbol = 'BTC' }: { symbol?: string }) {
  const [centerPrice, setCenterPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('book');
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const [asks, setAsks] = useState<OrderbookEntry[]>([]);
  const [bids, setBids] = useState<OrderbookEntry[]>([]);

  useEffect(() => {
    const symUpper = symbol.toUpperCase() === 'KPEPE' ? 'PEPE' : symbol.toUpperCase();
    
    const fetchOrderbookAndTrades = async () => {
      try {
        if (activeTab === 'book') {
          const depthRes = await fetch(`https://data-api.binance.vision/api/v3/depth?symbol=${symUpper}USDT&limit=15`);
          if (depthRes.ok) {
            const depthData = await depthRes.json();
            
            let askTotal = 0;
            const formattedAsks = depthData.asks.map((a: string[]) => {
              const p = parseFloat(a[0]);
              const s = parseFloat(a[1]);
              askTotal += s;
              return { price: p, size: s.toFixed(4), total: askTotal.toFixed(4) };
            }).reverse();

            let bidTotal = 0;
            const formattedBids = depthData.bids.map((b: string[]) => {
              const p = parseFloat(b[0]);
              const s = parseFloat(b[1]);
              bidTotal += s;
              return { price: p, size: s.toFixed(4), total: bidTotal.toFixed(4) };
            });

            setAsks(formattedAsks);
            setBids(formattedBids);
          }
        } else {
          const tradesRes = await fetch(`https://data-api.binance.vision/api/v3/trades?symbol=${symUpper}USDT&limit=30`);
          if (tradesRes.ok) {
            const tradesData = await tradesRes.json();
            const formattedTrades = tradesData.map((t: any) => {
              const d = new Date(t.time);
              const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
              return {
                id: t.id,
                price: parseFloat(t.price),
                size: parseFloat(t.qty).toFixed(4),
                time: timeStr,
                isBuy: t.isBuyerMaker
              };
            }).reverse();
            setTrades(formattedTrades);
          }
        }
        
        // Also update price
        const tickerRes = await fetch(`/api/binance?symbol=${symUpper}`);
        if (tickerRes.ok) {
          const tickerData = await tickerRes.json();
          if (tickerData && tickerData.lastPrice) {
            const price = parseFloat(tickerData.lastPrice);
            setCenterPrice(prev => {
              if (prev !== null && prev !== price) setLastPrice(prev);
              return price;
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch orderbook/trades", e);
      }
    };

    fetchOrderbookAndTrades();
    const interval = setInterval(fetchOrderbookAndTrades, 2000); // 2s refresh for orderbook
    return () => clearInterval(interval);
  }, [symbol, activeTab]);

  const basePrice = centerPrice || (bids.length > 0 ? bids[0].price : 0);
  const isUp = !lastPrice || !centerPrice || centerPrice >= lastPrice;

  const formatPrice = (p: number) => {
    if (p < 0.01) return p.toFixed(6);
    if (p < 1) return p.toFixed(4);
    if (p < 100) return p.toFixed(2);
    return p.toFixed(2);
  };

  const displayPrice = basePrice === 0 ? "..." : basePrice < 0.01 ? basePrice.toFixed(6) : basePrice < 1 ? basePrice.toFixed(4) : basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const maxAskTotal = asks.length > 0 ? parseFloat(asks[0].total) : 1;
  const maxBidTotal = bids.length > 0 ? parseFloat(bids[bids.length - 1].total) : 1;

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
                  <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${Math.min(100, (parseFloat(ask.total) / maxAskTotal) * 100)}%` }} />
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
              <span className="text-zinc-500 font-semibold text-[10px]">Spread: {asks.length > 0 && bids.length > 0 ? ((asks[asks.length-1].price - bids[0].price) / bids[0].price * 100).toFixed(3) : "0.01"}%</span>
            </div>

            {/* Bids (Green) */}
            <div className="flex flex-col flex-1 justify-start">
              {bids.map((bid, i) => (
                <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-zinc-800/50 cursor-pointer relative group">
                  <div className="absolute right-0 top-0 h-full bg-green-500/10" style={{ width: `${Math.min(100, (parseFloat(bid.total) / maxBidTotal) * 100)}%` }} />
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
