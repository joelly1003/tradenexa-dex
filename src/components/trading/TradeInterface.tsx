'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Wallet } from 'lucide-react';
import { TopTickerBar } from './pro/TopTickerBar';
import { TradingViewChart } from './pro/TradingViewChart';
import { Orderbook } from './pro/Orderbook';
import { OrderEntry } from './pro/OrderEntry';
import { PositionsPanel } from './pro/PositionsPanel';

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
  const symbolParam = searchParams.get('symbol') || searchParams.get('coin') || 'BTC';
  const [selectedSymbol, setSelectedSymbol] = useState(symbolParam.toUpperCase());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (symbolParam) {
      setSelectedSymbol(symbolParam.toUpperCase());
    }
  }, [symbolParam]);

  const handleSymbolChange = (newSymbol: string) => {
    setSelectedSymbol(newSymbol);
    router.push(`/trade?symbol=${newSymbol}`);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-zinc-50 text-black overflow-hidden w-full">
      <TopTickerBar 
        selectedSymbol={selectedSymbol} 
        onSelectSymbol={handleSymbolChange} 
      />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden border-t border-black/5">
        {/* Left column (Chart + Positions) */}
        <div className="flex-[3] flex flex-col min-w-0 bg-zinc-50">
           <div className="flex-[2] min-h-[400px] relative z-0">
             <TradingViewChart symbol={getTradingViewSymbol(selectedSymbol)} />
           </div>
           <div className="flex-1 min-h-[250px] lg:max-h-[300px]">
             <PositionsPanel />
           </div>
        </div>

        {/* Middle column (Orderbook) */}
        <div className="w-full lg:w-[320px] flex flex-col min-h-[400px] lg:min-h-0 bg-zinc-50 border-l border-black/10 shrink-0">
          <Orderbook symbol={selectedSymbol} />
        </div>

        {/* Right column (Order Entry) */}
        <div className="w-full lg:w-[360px] flex flex-col min-h-[400px] lg:min-h-0 bg-zinc-50 shrink-0">
          <OrderEntry symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}

export function TradeInterface() {
  return <TradeContent />;
}
