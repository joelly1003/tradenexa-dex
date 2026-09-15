'use client';

import { useState, useEffect } from 'react';

export function Orderbook({ symbol = 'BTC' }: { symbol?: string }) {
  const [centerPrice, setCenterPrice] = useState<number | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  const fallbackPrices: Record<string, number> = {
    'BTC': 75267.00,
    'ETH': 2383.40,
    'HYPE': 76.56,
    'SOL': 96.56,
    'LIT': 4.07,
    'ZEC': 1102.29,
    'BNB': 709.61,
    'PUMP': 0.003495,
    'XMR': 502.23,
    'ASTER': 0.67514,
    'ENA': 0.13725,
    'ZRO': 0.9679,
    'XPL': 0.07969,
    'FARTCOIN': 0.13515,
    'AAVE': 120.65,
    'DOGE': 0.07962,
    'MON': 0.021311,
    'TAO': 216.42,
    'SUI': 0.6797,
    'NEAR': 2.31,
    'BCH': 214.12,
    'JUP': 0.21598,
    'XRP': 1.28,
    'UNI': 6.22,
    'PENGU': 0.006777,
    'LINK': 10.85,
    'ONDO': 0.32702,
    'LTC': 50.86,
    'AVAX': 7.23,
    'CHIP': 0.036386,
    'KPEPE': 0.003319,
    'SKR': 0.0425,
    'BERA': 2.85,
    'AXS': 4.85,
    'ADA': 0.35,
    'VIRTUAL': 0.88,
    'ARB': 0.52
  };

  const idMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'HYPE': 'hyperliquid',
    'SOL': 'solana',
    'LIT': 'litentry',
    'ZEC': 'zcash',
    'BNB': 'binance-coin',
    'PUMP': 'pump-fun',
    'XMR': 'monero',
    'ASTER': 'aster',
    'ENA': 'ethena',
    'ZRO': 'layerzero',
    'XPL': 'plasma',
    'FARTCOIN': 'fartcoin',
    'AAVE': 'aave',
    'DOGE': 'dogecoin',
    'MON': 'monad',
    'TAO': 'bittensor',
    'SUI': 'sui',
    'NEAR': 'near-protocol',
    'BCH': 'bitcoin-cash',
    'JUP': 'jupiter',
    'XRP': 'xrp',
    'UNI': 'uniswap',
    'PENGU': 'pudgy-penguins',
    'LINK': 'chainlink',
    'ONDO': 'ondo-finance',
    'LTC': 'litecoin',
    'AVAX': 'avalanche',
    'CHIP': 'chip',
    'KPEPE': 'pepe',
    'SKR': 'sakura',
    'BERA': 'berachain',
    'AXS': 'axie-infinity',
    'ADA': 'cardano',
    'VIRTUAL': 'virtual-protocol',
    'ARB': 'arbitrum'
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const symUpper = symbol.toUpperCase();
      const fallback = fallbackPrices[symUpper] || 100.0;

      try {
        const id = idMap[symUpper];
        let fetchedPrice: number | null = null;

        if (id) {
          const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.priceUsd) {
              fetchedPrice = parseFloat(data.data.priceUsd);
            }
          }
        }

        if (!fetchedPrice) {
          const bRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symUpper === 'KPEPE' ? 'PEPE' : symUpper}USDT`);
          if (bRes.ok) {
            const bData = await bRes.json();
            if (bData && bData.lastPrice) {
              fetchedPrice = parseFloat(bData.lastPrice);
            }
          }
        }

        const priceToUse = fetchedPrice || fallback;
        setCenterPrice(prev => {
          if (prev !== null) setLastPrice(prev);
          return priceToUse;
        });
      } catch (e) {
        console.error(e);
        setCenterPrice(prev => {
          if (prev !== null) setLastPrice(prev);
          return fallback;
        });
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Fast interval for live motion tick
  useEffect(() => {
    const motionInterval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(motionInterval);
  }, []);

  const basePrice = centerPrice || fallbackPrices[symbol.toUpperCase()] || 100.0;

  // Calculate dynamic tick size based on scale of price
  const tickSize = basePrice > 1000 ? 10 : basePrice > 100 ? 0.5 : basePrice > 10 ? 0.1 : basePrice > 1 ? 0.01 : basePrice > 0.01 ? 0.0005 : 0.00001;

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
        <button className="text-white border-b-2 border-zinc-700 pb-1 -mb-[13px]">Book</button>
        <button className="hover:text-white transition-colors">Trades</button>
      </div>
      
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
    </div>
  );
}

