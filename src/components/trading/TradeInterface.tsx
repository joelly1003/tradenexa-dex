'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TopTickerBar } from './pro/TopTickerBar';
import { TradingViewChart } from './pro/TradingViewChart';
import { Orderbook } from './pro/Orderbook';
import { OrderEntry } from './pro/OrderEntry';
import { PositionsPanel } from './pro/PositionsPanel';
import { TradeErrorBoundary } from './TradeErrorBoundary';

function getTradingViewSymbol(symbol: string): string {
  const sym = symbol.toUpperCase();
  const tvMap: Record<string, string> = {
    'BTC': 'BINANCE:BTCUSDT',
    'ETH': 'BINANCE:ETHUSDT',
    'SOL': 'BINANCE:SOLUSDT',
    'HYPE': 'BYBIT:HYPEUSDT',
    'LIT': 'BYBIT:LITUSDT',
    'ZEC': 'BINANCE:ZECUSDT',
    'BNB': 'BINANCE:BNBUSDT',
    'PUMP': 'BYBIT:PUMPUSDT',
    'XMR': 'BYBIT:XMRUSDT',
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
  const selectedSymbol = (searchParams.get('symbol') || searchParams.get('coin') || 'BTC').toUpperCase();
  const [livePrice, setLivePrice] = useState<number | null>(null);

  const handleSymbolChange = (newSymbol: string) => {
    setLivePrice(null);
    router.push(`/trade?symbol=${newSymbol}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-[#0B0E14] text-white overflow-hidden w-full">
      <TopTickerBar 
        selectedSymbol={selectedSymbol} 
        onSelectSymbol={handleSymbolChange} 
        livePrice={livePrice}
      />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden border-t border-white/5">
        {/* Left column (Chart + Positions) */}
        <div className="flex-[3] flex flex-col min-w-0 bg-[#0B0E14]">
          <TradeErrorBoundary fallbackTitle="Chart Display Interrupted">
            <div className="flex-[2] min-h-[400px] relative z-0">
              <TradingViewChart symbol={getTradingViewSymbol(selectedSymbol)} />
            </div>
            <div className="flex-1 min-h-[250px] lg:max-h-[300px]">
              <PositionsPanel />
            </div>
          </TradeErrorBoundary>
        </div>

        {/* Middle column (Orderbook) */}
        <div className="w-full lg:w-[320px] flex flex-col min-h-[400px] lg:min-h-0 bg-[#0B0E14] border-l border-white/10 shrink-0">
          <TradeErrorBoundary fallbackTitle="Orderbook Feed Interrupted">
            <Orderbook symbol={selectedSymbol} onPriceUpdate={setLivePrice} />
          </TradeErrorBoundary>
        </div>

        {/* Right column (Order Entry) */}
        <div className="w-full lg:w-[360px] flex flex-col min-h-[400px] lg:min-h-0 bg-[#0B0E14] shrink-0">
          <TradeErrorBoundary fallbackTitle="Order Entry Form Interrupted">
            <OrderEntry symbol={selectedSymbol} livePrice={livePrice} />
          </TradeErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export function TradeInterface() {
  return <TradeContent />;
}
