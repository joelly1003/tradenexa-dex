'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface TopTickerBarProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function TopTickerBar({ selectedSymbol, onSelectSymbol }: TopTickerBarProps) {
  const [priceData, setPriceData] = useState<{ price: string, change: string, vol: string }>({
    price: '--', change: '--', vol: '--'
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch live price for the selected symbol to replace mock data
    const fetchPrice = async () => {
      try {
        const idMap: Record<string, string> = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'SOL': 'solana',
          'AVAX': 'avalanche',
          'LINK': 'chainlink',
          'SUI': 'sui',
          'DOGE': 'dogecoin',
          'PEPE': 'pepe',
          'ARB': 'arbitrum',
          'OP': 'optimism',
          'NEAR': 'near-protocol',
          'TIA': 'celestia',
          'WIF': 'dogwifhat',
          'APT': 'aptos',
          'XRP': 'xrp',
          'BNB': 'binance-coin',
          'ADA': 'cardano'
        };
        const id = idMap[selectedSymbol] || 'bitcoin';
        const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        const data = await res.json();
        if (data && data.data) {
          const price = parseFloat(data.data.priceUsd);
          const change = parseFloat(data.data.changePercent24Hr);
          const vol = parseFloat(data.data.volumeUsd24Hr);
          setPriceData({
            price: price < 0.01 ? price.toFixed(6) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: change.toFixed(2),
            vol: Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(vol)
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const isPositive = parseFloat(priceData.change) >= 0;

  const coins = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-[#F7931A] text-white' },
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-[#627EEA] text-white' },
    { symbol: 'SOL', name: 'Solana', color: 'bg-[#14F195] text-black' },
    { symbol: 'AVAX', name: 'Avalanche', color: 'bg-[#E84142] text-white' },
    { symbol: 'LINK', name: 'Chainlink', color: 'bg-[#2A5ADA] text-white' },
    { symbol: 'SUI', name: 'Sui Network', color: 'bg-[#4CA2FF] text-white' },
    { symbol: 'DOGE', name: 'Dogecoin', color: 'bg-[#C2A633] text-black' },
    { symbol: 'PEPE', name: 'Pepe Coin', color: 'bg-[#43A047] text-white' },
    { symbol: 'ARB', name: 'Arbitrum', color: 'bg-[#28A0F0] text-white' },
    { symbol: 'OP', name: 'Optimism', color: 'bg-[#FF0420] text-white' },
    { symbol: 'NEAR', name: 'Near Protocol', color: 'bg-[#000000] border border-zinc-700 text-white' },
    { symbol: 'TIA', name: 'Celestia', color: 'bg-[#7B2CBF] text-white' },
    { symbol: 'WIF', name: 'dogwifhat', color: 'bg-[#D4A373] text-black' },
    { symbol: 'APT', name: 'Aptos', color: 'bg-[#000000] border border-zinc-700 text-white' },
    { symbol: 'XRP', name: 'Ripple XRP', color: 'bg-[#23292F] text-white' },
    { symbol: 'BNB', name: 'BNB Chain', color: 'bg-[#F3BA2F] text-black' },
    { symbol: 'ADA', name: 'Cardano', color: 'bg-[#0033AD] text-white' }
  ];

  const currentCoin = coins.find(c => c.symbol === selectedSymbol) || coins[0];

  return (
    <div className="flex items-center gap-6 p-3 bg-zinc-950 border-b border-zinc-800 text-sm overflow-x-visible whitespace-nowrap shrink-0">
      <div className="flex items-center pr-6 border-r border-zinc-800 shrink-0 relative" ref={dropdownRef}>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-zinc-900 px-2 py-1 -ml-2 rounded-lg transition-colors"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${currentCoin.color}`}>
            {selectedSymbol.charAt(0)}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white flex items-center gap-2">
              {selectedSymbol} <span className="text-xs font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Perp</span>
            </h1>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
            <div className="p-2 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950/50">Select Market</div>
            <div className="flex flex-col max-h-64 overflow-y-auto">
              {coins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => {
                    onSelectSymbol(coin.symbol);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors w-full text-left ${selectedSymbol === coin.symbol ? 'bg-zinc-800/50' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${coin.color}`}>
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{coin.symbol}</div>
                    <div className="text-zinc-500 text-xs">{coin.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono font-bold text-lg`}>
          {priceData.price !== '--' ? `$${priceData.price}` : '--'}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Oracle Price</span>
        <span className="text-white font-mono">{priceData.price !== '--' ? `$${priceData.price}` : '--'}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Change</span>
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} font-mono`}>
          {isPositive ? '+' : ''}{priceData.change}%
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Volume</span>
        <span className="text-white font-mono">{priceData.vol !== '--' ? `$${priceData.vol}` : '--'}</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Est. Funding (1h)</span>
        <span className="text-green-500 font-mono">+0.0011%</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Status</span>
        <span className="text-green-500 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
        </span>
      </div>
    </div>
  );
}
