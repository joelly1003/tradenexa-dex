'use client';

import { useState } from 'react';

export function PortfolioInterface() {
  const [topTab, setTopTab] = useState<'Overview' | 'Margin Manager' | 'History'>('Overview');
  const [leftTab, setLeftTab] = useState<'Account' | 'PnL' | 'Volume'>('Account');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'All'>('24h');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'Transfer' | 'Withdraw' | 'Deposit' | null>(null);

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] text-white lg:overflow-hidden overflow-y-auto p-6 mx-auto w-full relative">
      
      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4">{activeModal} Funds</h2>
            <p className="text-sm text-zinc-400 mb-6">Enter details to process your {activeModal.toLowerCase()} on Ink Chain.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Asset</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option>USDC (USD Coin)</option>
                  <option>ETH (Ethereum)</option>
                  <option>USDT (Tether)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg text-sm font-semibold transition-colors text-white"
              >
                Confirm {activeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/10 text-red-500 flex items-center justify-center rounded">
            <span className="font-black text-xl">∷</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Account 1</h1>
            <div className="text-xs text-zinc-500 flex items-center gap-2">
              Account <span className="cursor-pointer hover:text-white transition-colors">👁</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 md:pb-0 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveModal('Transfer')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800/50 px-4 sm:px-6 py-2 rounded text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Transfer
          </button>
          <button 
            onClick={() => setActiveModal('Withdraw')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800/50 px-4 sm:px-6 py-2 rounded text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setActiveModal('Deposit')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 rounded text-sm font-semibold transition-colors whitespace-nowrap shadow-lg shadow-blue-500/20"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-900 mb-6 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {(['Overview', 'Margin Manager', 'History'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setTopTab(tab)}
            className={`pb-3 font-semibold text-sm transition-colors -mb-[1px] whitespace-nowrap ${topTab === tab ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conditional Top Tab View */}
      {topTab === 'History' ? (
        <div className="flex-1 border border-zinc-900 rounded-lg p-6 bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-500">
          <p className="text-sm font-semibold">No recent trade or deposit history found on Ink Chain.</p>
        </div>
      ) : topTab === 'Margin Manager' ? (
        <div className="flex-1 border border-zinc-900 rounded-lg p-6 bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-500">
          <p className="text-sm font-semibold">Cross / Isolated Margin Manager active. Available Margin: $0.00</p>
        </div>
      ) : (
        <>
          {/* 3 Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900 rounded-lg mb-6 bg-[#0a0a0c] shrink-0">
            <div className="p-4 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-between h-28">
              <div>
                <div className="text-zinc-500 text-xs mb-1">Total Equity</div>
                <div className="text-2xl font-bold">$0.00</div>
              </div>
              <div className="text-xs text-zinc-500">24h PnL <span className="text-white ml-1">$0.00</span></div>
            </div>
            
            <div className="p-4 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-between h-28">
              <div>
                <div className="text-zinc-500 text-xs mb-1">30d Volume</div>
                <div className="text-2xl font-bold">$0.00</div>
              </div>
              <div className="text-xs text-zinc-500">Fee Tier: <span className="text-white ml-1">0.01% / 0.035%</span></div>
            </div>

            <div className="p-4 flex flex-col justify-between h-28">
              <div>
                <div className="text-zinc-500 text-xs mb-1">NLP Balance</div>
                <div className="text-2xl font-bold">$0.00</div>
              </div>
              <div className="text-xs text-zinc-500">APR: <span className="text-white ml-1">6.33%</span></div>
            </div>
          </div>

          {/* Main Bottom Section */}
          <div className="flex flex-1 lg:min-h-0 min-h-[500px] border border-zinc-900 rounded-lg overflow-hidden bg-[#0a0a0c] flex-col md:flex-row">
            {/* Left Side Stats */}
            <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col bg-[#0a0a0c]">
              <div className="flex gap-4 p-4 border-b border-zinc-900 text-xs font-semibold">
                {(['Account', 'PnL', 'Volume'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setLeftTab(tab)}
                    className={`transition-colors ${leftTab === tab ? 'text-white border-b-2 border-white pb-1' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-4 space-y-4 text-xs">
                {leftTab === 'Account' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Balance</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Unrealized Perp PnL</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Unrealized Spot PnL</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Available Margin</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                  </>
                )}

                {leftTab === 'PnL' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Realized PnL ({timeframe})</span>
                      <span className="text-green-500 font-mono">+$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Unrealized PnL</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Win Rate</span>
                      <span className="text-white font-mono">0.0%</span>
                    </div>
                  </>
                )}

                {leftTab === 'Volume' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Perp Volume ({timeframe})</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Spot Volume ({timeframe})</span>
                      <span className="text-white font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total Trades</span>
                      <span className="text-white font-mono">0</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-900/50">
                  <span className="text-zinc-400">Maintenance Margin & Ratio</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 h-full w-[5%] bg-[#22c55e]"></div>
                    </div>
                    <span className="text-[#22c55e] font-mono">0.00%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Chart Area */}
            <div className="flex-1 flex flex-col relative bg-[#0a0a0c]">
              <div className="absolute top-4 right-4 z-10">
                <div className="relative">
                  <button 
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-white px-3 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800"
                  >
                    {timeframe} <span className="text-[10px] text-zinc-500">▼</span>
                  </button>

                  {isTimeframeOpen && (
                    <div className="absolute top-full right-0 mt-1 w-24 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-20">
                      {(['24h', '7d', '30d', 'All'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => {
                            setTimeframe(tf);
                            setIsTimeframeOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors ${timeframe === tf ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Faux Grid Background */}
              <div className="flex-1 w-full h-full p-8 pb-12 relative flex items-end">
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                
                {/* The Green flat line for $0 balance */}
                <div className="w-full h-[1px] bg-[#22c55e] relative z-10 opacity-80 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                
                {/* X Axis labels */}
                <div className="absolute bottom-4 left-8 right-8 justify-between text-[10px] text-zinc-600 font-mono hidden sm:flex">
                  <span>1:00 AM</span>
                  <span>3:00 AM</span>
                  <span>5:00 AM</span>
                  <span>7:00 AM</span>
                  <span>9:00 AM</span>
                  <span>11:00 AM</span>
                  <span>1:00 PM</span>
                  <span>3:00 PM</span>
                  <span>5:00 PM</span>
                  <span>7:00 PM</span>
                  <span>9:00 PM</span>
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
