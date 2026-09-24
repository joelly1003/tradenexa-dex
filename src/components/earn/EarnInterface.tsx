'use client';

import { useState } from 'react';
import { Info, Flame, Wallet } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';

const DEMO_POOLS = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', apy: '8.2%', color: 'bg-blue-500' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', apy: '4.5%', color: 'bg-indigo-500' },
];

export function EarnInterface() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [selectedPool, setSelectedPool] = useState(DEMO_POOLS[0]);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-black dark:text-white min-h-[calc(100vh-80px)]">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Simple Earn</h1>
            <span className="bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20 uppercase tracking-widest">Demo</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Simulate staking assets in our demo liquidity pools. This interface is for testing purposes only and does not interact with live smart contracts.
          </p>
        </div>

        <div className="bg-white dark:bg-[#101114] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 min-w-[280px]">
          <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-2">
            <Wallet className="w-4 h-4" />
            My Staked Assets (Demo)
          </div>
          <div className="text-3xl font-black tracking-tight">$0.00</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pools List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold tracking-tight">Demo Pools</h2>
          </div>

          <div className="flex flex-col gap-3">
            {DEMO_POOLS.map(pool => (
              <button 
                key={pool.id}
                onClick={() => setSelectedPool(pool)}
                className={`w-full flex items-center justify-between p-4 md:p-6 rounded-2xl border transition-all ${selectedPool.id === pool.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#101114] hover:border-zinc-300 dark:hover:border-zinc-700'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm ${pool.color}`}>
                    {pool.symbol[0]}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{pool.symbol}</span>
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Demo</span>
                    </div>
                    <div className="text-sm text-zinc-500 font-medium">{pool.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:gap-16">
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 font-medium mb-1">Simulated APY</div>
                    <div className="font-bold text-green-500 text-lg">{pool.apy}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-500 font-medium mb-1">TVL</div>
                    <div className="font-bold text-zinc-400">N/A</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-5 flex gap-4">
            <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-500 mb-1 text-sm">Demo Environment Active</h3>
              <p className="text-sm text-yellow-700/80 dark:text-yellow-500/80 leading-relaxed">
                This page is a simulated UI demonstration. There are no underlying smart contracts deployed for this feature yet. The numbers shown above are not real TVL metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Staking Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#101114] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sticky top-24 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm ${selectedPool.color}`}>
                  {selectedPool.symbol[0]}
                </div>
                <span className="font-bold text-lg">{selectedPool.symbol} Demo</span>
              </div>
              <span className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-xs font-bold px-2 py-1 rounded">
                {selectedPool.apy} APY
              </span>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-zinc-100 dark:bg-[#1a1b1f] rounded-xl mb-6">
              <button 
                onClick={() => setActiveTab('stake')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'stake' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
              >
                Stake
              </button>
              <button 
                onClick={() => setActiveTab('unstake')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'unstake' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
              >
                Unstake
              </button>
            </div>

            {/* Input */}
            <div className="bg-zinc-50 dark:bg-[#1a1b1f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
              <div className="flex justify-between text-xs text-zinc-500 font-medium mb-3">
                <span>Amount</span>
                <span>Wallet: {balanceData?.formatted ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'} {selectedPool.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-black dark:text-white"
                />
                <button 
                  onClick={() => {
                    if (balanceData?.formatted) {
                      setAmount(parseFloat(balanceData.formatted).toFixed(4));
                    }
                  }}
                  className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Simulated Daily Yield</span>
                <span className="font-bold text-green-500">+$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Network Fee</span>
                <span className="font-bold text-zinc-400">None (Demo)</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
              Confirm {activeTab === 'stake' ? 'Stake' : 'Unstake'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
