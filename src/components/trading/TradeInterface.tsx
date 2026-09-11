'use client';

import { TopTickerBar } from './pro/TopTickerBar';
import { TradingViewChart } from './pro/TradingViewChart';
import { Orderbook } from './pro/Orderbook';
import { OrderEntry } from './pro/OrderEntry';

export function TradeInterface() {
  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-[#0a0a0c] overflow-hidden">
      <TopTickerBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 h-full min-w-0 border-r border-zinc-900">
          <TradingViewChart />
        </div>
        <div className="w-[300px] shrink-0 h-full hidden lg:block">
          <Orderbook />
        </div>
        <div className="w-[320px] shrink-0 h-full hidden md:block border-l border-zinc-900">
          <OrderEntry />
        </div>
      </div>
    </div>
  );
}
