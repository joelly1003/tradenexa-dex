'use client';

import { useState } from 'react';

export function PortfolioInterface() {
  const [topTab, setTopTab] = useState<'Overview' | 'Margin Manager' | 'History'>('Overview');
  const [leftTab, setLeftTab] = useState<'Account' | 'PnL' | 'Volume'>('Account');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'All'>('24h');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'Transfer' | 'Withdraw' | 'Deposit' | null>(null);

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] text-white lg:overflow-hidden overflow-y-auto p-6 lg:p-8 mx-auto w-full relative">
      
      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-4 text-white">{activeModal} Funds</h2>
            <p className="text-base text-zinc-400 mb-8">Enter details to process your {activeModal.toLowerCase()} on Ink Chain.</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Asset</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer hover:border-zinc-700">
                  <option>USDC (USD Coin)</option>
                  <option>ETH (Ethereum)</option>
                  <option>USDT (Tether)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-blue-500 font-mono transition-colors hover:border-zinc-700 placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3.5 rounded-xl text-base font-bold transition-all active:scale-95 text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl text-base font-bold transition-all active:scale-95 text-white shadow-lg shadow-blue-500/20"
              >
                Confirm {activeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/10 text-red-500 flex items-center justify-center rounded-lg border border-red-500/20 shadow-sm">
            <span className="font-black text-2xl leading-none">∷</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">Account 1</h1>
            <div className="text-sm text-zinc-400 font-medium flex items-center gap-2 mt-1">
              Active Account <span className="cursor-pointer hover:text-white transition-colors bg-zinc-800 px-2 py-0.5 rounded text-xs">👁 view</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 md:pb-0 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveModal('Transfer')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800 px-6 sm:px-8 py-2.5 rounded-xl text-base font-bold transition-all active:scale-95 whitespace-nowrap text-zinc-300 hover:text-white shadow-sm"
          >
            Transfer
          </button>
          <button 
            onClick={() => setActiveModal('Withdraw')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800 px-6 sm:px-8 py-2.5 rounded-xl text-base font-bold transition-all active:scale-95 whitespace-nowrap text-zinc-300 hover:text-white shadow-sm"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setActiveModal('Deposit')}
            className="bg-blue-600 hover:bg-blue-500 border border-blue-500/50 text-white px-6 sm:px-8 py-2.5 rounded-xl text-base font-bold transition-all active:scale-95 whitespace-nowrap shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-zinc-900 mb-8 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {(['Overview', 'Margin Manager', 'History'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setTopTab(tab)}
            className={`pb-4 font-bold text-base transition-colors -mb-[1px] whitespace-nowrap ${topTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conditional Top Tab View */}
      {topTab === 'History' ? (
        <div className="flex-1 border border-zinc-900 rounded-2xl p-8 bg-[#101014] flex flex-col items-center justify-center text-zinc-500 shadow-inner">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-base font-semibold text-zinc-400">No recent trade or deposit history found on Ink Chain.</p>
          <button onClick={() => setActiveModal('Deposit')} className="mt-6 text-blue-500 hover:text-blue-400 font-bold text-sm underline underline-offset-4">Make a deposit to get started</button>
        </div>
      ) : topTab === 'Margin Manager' ? (
        <div className="flex-1 border border-zinc-900 rounded-2xl p-8 bg-[#101014] flex flex-col items-center justify-center text-zinc-500 shadow-inner">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <p className="text-base font-semibold text-zinc-400">Cross / Isolated Margin Manager active.</p>
          <p className="text-lg font-bold text-white mt-2">Available Margin: $0.00</p>
        </div>
      ) : (
        <>
          {/* 3 Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900 rounded-2xl mb-8 bg-[#101014] shrink-0 shadow-lg overflow-hidden">
            <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-zinc-900/50 flex flex-col justify-between h-36 md:h-40 hover:bg-zinc-900/30 transition-colors">
              <div>
                <div className="text-zinc-400 text-sm font-semibold mb-2">Total Equity</div>
                <div className="text-3xl lg:text-4xl font-black tracking-tight">$0.00</div>
              </div>
              <div className="text-sm text-zinc-500 font-medium">24h PnL <span className="text-zinc-300 ml-1.5 font-mono">$0.00</span></div>
            </div>
            
            <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-zinc-900/50 flex flex-col justify-between h-36 md:h-40 hover:bg-zinc-900/30 transition-colors">
              <div>
                <div className="text-zinc-400 text-sm font-semibold mb-2">30d Volume</div>
                <div className="text-3xl lg:text-4xl font-black tracking-tight">$0.00</div>
              </div>
              <div className="text-sm text-zinc-500 font-medium">Fee Tier: <span className="text-zinc-300 ml-1.5 font-mono bg-zinc-900 px-2 py-0.5 rounded">0.01% / 0.035%</span></div>
            </div>

            <div className="p-6 lg:p-8 flex flex-col justify-between h-36 md:h-40 hover:bg-zinc-900/30 transition-colors">
              <div>
                <div className="text-zinc-400 text-sm font-semibold mb-2">NLP Balance</div>
                <div className="text-3xl lg:text-4xl font-black tracking-tight text-blue-400">$0.00</div>
              </div>
              <div className="text-sm text-zinc-500 font-medium">APR: <span className="text-green-500 ml-1.5 font-mono font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">6.33%</span></div>
            </div>
          </div>

          {/* Main Bottom Section */}
          <div className="flex flex-1 lg:min-h-0 min-h-[500px] border border-zinc-900 rounded-2xl overflow-hidden bg-[#101014] flex-col md:flex-row shadow-lg">
            {/* Left Side Stats */}
            <div className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col bg-[#101014]">
              <div className="flex gap-6 p-6 border-b border-zinc-900 text-sm font-bold bg-[#0c0c0f]">
                {(['Account', 'PnL', 'Volume'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setLeftTab(tab)}
                    className={`transition-colors ${leftTab === tab ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent pb-1'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-6 space-y-6 text-sm font-medium">
                {leftTab === 'Account' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Balance</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized Perp PnL</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized Spot PnL</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Available Margin</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                  </>
                )}

                {leftTab === 'PnL' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Realized PnL ({timeframe})</span>
                      <span className="text-green-500 font-mono text-base font-bold">+$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized PnL</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Win Rate</span>
                      <span className="text-white font-mono text-base">0.0%</span>
                    </div>
                  </>
                )}

                {leftTab === 'Volume' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Perp Volume ({timeframe})</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Spot Volume ({timeframe})</span>
                      <span className="text-white font-mono text-base">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Total Trades</span>
                      <span className="text-white font-mono text-base">0</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-900">
                  <span className="text-zinc-400">Margin Ratio</span>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 h-full w-[5%] bg-[#22c55e] shadow-[0_0_5px_#22c55e]"></div>
                    </div>
                    <span className="text-[#22c55e] font-mono font-bold text-base">0.00%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Chart Area */}
            <div className="flex-1 flex flex-col relative bg-[#0a0a0c]">
              <div className="absolute top-6 right-6 z-10">
                <div className="relative">
                  <button 
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="bg-zinc-900 border border-zinc-800 text-sm font-bold text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors active:scale-95"
                  >
                    {timeframe} <span className="text-[10px] text-zinc-500 mt-0.5">▼</span>
                  </button>

                  {isTimeframeOpen && (
                    <div className="absolute top-full right-0 mt-2 w-28 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-20">
                      {(['24h', '7d', '30d', 'All'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => {
                            setTimeframe(tf);
                            setIsTimeframeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${timeframe === tf ? 'text-blue-400 font-bold bg-blue-500/5' : 'text-zinc-300 font-medium'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Faux Grid Background */}
              <div className="flex-1 w-full h-full p-8 pb-14 relative flex items-end">
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-20"></div>
                
                {/* The Green flat line for $0 balance */}
                <div className="w-full h-[2px] bg-[#22c55e] relative z-10 opacity-90 shadow-[0_0_12px_rgba(34,197,94,0.4)]"></div>
                
                {/* X Axis labels */}
                <div className="absolute bottom-5 left-8 right-8 justify-between text-xs text-zinc-600 font-mono font-medium hidden sm:flex">
                  <span>1:00 AM</span>
                  <span>4:00 AM</span>
                  <span>8:00 AM</span>
                  <span>12:00 PM</span>
                  <span>4:00 PM</span>
                  <span>8:00 PM</span>
                  <span>11:55 PM</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
