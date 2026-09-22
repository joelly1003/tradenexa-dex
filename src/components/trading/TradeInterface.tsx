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
  const { isConnected } = useAccount();
  const { open } = useAppKit();
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

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-zinc-950 p-6 text-white">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-3">Connect Wallet</h2>
          <p className="text-zinc-400 text-sm mb-8">Please connect your wallet to access the professional trading interface and start placing orders.</p>
          <button 
            onClick={() => open()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] text-white overflow-hidden mx-auto w-full max-w-[1800px] border-x border-zinc-900">
      <TopTickerBar 
        selectedSymbol={selectedSymbol} 
        onSelectSymbol={handleSymbolChange} 
      />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left column (Chart) */}
        <div className="flex-[3] flex flex-col border-r border-zinc-900 min-h-[500px] lg:min-h-0 bg-[#131722] relative z-0">
           <TradingViewChart symbol={getTradingViewSymbol(selectedSymbol)} />
        </div>

        {/* Middle column (Orderbook) */}
        <div className="flex-1 flex flex-col border-r border-zinc-900 min-h-[400px] lg:min-h-0 bg-[#0a0a0c]">
          <Orderbook symbol={selectedSymbol} />
        </div>

        {/* Right column (Order Entry) */}
        <div className="w-full lg:w-[360px] flex flex-col min-h-[400px] lg:min-h-0 bg-[#0a0a0c]">
          <OrderEntry symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}

export function TradeInterface() {
  return <TradeContent />;
}
