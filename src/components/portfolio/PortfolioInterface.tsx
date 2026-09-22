'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { Wallet } from 'lucide-react';

export function PortfolioInterface() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { open } = useAppKit();
  const [topTab, setTopTab] = useState<'Overview' | 'Margin Manager' | 'History'>('Overview');
  const [leftTab, setLeftTab] = useState<'Account' | 'PnL' | 'Volume'>('Account');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'All'>('24h');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'Transfer' | 'Withdraw' | 'Deposit' | null>(null);

  const accountRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-zinc-950 p-6 text-white">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-3">Connect Wallet</h2>
          <p className="text-zinc-400 text-sm mb-8">Please connect your wallet to view and manage your portfolio positions.</p>
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
    <div className="flex flex-col h-auto lg:h-[calc(100vh-81px)] bg-[#0a0a0c] text-white lg:overflow-hidden overflow-y-auto p-4 lg:p-6 mx-auto w-full max-w-[1400px] relative">
      
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/10 text-red-500 flex items-center justify-center rounded-md border border-red-500/20 shadow-sm shrink-0">
            <span className="font-black text-lg leading-none">V</span>
          </div>
          <div className="relative" ref={accountRef}>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}>
              <h1 className="text-[17px] font-bold tracking-tight text-white group-hover:text-zinc-200">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Account 1'}
              </h1>
              <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (address) window.open(`https://explorer.inkonchain.com/address/${address}`, '_blank');
                  else alert("Wallet not connected");
                }}
                className="ml-1 text-zinc-500 hover:text-white transition-colors"
                title="View on Explorer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-zinc-500 font-medium leading-none mt-0.5">
              Account
            </div>

            {isAccountDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#151518] border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-20">
                <button 
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-zinc-800 flex items-center justify-between"
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  <span className="font-bold">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Account 1'}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </button>
                <button 
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800"
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  Create New Account
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveModal('Transfer')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap text-zinc-300 hover:text-white shadow-sm"
          >
            Transfer
          </button>
          <button 
            onClick={() => setActiveModal('Withdraw')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap text-zinc-300 hover:text-white shadow-sm"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setActiveModal('Deposit')}
            className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 whitespace-nowrap text-zinc-300 hover:text-white shadow-sm"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-900/50 mb-6 shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {(['Overview', 'Margin Manager', 'History'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setTopTab(tab)}
            className={`pb-2.5 font-bold text-[14px] transition-colors -mb-[1px] whitespace-nowrap ${topTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conditional Top Tab View */}
      {topTab === 'History' ? (
        <div className="flex-1 border border-zinc-900 rounded-lg p-8 bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-500">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
            <span className="text-lg">H</span>
          </div>
          <p className="text-sm font-semibold text-zinc-400">No recent trade or deposit history found.</p>
        </div>
      ) : topTab === 'Margin Manager' ? (
        <div className="flex-1 border border-zinc-900 rounded-lg p-8 bg-[#0a0a0c] flex flex-col items-center justify-center text-zinc-500">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
            <span className="text-lg">M</span>
          </div>
          <p className="text-sm font-semibold text-zinc-400">Cross / Isolated Margin Manager active.</p>
          <p className="text-base font-bold text-white mt-1">Available Margin: $0.00</p>
        </div>
      ) : (
        <>
          {/* 3 Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900 mb-6 bg-[#0a0a0c] shrink-0">
            <div className="p-4 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-between h-[88px] hover:bg-[#0c0c0f] transition-colors">
              <div>
                <div className="text-zinc-500 text-[11px] font-medium mb-0.5">Total Equity</div>
                <div className="text-[20px] font-bold tracking-tight text-white">${balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'}</div>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">24h PnL <span className="text-white ml-1 font-mono">$0.00</span></div>
            </div>
            
            <div className="p-4 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col justify-between h-[88px] hover:bg-[#0c0c0f] transition-colors">
              <div>
                <div className="text-zinc-500 text-[11px] font-medium mb-0.5">30d Volume</div>
                <div className="text-[20px] font-bold tracking-tight text-white">$0.00</div>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Fee Tier: <span className="text-white ml-1 font-mono">0.01% / 0.035%</span></div>
            </div>

            <div className="p-4 flex flex-col justify-between h-[88px] hover:bg-[#0c0c0f] transition-colors">
              <div>
                <div className="text-zinc-500 text-[11px] font-medium mb-0.5">Wallet Balance ({balanceData?.symbol || 'ETH'})</div>
                <div className="text-[20px] font-bold tracking-tight text-white">{balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00'}</div>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">APR: <span className="text-white ml-1 font-mono font-bold">6.95%</span></div>
            </div>
          </div>

          {/* Main Bottom Section */}
          <div className="flex flex-1 lg:min-h-0 min-h-[400px] border border-zinc-900 bg-[#0a0a0c] flex-col md:flex-row">
            {/* Left Side Stats */}
            <div className="w-full md:w-[320px] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col">
              <div className="flex gap-4 p-3 px-4 border-b border-zinc-900 text-[13px] font-bold bg-[#0c0c0f]">
                {(['Account', 'PnL', 'Volume'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setLeftTab(tab)}
                    className={`transition-colors ${leftTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-4 space-y-3.5 text-[12px] font-medium">
                {leftTab === 'Account' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Balance</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized Perp PnL</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized Spot PnL</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Available Margin</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Maintenance Margin & Ratio</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-1 bg-zinc-800 rounded-full relative">
                           <div className="absolute left-0 top-0 h-full w-[10%] bg-[#22c55e]"></div>
                        </div>
                        <span className="text-[#22c55e] font-mono font-bold">0.00%</span>
                      </div>
                    </div>
                  </>
                )}

                {leftTab === 'PnL' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Realized PnL ({timeframe})</span>
                      <span className="text-[#22c55e] font-mono font-bold">+$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Unrealized PnL</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Win Rate</span>
                      <span className="text-white font-mono font-bold">0.0%</span>
                    </div>
                  </>
                )}

                {leftTab === 'Volume' && (
                  <>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Perp Volume ({timeframe})</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Spot Volume ({timeframe})</span>
                      <span className="text-white font-mono font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Total Trades</span>
                      <span className="text-white font-mono font-bold">0</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Side Chart Area */}
            <div className="flex-1 flex flex-col relative bg-[#0a0a0c]">
              <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                  <button 
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="bg-[#151518] border border-zinc-800 text-[11px] text-zinc-300 px-3 py-1 rounded flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    {timeframe} 
                    <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isTimeframeOpen && (
                    <div className="absolute top-full right-0 mt-1 w-24 bg-[#151518] border border-zinc-800 rounded shadow-xl overflow-hidden z-20">
                      {(['24h', '7d', '30d', 'All'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => {
                            setTimeframe(tf);
                            setIsTimeframeOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-zinc-800 transition-colors ${timeframe === tf ? 'text-white bg-zinc-800' : 'text-zinc-400'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Faux Grid Background */}
              <div className="flex-1 w-full h-full p-4 pb-8 relative flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1f1f22_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
                
                {/* The Green flat line for $0 balance */}
                <div className="w-full h-[1px] bg-[#22c55e] relative z-10"></div>
                
                {/* X Axis labels */}
                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-zinc-500 font-mono font-medium hidden sm:flex">
                  <span>5:00 PM</span>
                  <span>7:00 PM</span>
                  <span>9:00 PM</span>
                  <span>11:00 PM</span>
                  <span>1:00 AM</span>
                  <span>3:00 AM</span>
                  <span>5:00 AM</span>
                  <span>7:00 AM</span>
                  <span>9:00 AM</span>
                  <span>11:00 AM</span>
                  <span>1:00 PM</span>
                  <span>3:40 PM</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
