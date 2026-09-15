'use client';

import { useEffect, useRef, useState } from 'react';

export function TradingViewChart({ symbol = 'BINANCE:BTCUSDT' }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interval, setIntervalVal] = useState<string>('1'); // 1m lowest timeframe default
  const [chartStyle, setChartStyle] = useState<string>('1'); // 1 = Candles, 8 = Heikin Ashi (smooth no gaps), 3 = Area (continuous)

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetBody = document.createElement('div');
    widgetBody.className = 'tradingview-widget-container__widget';
    widgetBody.style.height = '100%';
    widgetBody.style.width = '100%';
    widgetContainer.appendChild(widgetBody);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: chartStyle,
      locale: "en",
      allow_symbol_change: false, // Prevents symbol from defaulting to stock ETFs like Banco De Chile
      calendar: false,
      support_host: "https://www.tradingview.com",
      backgroundColor: "#0a0a0c",
      gridColor: "#1f1f22",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      toolbar_bg: "#0a0a0c",
      withdateranges: true
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

  }, [symbol, interval, chartStyle]);

  const intervals = [
    { label: '1m', value: '1' },
    { label: '3m', value: '3' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1h', value: '60' },
    { label: '4h', value: '240' },
    { label: '1D', value: 'D' },
  ];

  const styles = [
    { label: 'Candles', value: '1' },
    { label: 'Heikin Ashi (Smooth)', value: '8' },
    { label: 'Area (Line)', value: '3' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0c]">
      {/* Timeframe & Style selector header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#0a0a0c] border-b border-zinc-900 text-xs text-zinc-400 font-semibold z-10 shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 mr-1 text-[11px] uppercase tracking-wider font-mono">Timeframe:</span>
          {intervals.map((item) => (
            <button
              key={item.value}
              onClick={() => setIntervalVal(item.value)}
              className={`px-2 py-1 rounded transition-colors text-xs font-mono font-bold ${
                interval === item.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-zinc-500 mr-1 text-[11px] uppercase tracking-wider font-mono">Mode:</span>
          {styles.map((item) => (
            <button
              key={item.value}
              onClick={() => setChartStyle(item.value)}
              className={`px-2 py-1 rounded transition-colors text-xs font-mono font-bold ${
                chartStyle === item.value
                  ? 'bg-zinc-800 text-blue-400 border border-blue-500/30'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex-1 relative bg-[#0a0a0c]" ref={containerRef} />
    </div>
  );
}


