'use client';

import { useState } from 'react';
import { Info, Flame, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import Link from 'next/link';

const DEMO_POOLS = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', apy: '8.2%', color: 'from-emerald-400 to-[#B1FA41]', logo: 'https://assets.coincap.io/assets/icons/usdc@2x.png' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', apy: '4.5%', color: 'from-cyan-400 to-blue-500', logo: 'https://assets.coincap.io/assets/icons/eth@2x.png' },
];

export function EarnInterface() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [selectedPool, setSelectedPool] = useState(DEMO_POOLS[0]);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)]">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Simple Earn</h1>
            <span className="bg-[#B1FA41]/10 text-[#B1FA41] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#B1FA41]/20 uppercase tracking-widest">
              Demo Vaults
            </span>
          </div>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Provide liquidity or stake collateral to earn passive yield across Ink Network lending vaults.
          </p>
        </div>

        <div className="bg-[#0c0d10] border border-white/5 rounded-2xl p-6 min-w-[280px] shadow-2xl">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
            <Wallet className="w-4 h-4 text-[#B1FA41]" />
            My Staked Assets (Demo)
          </div>
          <div className="text-3xl font-black tracking-tight text-white font-mono">$0.00</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pools List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-[#B1FA41]" />
            <h2 className="text-xl font-black tracking-tight text-white">Available Vaults</h2>
          </div>

          <div className="flex flex-col gap-3">
            {DEMO_POOLS.map(pool => (
              <button 
                key={pool.id}
                onClick={() => setSelectedPool(pool)}
                className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all text-left ${
                  selectedPool.id === pool.id 
                    ? 'border-[#B1FA41] bg-[#B1FA41]/5 shadow-[0_0_20px_rgba(177,250,65,0.08)]' 
                    : 'border-white/5 bg-[#0c0d10] hover:border-white/10 hover:bg-[#121318]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#0c0d10] border border-white/10 shadow-sm overflow-hidden p-2`}>
                    <img src={pool.logo} alt={pool.symbol} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-lg text-white">{pool.symbol}</span>
                      <span className="bg-white/5 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">Demo</span>
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">{pool.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:gap-14">
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 font-medium mb-1">Simulated APY</div>
                    <div className="font-mono font-black text-[#B1FA41] text-lg">{pool.apy}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-400 font-medium mb-1">TVL</div>
                    <div className="font-mono font-bold text-white">$1.2M</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-[#0c0d10] border border-white/5 rounded-2xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-[#B1FA41] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1 text-sm">Simulated Ink Network Vaults</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yield contracts on Ink are currently in testing. This interface lets you simulate deposits, APY compounding, and liquidity withdrawal seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Staking Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#0c0d10] border border-white/5 rounded-3xl p-6 sticky top-24 shadow-2xl">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-[#0c0d10] border border-white/10 p-1`}>
                  <img src={selectedPool.logo} alt={selectedPool.symbol} className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-lg text-white">{selectedPool.symbol} Vault</span>
              </div>
              <span className="bg-[#B1FA41]/10 text-[#B1FA41] border border-[#B1FA41]/20 text-xs font-black px-2.5 py-1 rounded-full">
                {selectedPool.apy} APY
              </span>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-black border border-white/5 rounded-xl mb-6">
              <button 
                onClick={() => setActiveTab('stake')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'stake' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Stake
              </button>
              <button 
                onClick={() => setActiveTab('unstake')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'unstake' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Unstake
              </button>
            </div>

            {/* Input */}
            <div className="bg-black border border-white/10 rounded-2xl p-4 mb-6 focus-within:border-[#B1FA41] transition-colors">
              <div className="flex justify-between text-xs text-zinc-400 font-medium mb-3">
                <span>Amount</span>
                <span className="font-mono">Bal: {balanceData?.formatted ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'} {selectedPool.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-black font-mono outline-none placeholder:text-zinc-600 text-white"
                />
                <button 
                  onClick={() => {
                    if (balanceData?.formatted) {
                      setAmount(parseFloat(balanceData.formatted).toFixed(4));
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 text-[#B1FA41] text-xs font-black px-3 py-1.5 rounded-lg transition-colors font-mono"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-8 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Estimated Daily Yield</span>
                <span className="font-mono font-bold text-[#B1FA41]">+$0.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Network Gas</span>
                <span className="font-mono font-medium text-zinc-400">&lt;$0.01</span>
              </div>
            </div>

            <button className="w-full bg-[#B1FA41] hover:bg-[#9de036] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(177,250,65,0.25)] hover:shadow-[0_0_35px_rgba(177,250,65,0.4)] active:scale-[0.98]">
              Confirm {activeTab === 'stake' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
