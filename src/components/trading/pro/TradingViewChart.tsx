'use client';

import { useEffect, useRef } from 'react';

export function TradingViewChart({ symbol = 'BINANCE:BTCUSDT' }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      interval: "1", // 1m lowest timeframe default
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1", // Candles
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
      withdateranges: false
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

  }, [symbol]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0c] relative group">
      <div className="w-full flex-1 relative bg-[#0a0a0c]" ref={containerRef} />
      {/* Hide TradingView Logo / Watermark Overlay */}
      <div className="absolute bottom-[30px] left-0 w-[80px] h-[45px] bg-[#0a0a0c] z-[999] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45px] h-[30px] bg-[#0a0a0c] z-[999] pointer-events-none" />
    </div>
  );
}


