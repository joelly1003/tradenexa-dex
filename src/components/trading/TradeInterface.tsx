'use client';

import { useState } from 'react';
import { useRegional } from '../providers/RegionalProvider';

export function TradeInterface() {
  const [tab, setTab] = useState<'swap' | 'limit'>('swap');
  const { getSymbol } = useRegional();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button 
            className={`font-semibold pb-2 border-b-2 ${tab === 'swap' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-500'}`}
            onClick={() => setTab('swap')}
          >
            Swap
          </button>
          <button 
            className={`font-semibold pb-2 border-b-2 ${tab === 'limit' ? 'border-blue-500 text-blue-500' : 'border-transparent text-zinc-500'}`}
            onClick={() => setTab('limit')}
          >
            Limit
          </button>
        </div>
        <button className="text-zinc-500 hover:text-black dark:hover:text-white">⚙️</button>
      </div>

      <div className="space-y-4">
        {/* Sell Input */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-500">You Pay</span>
            <span className="text-sm text-zinc-500">Balance: 0.00</span>
          </div>
          <div className="flex justify-between items-center">
            <input 
              type="text" 
              placeholder="0.0" 
              className="bg-transparent text-2xl outline-none w-1/2 dark:text-white" 
            />
            <button className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 rounded-full font-semibold">
              ETH <span className="text-xs">▼</span>
            </button>
          </div>
          <div className="text-sm text-zinc-500 mt-2">{getSymbol()}0.00</div>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <button className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full border border-white dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700">
            ↓
          </button>
        </div>

        {/* Buy Input */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-500">You Receive</span>
            <span className="text-sm text-zinc-500">Balance: 0.00</span>
          </div>
          <div className="flex justify-between items-center">
            <input 
              type="text" 
              placeholder="0.0" 
              className="bg-transparent text-2xl outline-none w-1/2 dark:text-white" 
            />
            <button className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full font-semibold">
              Select <span className="text-xs">▼</span>
            </button>
          </div>
          <div className="text-sm text-zinc-500 mt-2">{getSymbol()}0.00</div>
        </div>

        {/* Trade Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm flex justify-between">
          <span>Exchange Rate</span>
          <span>1 ETH = 3,420 USDC</span>
        </div>

        <div className="text-sm text-zinc-500 space-y-2 px-2">
          <div className="flex justify-between"><span>Network Fee</span><span>{getSymbol()}2.40</span></div>
          <div className="flex justify-between"><span>Price Impact</span><span>0.05%</span></div>
          <div className="flex justify-between"><span>Slippage Tolerance</span><span>0.5%</span></div>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
          Connect Wallet to Trade
        </button>
      </div>
    </div>
  );
}
