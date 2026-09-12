'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function OrderEntry({ symbol = 'BTC' }: { symbol?: string }) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [amount, setAmount] = useState('');
  const [sliderVal, setSliderVal] = useState(0);
  const [marginMode, setMarginMode] = useState('Cross');
  const [leverage, setLeverage] = useState(50);
  const [orderType, setOrderType] = useState('Market');

  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpSl, setTpSl] = useState(false);

  // Determine button text and action
  let buttonText = 'Connect Wallet to Trade';
  let buttonAction = () => openConnectModal?.();
  let buttonStyle = 'bg-blue-600 hover:bg-blue-500 text-white'; // Default un-connected style

  if (isConnected) {
    if (!amount || parseFloat(amount) === 0) {
      buttonText = 'Review Trade';
      buttonAction = () => {};
      buttonStyle = 'bg-zinc-800 text-zinc-500 cursor-not-allowed'; // Disabled style when empty
    } else {
      buttonText = 'Place Order';
      buttonAction = () => { console.log('Placing order for', amount, symbol) };
      buttonStyle = 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'; // Active style
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] p-4 text-white shrink-0">
      {/* Margin / Leverage row */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <select 
            value={marginMode}
            onChange={e => setMarginMode(e.target.value)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800 appearance-none text-center outline-none cursor-pointer"
          >
            <option value="Cross">Cross</option>
            <option value="Isolated">Isolated</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <select 
            value={leverage}
            onChange={e => setLeverage(Number(e.target.value))}
            className="w-full bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800 appearance-none text-center outline-none cursor-pointer"
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
            <option value={20}>20x</option>
            <option value={50}>50x</option>
            <option value={100}>100x</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800 pb-2 mb-4 text-sm font-semibold">
        {['Market', 'Limit', 'Advanced'].map(tab => (
          <button 
            key={tab}
            onClick={() => setOrderType(tab)}
            className={`transition-colors ${orderType === tab ? 'text-white border-b-2 border-white pb-2 -mb-[9px]' : 'text-zinc-500 hover:text-white pb-2'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-zinc-400 mb-2 font-sans">
        <span>Available Margin</span>
        <span className="text-white font-mono">$0.00</span>
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mb-6 font-sans">
        <span>Position</span>
        <span className="text-white font-mono">0.00000 {symbol}</span>
      </div>

      {/* Input */}
      <div className="bg-zinc-900/50 rounded p-2 flex items-center justify-between mb-4 border border-zinc-800 focus-within:border-blue-500 transition-colors">
        <span className="text-zinc-500 text-sm pl-2">Size</span>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="0.00000" 
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSliderVal(Math.min(100, Math.max(0, Number(e.target.value || 0) * 10))); // mock mapping
            }}
            className="bg-transparent text-right text-white font-mono outline-none w-24 text-sm placeholder:text-zinc-700" 
          />
          <span className="text-zinc-500 text-sm font-bold w-12 text-right">{symbol} ⇌</span>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6 px-1 relative">
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderVal}
          onChange={(e) => {
            const v = Number(e.target.value);
            setSliderVal(v);
            setAmount((v / 10).toFixed(5)); // mock mapping
          }}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all"
        />
        
        <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono font-bold">
          <span>{sliderVal}%</span>
          <span>Max --</span>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-8">
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
          <input 
            type="checkbox" 
            checked={reduceOnly}
            onChange={e => setReduceOnly(e.target.checked)}
            className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
          />
          Reduce Only
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
          <input 
            type="checkbox" 
            checked={tpSl}
            onChange={e => setTpSl(e.target.checked)}
            className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
          />
          TP/SL
        </label>
      </div>

      <button 
        onClick={buttonAction}
        className={`w-full font-bold py-3 rounded mb-6 transition-colors ${buttonStyle}`}
      >
        {buttonText}
      </button>

      <div className="space-y-2 text-xs text-zinc-500 mt-auto font-sans">
        <div className="flex justify-between"><span>Value</span><span className="font-mono">--</span></div>
        <div className="flex justify-between"><span>Cost</span><span className="font-mono">--</span></div>
        <div className="flex justify-between"><span>Liq. Price</span><span className="font-mono">--</span></div>
      </div>
    </div>
  );
}
