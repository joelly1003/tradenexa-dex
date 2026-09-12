'use client';

import { useEffect, useRef } from 'react';

export function TradingViewChart({ symbol = 'BINANCE:BTCUSDT' }: { symbol?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Create a unique ID for the container so TradingView doesn't get confused on symbol change
    const containerId = `tv_chart_${Math.random().toString(36).substring(7)}`;
    container.current.id = containerId;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'W',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          backgroundColor: '#0a0a0c', // Matches our dark UI
          gridColor: '#1f1f22',
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          toolbar_bg: '#0a0a0c',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Clean up script
      const scripts = document.head.getElementsByTagName('script');
      for (let i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src.includes('tv.js')) {
          document.head.removeChild(scripts[i]);
        }
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full relative bg-[#0a0a0c]" ref={container} />
  );
}
