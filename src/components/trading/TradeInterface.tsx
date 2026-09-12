'use client';

import { useState } from 'react';
import { TopTickerBar } from './pro/TopTickerBar';
import { TradingViewChart } from './pro/TradingViewChart';
import { Orderbook } from './pro/Orderbook';
import { OrderEntry } from './pro/OrderEntry';

export function TradeInterface() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] lg:overflow-hidden overflow-y-auto">
      <TopTickerBar selectedSymbol={selectedSymbol} onSelectSymbol={setSelectedSymbol} />
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        
        {/* Chart Area */}
        <div className="w-full lg:flex-1 h-[400px] lg:h-full min-w-0 border-b lg:border-b-0 lg:border-r border-zinc-900 shrink-0">
          <TradingViewChart symbol={`BINANCE:${selectedSymbol}USDT`} />
        </div>
        
        {/* Orderbook */}
        <div className="w-full lg:w-[300px] shrink-0 h-[400px] lg:h-full border-b lg:border-b-0 border-zinc-900">
          <Orderbook />
        </div>
        
        {/* Order Entry */}
        <div className="w-full lg:w-[320px] shrink-0 h-auto lg:h-full lg:border-l border-zinc-900 pb-12 lg:pb-0">
          <OrderEntry symbol={selectedSymbol} />
        </div>
        
      </div>
    </div>
  );
}
