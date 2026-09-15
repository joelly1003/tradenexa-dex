'use client';

import { useEffect, useRef, useState } from 'react';

export function TradingViewChart({ symbol = 'BINANCE:BTCUSDT' }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interval, setIntervalVal] = useState<string>('15'); // 15m default for clean continuous candles

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Unique ID for container on every symbol / interval change
    const containerId = `tv_chart_${Math.random().toString(36).substring(7)}`;
    containerRef.current.id = containerId;
    containerRef.current.innerHTML = '';

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView && containerRef.current) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          backgroundColor: '#0a0a0c',
          gridColor: '#1f1f22',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          toolbar_bg: '#0a0a0c',
        });
      }
    };

    if (typeof window !== 'undefined' && (window as any).TradingView) {
      initWidget();
    } else {
      const existingScript = document.getElementById('tradingview-widget-script');
      if (existingScript) {
        initWidget();
      } else {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      }
    }
  }, [symbol, interval]);

  const intervals = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1D', value: 'D' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0c]">
      {/* Timeframe selector header */}
      <div className="flex items-center gap-1 p-2 bg-[#0a0a0c] border-b border-zinc-900 text-xs text-zinc-400 font-semibold z-10 shrink-0">
        <span className="text-zinc-500 mr-2 text-[11px] uppercase tracking-wider font-mono">Timeframe:</span>
        {intervals.map((item) => (
          <button
            key={item.value}
            onClick={() => setIntervalVal(item.value)}
            className={`px-2.5 py-1 rounded transition-colors text-xs font-mono font-bold ${
              interval === item.value
                ? 'bg-blue-600 text-white'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="w-full flex-1 relative bg-[#0a0a0c]" ref={containerRef} />
    </div>
  );
}

