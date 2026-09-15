'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TopTickerBar } from './pro/TopTickerBar';
import { TradingViewChart } from './pro/TradingViewChart';
import { Orderbook } from './pro/Orderbook';
import { OrderEntry } from './pro/OrderEntry';

function getTradingViewSymbol(symbol: string): string {
  const sym = symbol.toUpperCase();
  const tvMap: Record<string, string> = {
    'BTC': 'BINANCE:BTCUSDT',
    'ETH': 'BINANCE:ETHUSDT',
    'SOL': 'BINANCE:SOLUSDT',
    'HYPE': 'BYBIT:HYPEUSDT',
    'LIT': 'BINANCE:LITUSDT',
    'ZEC': 'BINANCE:ZECUSDT',
    'BNB': 'BINANCE:BNBUSDT',
    'PUMP': 'BYBIT:PUMPUSDT',
    'XMR': 'BINANCE:XMRUSDT',
    'ASTER': 'MEXC:ASTERUSDT',
    'ENA': 'BINANCE:ENAUSDT',
    'ZRO': 'BINANCE:ZROUSDT',
    'XPL': 'MEXC:XPLUSDT',
    'FARTCOIN': 'BYBIT:FARTCOINUSDT',
    'AAVE': 'BINANCE:AAVEUSDT',
    'DOGE': 'BINANCE:DOGEUSDT',
    'MON': 'BYBIT:MONUSDT',
    'TAO': 'BINANCE:TAOUSDT',
    'SUI': 'BINANCE:SUIUSDT',
    'NEAR': 'BINANCE:NEARUSDT',
    'BCH': 'BINANCE:BCHUSDT',
    'JUP': 'BINANCE:JUPUSDT',
    'XRP': 'BINANCE:XRPUSDT',
    'UNI': 'BINANCE:UNIUSDT',
    'PENGU': 'BYBIT:PENGUUSDT',
    'LINK': 'BINANCE:LINKUSDT',
    'ONDO': 'BINANCE:ONDOUSDT',
    'LTC': 'BINANCE:LTCUSDT',
    'AVAX': 'BINANCE:AVAXUSDT',
    'CHIP': 'MEXC:CHIPUSDT',
    'KPEPE': 'BINANCE:1000PEPEUSDT',
    'PEPE': 'BINANCE:1000PEPEUSDT',
    'SKR': 'BYBIT:SKRUSDT',
    'BERA': 'BYBIT:BERAUSDT',
    'AXS': 'BINANCE:AXSUSDT',
    'ADA': 'BINANCE:ADAUSDT',
    'VIRTUAL': 'BYBIT:VIRTUALUSDT',
    'ARB': 'BINANCE:ARBUSDT',
  };

  return tvMap[sym] || `BINANCE:${sym}USDT`;
}

function TradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbolParam = searchParams.get('symbol') || searchParams.get('coin') || 'BTC';
  const [selectedSymbol, setSelectedSymbol] = useState(symbolParam.toUpperCase());

  useEffect(() => {
    if (symbolParam) {
      setSelectedSymbol(symbolParam.toUpperCase());
    }
  }, [symbolParam]);

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym.toUpperCase());
    router.push(`/trade?symbol=${sym.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] lg:overflow-hidden overflow-y-auto">
      <TopTickerBar selectedSymbol={selectedSymbol} onSelectSymbol={handleSelectSymbol} />
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        
        {/* Chart Area */}
        <div className="w-full lg:flex-1 h-[400px] lg:h-full min-w-0 border-b lg:border-b-0 lg:border-r border-zinc-900 shrink-0">
          <TradingViewChart symbol={getTradingViewSymbol(selectedSymbol)} />
        </div>
        
        {/* Orderbook */}
        <div className="w-full lg:w-[300px] shrink-0 h-[400px] lg:h-full border-b lg:border-b-0 border-zinc-900">
          <Orderbook symbol={selectedSymbol} />
        </div>
        
        {/* Order Entry */}
        <div className="w-full lg:w-[320px] shrink-0 h-auto lg:h-full lg:border-l border-zinc-900 pb-12 lg:pb-0">
          <OrderEntry symbol={selectedSymbol} />
        </div>
        
      </div>
    </div>
  );
}

export function TradeInterface() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[60vh] text-zinc-400 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span>Loading Nado DEX Trade Workspace...</span>
        </div>
      </div>
    }>
      <TradeContent />
    </Suspense>
  );
}

