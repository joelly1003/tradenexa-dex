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

  const idMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'HYPE': 'hyperliquid',
    'SOL': 'solana',
    'LIT': 'litentry',
    'ZEC': 'zcash',
    'BNB': 'binance-coin',
    'PUMP': 'pump-fun',
    'XMR': 'monero',
    'ASTER': 'aster',
    'ENA': 'ethena',
    'ZRO': 'layerzero',
    'XPL': 'plasma',
    'FARTCOIN': 'fartcoin',
    'AAVE': 'aave',
    'DOGE': 'dogecoin',
    'MON': 'monad',
    'TAO': 'bittensor',
    'SUI': 'sui',
    'NEAR': 'near-protocol',
    'BCH': 'bitcoin-cash',
    'JUP': 'jupiter',
    'XRP': 'xrp',
    'UNI': 'uniswap',
    'PENGU': 'pudgy-penguins',
    'LINK': 'chainlink',
    'ONDO': 'ondo-finance',
    'LTC': 'litecoin',
    'AVAX': 'avalanche',
    'CHIP': 'chip',
    'KPEPE': 'pepe',
    'SKR': 'sakura',
    'BERA': 'berachain',
    'AXS': 'axie-infinity',
    'ADA': 'cardano',
    'VIRTUAL': 'virtual-protocol',
    'ARB': 'arbitrum'
  };

  // Preset fallback dataset for Nado coins if API is loading or unavailable
  const fallbackPrices: Record<string, { price: string; change: string; vol: string }> = {
    'BTC': { price: '75267.00', change: '-4.50', vol: '181.5M' },
    'ETH': { price: '2383.40', change: '-6.60', vol: '57.5M' },
    'HYPE': { price: '76.56', change: '-5.00', vol: '24.6M' },
    'SOL': { price: '96.56', change: '-6.60', vol: '19.9M' },
    'LIT': { price: '4.07', change: '-9.90', vol: '1.8M' },
    'ZEC': { price: '1102.29', change: '-7.20', vol: '5.3M' },
    'BNB': { price: '709.61', change: '-1.90', vol: '1.4M' },
    'PUMP': { price: '0.003495', change: '-5.60', vol: '1.2M' },
    'XMR': { price: '502.23', change: '-2.60', vol: '55.9K' },
    'ASTER': { price: '0.67514', change: '-4.50', vol: '266.7K' },
    'ENA': { price: '0.13725', change: '-5.30', vol: '399.7K' },
    'ZRO': { price: '0.9679', change: '-3.70', vol: '84.6K' },
    'XPL': { price: '0.07969', change: '-6.30', vol: '264.1K' },
    'FARTCOIN': { price: '0.13515', change: '-7.20', vol: '200.2K' },
    'AAVE': { price: '120.65', change: '-7.00', vol: '191.7K' },
    'DOGE': { price: '0.07962', change: '-5.90', vol: '105.4K' },
    'MON': { price: '0.021311', change: '-9.20', vol: '208.1K' },
    'TAO': { price: '216.42', change: '-7.90', vol: '580.3K' },
    'SUI': { price: '0.6797', change: '-7.20', vol: '154.5K' },
    'NEAR': { price: '2.31', change: '-8.50', vol: '325.5K' },
    'BCH': { price: '214.12', change: '-5.00', vol: '126.7K' },
    'JUP': { price: '0.21598', change: '-11.00', vol: '232.9K' },
    'XRP': { price: '1.28', change: '-11.90', vol: '3.4M' },
    'UNI': { price: '6.22', change: '-5.20', vol: '1.2M' },
    'PENGU': { price: '0.006777', change: '-5.60', vol: '78.1K' },
    'LINK': { price: '10.85', change: '-7.10', vol: '124.3K' },
    'ONDO': { price: '0.32702', change: '-9.40', vol: '114.8K' },
    'LTC': { price: '50.86', change: '-4.90', vol: '56.9K' },
    'AVAX': { price: '7.23', change: '-5.50', vol: '45.1K' },
    'CHIP': { price: '0.036386', change: '-11.80', vol: '8.4K' },
    'KPEPE': { price: '0.003319', change: '-5.50', vol: '49.9K' },
    'SKR': { price: '0.0425', change: '-2.20', vol: '42.0K' },
    'BERA': { price: '2.85', change: '-3.10', vol: '89.0K' },
    'AXS': { price: '4.85', change: '-5.30', vol: '124.0K' },
    'ADA': { price: '0.35', change: '-7.80', vol: '450.0K' },
    'VIRTUAL': { price: '0.88', change: '-6.80', vol: '310.0K' },
    'ARB': { price: '0.52', change: '9.60', vol: '840.0K' }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const symUpper = selectedSymbol.toUpperCase();
      const fallback = fallbackPrices[symUpper] || { price: '100.00', change: '0.00', vol: '1.0M' };
      
      try {
        const id = idMap[symUpper];
        let fetched = false;

        // Note: For perfect sync with TradingView, we should just query Binance proxy first, 
        // but CoinCap is still good if you want to diversify. Let's try Binance first to ensure sync!
        try {
          const bRes = await fetch(`/api/binance?symbol=${symUpper === 'KPEPE' ? 'PEPE' : symUpper}`);
          if (bRes.ok) {
            const bData = await bRes.json();
            if (bData && bData.lastPrice) {
              const price = parseFloat(bData.lastPrice);
              const change = parseFloat(bData.priceChangePercent);
              const vol = parseFloat(bData.quoteVolume);
              setPriceData({
                price: price < 0.01 ? price.toFixed(6) : price < 1 ? price.toFixed(4) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: change.toFixed(2),
                vol: Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(vol)
              });
              fetched = true;
            }
          }
        } catch(e) {}

        if (!fetched && id) {
          const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.data) {
              const price = parseFloat(data.data.priceUsd);
              const change = parseFloat(data.data.changePercent24Hr);
              const vol = parseFloat(data.data.volumeUsd24Hr);
              setPriceData({
                price: price < 0.01 ? price.toFixed(6) : price < 1 ? price.toFixed(4) : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: change.toFixed(2),
                vol: Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(vol)
              });
              fetched = true;
            }
          }
        }

        if (!fetched) {
          setPriceData(fallback);
        }
      } catch (e) {
        console.error(e);
        setPriceData(fallback);
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 2000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const isPositive = parseFloat(priceData.change) >= 0;

  const coins = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-[#F7931A] text-white' },
    { symbol: 'ETH', name: 'Ethereum', color: 'bg-[#627EEA] text-white' },
    { symbol: 'HYPE', name: 'Hyperliquid', color: 'bg-[#00F5A0] text-black' },
    { symbol: 'SOL', name: 'Solana', color: 'bg-[#14F195] text-black' },
    { symbol: 'LIT', name: 'Litentry', color: 'bg-[#00D2FF] text-black' },
    { symbol: 'ZEC', name: 'Zcash', color: 'bg-[#F4B728] text-black' },
    { symbol: 'BNB', name: 'BNB Chain', color: 'bg-[#F3BA2F] text-black' },
    { symbol: 'PUMP', name: 'Pump Fun', color: 'bg-[#00E5FF] text-black' },
    { symbol: 'XMR', name: 'Monero', color: 'bg-[#FF6600] text-white' },
    { symbol: 'ASTER', name: 'Aster', color: 'bg-[#8A2BE2] text-white' },
    { symbol: 'ENA', name: 'Ethena', color: 'bg-[#FFFFFF] text-black' },
    { symbol: 'ZRO', name: 'LayerZero', color: 'bg-[#1A1A1A] border border-zinc-700 text-white' },
    { symbol: 'XPL', name: 'Plasma', color: 'bg-[#3B82F6] text-white' },
    { symbol: 'FARTCOIN', name: 'Fartcoin', color: 'bg-[#EAB308] text-black' },
    { symbol: 'AAVE', name: 'Aave', color: 'bg-[#B6509E] text-white' },
    { symbol: 'DOGE', name: 'Dogecoin', color: 'bg-[#C2A633] text-black' },
    { symbol: 'MON', name: 'Monad', color: 'bg-[#8352FD] text-white' },
    { symbol: 'TAO', name: 'Bittensor', color: 'bg-[#2B2B2B] text-white' },
    { symbol: 'SUI', name: 'Sui Network', color: 'bg-[#4CA2FF] text-white' },
    { symbol: 'NEAR', name: 'Near Protocol', color: 'bg-[#000000] border border-zinc-700 text-white' },
    { symbol: 'BCH', name: 'Bitcoin Cash', color: 'bg-[#0AC18E] text-white' },
    { symbol: 'JUP', name: 'Jupiter', color: 'bg-[#22C55E] text-white' },
    { symbol: 'XRP', name: 'Ripple XRP', color: 'bg-[#23292F] text-white' },
    { symbol: 'UNI', name: 'Uniswap', color: 'bg-[#FF007A] text-white' },
    { symbol: 'PENGU', name: 'Pudgy Pengu', color: 'bg-[#38BDF8] text-black' },
    { symbol: 'LINK', name: 'Chainlink', color: 'bg-[#2A5ADA] text-white' },
    { symbol: 'ONDO', name: 'Ondo Finance', color: 'bg-[#1E293B] text-white' },
    { symbol: 'LTC', name: 'Litecoin', color: 'bg-[#345D9D] text-white' },
    { symbol: 'AVAX', name: 'Avalanche', color: 'bg-[#E84142] text-white' },
    { symbol: 'CHIP', name: 'Chip', color: 'bg-[#F97316] text-white' },
    { symbol: 'kPEPE', name: 'Pepe (1000)', color: 'bg-[#43A047] text-white' },
    { symbol: 'SKR', name: 'Sakura', color: 'bg-[#EC4899] text-white' },
    { symbol: 'BERA', name: 'Berachain', color: 'bg-[#D97706] text-white' },
    { symbol: 'AXS', name: 'Axie Infinity', color: 'bg-[#0055D5] text-white' },
    { symbol: 'ADA', name: 'Cardano', color: 'bg-[#0033AD] text-white' },
    { symbol: 'VIRTUAL', name: 'Virtual Protocol', color: 'bg-[#A855F7] text-white' },
    { symbol: 'ARB', name: 'Arbitrum', color: 'bg-[#28A0F0] text-white' },
  ];

  const currentCoin = coins.find(c => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || {
    symbol: selectedSymbol.toUpperCase(),
    name: `${selectedSymbol.toUpperCase()} Perp`,
    color: 'bg-blue-600 text-white'
  };

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
          <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
            <div className="p-2 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950/50">Select Nado Perp Market</div>
            <div className="flex flex-col max-h-72 overflow-y-auto">
              {coins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => {
                    onSelectSymbol(coin.symbol);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors w-full text-left ${selectedSymbol.toUpperCase() === coin.symbol.toUpperCase() ? 'bg-blue-600/20 text-blue-400' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${coin.color}`}>
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{coin.symbol}-PERP</div>
                    <div className="text-zinc-400 text-xs">{coin.name}</div>
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

