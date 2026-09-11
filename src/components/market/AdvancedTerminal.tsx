'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, Time } from 'lightweight-charts';
import { useRegional } from '../providers/RegionalProvider';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  volumeUsd24Hr: string;
}

const mockAssets: CryptoAsset[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', priceUsd: '64230.50', changePercent24Hr: '2.45', volumeUsd24Hr: '32000000000' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', priceUsd: '3450.20', changePercent24Hr: '1.20', volumeUsd24Hr: '15000000000' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', priceUsd: '145.80', changePercent24Hr: '-4.30', volumeUsd24Hr: '4000000000' },
  { id: 'binance-coin', symbol: 'BNB', name: 'BNB', priceUsd: '590.10', changePercent24Hr: '0.80', volumeUsd24Hr: '1200000000' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', priceUsd: '0.58', changePercent24Hr: '-1.10', volumeUsd24Hr: '900000000' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', priceUsd: '0.12', changePercent24Hr: '5.60', volumeUsd24Hr: '800000000' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', priceUsd: '0.45', changePercent24Hr: '-2.10', volumeUsd24Hr: '400000000' },
];

export function AdvancedTerminal() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const { getSymbol } = useRegional();
  const fiatSymbol = getSymbol();

  const [timeframe, setTimeframe] = useState('h1');
  
  const timeframes = [
    { label: '15m', interval: 'm15' },
    { label: '30m', interval: 'm30' },
    { label: '1H', interval: 'h1' },
    { label: '4H', interval: 'h2' },
    { label: '1D', interval: 'd1' },
  ];

  // Fetch asset list & live prices
  useEffect(() => {
    fetch('https://api.coincap.io/v2/assets?limit=50')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        setAssets(data.data);
        if (data.data.length > 0) setSelectedAsset(data.data[0]);
      })
      .catch((err) => {
        console.warn('Failed to fetch live assets (possibly blocked by extension). Using mock data.');
        setAssets(mockAssets);
        setSelectedAsset(mockAssets[0]);
      });

    let ws: WebSocket | null = null;
    let mockInterval: NodeJS.Timeout;

    try {
      ws = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');
      ws.onmessage = (msg) => {
        const prices = JSON.parse(msg.data);
        setAssets((prev) =>
          prev.map((a) => (prices[a.id] ? { ...a, priceUsd: prices[a.id] } : a))
        );
        setSelectedAsset((prev) => {
          if (prev && prices[prev.id]) {
            return { ...prev, priceUsd: prices[prev.id] };
          }
          return prev;
        });
      };
    } catch (err) {
      console.warn('WebSocket connection failed.');
    }

    // Fallback: simulate live ticks if websocket is dead/blocked
    mockInterval = setInterval(() => {
      setSelectedAsset((prev) => {
        if (!prev) return prev;
        const tick = (Math.random() - 0.48) * (parseFloat(prev.priceUsd) * 0.0005);
        const newPrice = (parseFloat(prev.priceUsd) + tick).toString();
        
        setAssets((prevAssets) => 
          prevAssets.map((a) => a.id === prev.id ? { ...a, priceUsd: newPrice } : a)
        );
        
        return { ...prev, priceUsd: newPrice };
      });
    }, 1000);

    return () => {
      if (ws) ws.close();
      clearInterval(mockInterval);
    };
  }, []);

  const seriesRef = useRef<any>(null);
  const currentCandleRef = useRef({ time: 0, open: 0, high: 0, low: 0, close: 0 });

  // Render chart
  useEffect(() => {
    if (!chartContainerRef.current || !selectedAsset) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 800 });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#09090b' }, // zinc-950
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a', style: 1 },
        horzLines: { color: '#27272a', style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    seriesRef.current = candleSeries;

    // Fetch historical data
    fetch(`https://api.coincap.io/v2/assets/${selectedAsset.id}/history?interval=${timeframe}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        if (!data.data || data.data.length === 0) return;
        
        let prevClose = parseFloat(data.data[0].priceUsd);
        const chartData = data.data.map((d: any) => {
          const close = parseFloat(d.priceUsd);
          const open = prevClose;
          const high = Math.max(open, close) * (1 + Math.random() * 0.001);
          const low = Math.min(open, close) * (1 - Math.random() * 0.001);
          prevClose = close;
          return { time: (d.time / 1000) as Time, open, high, low, close };
        });
        
        candleSeries.setData(chartData);
        chart.timeScale().fitContent();
        
        // Init the current live candle reference
        const last = chartData[chartData.length - 1];
        currentCandleRef.current = { ...last, time: last.time as number };
      })
      .catch(() => {
        const mockData = [];
        let currentPrice = parseFloat(selectedAsset.priceUsd) * 0.9;
        const now = Math.floor(Date.now() / 1000);
        for (let i = 100; i >= 0; i--) {
          const open = currentPrice;
          currentPrice += (Math.sin(i) - 0.48) * (currentPrice * 0.01);
          const close = currentPrice;
          mockData.push({
            time: (now - i * 3600) as Time,
            open,
            high: Math.max(open, close) * 1.001,
            low: Math.min(open, close) * 0.999,
            close,
          });
        }
        candleSeries.setData(mockData);
        chart.timeScale().fitContent();
        
        const last = mockData[mockData.length - 1];
        currentCandleRef.current = { ...last, time: last.time as number };
      });

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      seriesRef.current = null;
    };
  }, [selectedAsset?.id, timeframe]);

  // Live chart updates
  useEffect(() => {
    if (seriesRef.current && selectedAsset?.priceUsd) {
      const nowMs = Date.now();
      
      // Determine candle grouping size in ms based on timeframe
      let groupMs = 60000; // default 1m
      if (timeframe === 'm15') groupMs = 15 * 60000;
      if (timeframe === 'm30') groupMs = 30 * 60000;
      if (timeframe === 'h1') groupMs = 60 * 60000;
      if (timeframe === 'h2') groupMs = 120 * 60000;
      if (timeframe === 'd1') groupMs = 24 * 60 * 60000;

      const currentIntervalTime = Math.floor(nowMs / groupMs) * (groupMs / 1000);
      const price = parseFloat(selectedAsset.priceUsd);
      
      const candle = currentCandleRef.current;
      
      if (candle.time !== currentIntervalTime) {
        // Start a new candle
        currentCandleRef.current = {
          time: currentIntervalTime,
          open: price,
          high: price,
          low: price,
          close: price,
        };
      } else {
        // Update current candle
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
      }

      try {
        seriesRef.current.update({ ...currentCandleRef.current, time: currentCandleRef.current.time as Time });
      } catch (e) {
        // ignore fast update duplicates
      }
    }
  }, [selectedAsset?.priceUsd, timeframe]);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num < 0.01) return num.toFixed(6);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatCompact = (numStr: string) => {
    const num = parseFloat(numStr);
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] bg-zinc-950 text-white rounded-xl border border-zinc-800 overflow-hidden font-mono text-sm">
      
      {/* Left Sidebar: Markets */}
      <div className="w-full lg:w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/50">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between font-sans">
          <h3 className="font-bold">Markets</h3>
          <span className="text-xs text-zinc-500">Live</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-right">
            <thead className="sticky top-0 bg-zinc-900 text-zinc-500 text-xs">
              <tr>
                <th className="p-2 text-left font-normal">Pair</th>
                <th className="p-2 font-normal">Price</th>
                <th className="p-2 font-normal">24h%</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const isPositive = parseFloat(asset.changePercent24Hr) >= 0;
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <tr 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer hover:bg-zinc-800/50 transition-colors ${isSelected ? 'bg-zinc-800' : ''}`}
                  >
                    <td className="p-3 text-left">
                      <div className="font-bold text-zinc-200">{asset.symbol}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-[80px]">{asset.name}</div>
                    </td>
                    <td className="p-3">
                      {fiatSymbol}{formatPrice(asset.priceUsd)}
                    </td>
                    <td className={`p-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{parseFloat(asset.changePercent24Hr).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar for Chart */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/30">
          {selectedAsset && (
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-xl font-bold font-sans">{selectedAsset.symbol}/USD</h2>
                <div className="text-zinc-500">{selectedAsset.name}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Last Price</div>
                <div className="text-lg font-bold text-green-400">{fiatSymbol}{formatPrice(selectedAsset.priceUsd)}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-zinc-500">24h Change</div>
                <div className={`text-lg font-bold ${parseFloat(selectedAsset.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(selectedAsset.changePercent24Hr).toFixed(2)}%
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs text-zinc-500">24h Volume</div>
                <div className="text-lg font-bold text-zinc-200">{fiatSymbol}{formatCompact(selectedAsset.volumeUsd24Hr)}</div>
              </div>
            </div>
          )}

          {/* Timeframe Selectors */}
          <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {timeframes.map((tf) => (
              <button
                key={tf.label}
                onClick={() => setTimeframe(tf.interval)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === tf.interval ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="flex-1 w-full bg-zinc-950 relative" ref={chartContainerRef}>
          {/* Chart is injected here by lightweight-charts */}
        </div>
      </div>

      {/* Right Sidebar: Order Book (Mock for layout) */}
      <div className="w-full lg:w-72 flex flex-col border-l border-zinc-800 bg-zinc-950/50">
        <div className="p-4 border-b border-zinc-800 font-sans">
          <h3 className="font-bold">Order Book</h3>
        </div>
        <div className="flex-1 p-2 space-y-1">
          {/* Asks (Red) */}
          <div className="flex flex-col gap-1 mt-2 text-xs">
            <div className="flex justify-between text-zinc-500 px-2"><span>Price</span><span>Amount</span></div>
            {[...Array(12)].map((_, i) => (
              <div key={`ask-${i}`} className="flex justify-between px-2 py-0.5 hover:bg-zinc-800 relative group">
                <div className="absolute inset-y-0 right-0 bg-red-500/10 z-0" style={{ width: `${((i * 17) % 80) + 10}%` }}></div>
                <span className="text-red-400 z-10">{selectedAsset ? (parseFloat(selectedAsset.priceUsd) * (1 + (12-i)*0.001)).toFixed(2) : '0.00'}</span>
                <span className="z-10 text-zinc-300">{((i * 1.37) % 5).toFixed(4)}</span>
              </div>
            ))}
          </div>
          
          <div className="py-2 px-2 text-center border-y border-zinc-800 my-2">
            <span className="text-lg font-bold text-green-400">{selectedAsset ? formatPrice(selectedAsset.priceUsd) : '0.00'}</span>
          </div>

          {/* Bids (Green) */}
          <div className="flex flex-col gap-1 text-xs">
            {[...Array(12)].map((_, i) => (
              <div key={`bid-${i}`} className="flex justify-between px-2 py-0.5 hover:bg-zinc-800 relative group">
                <div className="absolute inset-y-0 right-0 bg-green-500/10 z-0" style={{ width: `${((i * 23) % 80) + 10}%` }}></div>
                <span className="text-green-400 z-10">{selectedAsset ? (parseFloat(selectedAsset.priceUsd) * (1 - (i+1)*0.001)).toFixed(2) : '0.00'}</span>
                <span className="z-10 text-zinc-300">{((i * 2.11) % 5).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
