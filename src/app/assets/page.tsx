"use client";

import React, { useState } from 'react';
import { RefreshCw, Link as LinkIcon, Download, Upload, ArrowRightLeft, Clock } from 'lucide-react';

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('Deposit');

  return (
    <div className="min-h-screen bg-[#050506] text-white p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black tracking-tight">Asset Management</h1>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-[#B1FA41]" />
            Connected to Ink L2 • Nado DEX Matching Engine
          </div>
        </div>
        <div className="bg-[#121216] border border-white/5 rounded-xl px-6 py-4 min-w-[240px]">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nado Dex Total Collateral</div>
          <div className="text-3xl font-black text-white">$0.00</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-[#B1FA41]" /> NADO DEX COLLATERAL
            </div>
            <div className="bg-[#B1FA41]/10 text-[#B1FA41] text-[10px] font-bold px-2 py-1 rounded-md">DEX Trading</div>
          </div>
          <div className="text-3xl font-black mb-6">$0.00</div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Free Trading Margin:</span>
            <span className="text-[#B1FA41] font-bold">$0.00</span>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> METAMASK WALLET USDC
            </div>
            <div className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md">On-Chain</div>
          </div>
          <div className="text-3xl font-black mb-6">$0.00</div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Available to Deposit:</span>
            <span className="text-blue-400 font-bold">$0.00</span>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> INK GAS RESERVE
            </div>
            <div className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-md">Native Gas</div>
          </div>
          <div className="text-3xl font-black mb-6">0.0000 <span className="text-xl text-zinc-500">ETH</span></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Ink Network Fee Status:</span>
            <span className="text-[#B1FA41] font-bold">Ready</span>
          </div>
        </div>
      </div>

      {/* Empty State Banner */}
      <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-[#B1FA41]/10 flex items-center justify-center shrink-0">
            <LinkIcon className="w-6 h-6 text-[#B1FA41]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">No Assets Deposited on Nado DEX Yet</h3>
            <p className="text-sm text-zinc-400">Deposit USDC into Nado DEX to access up to 100x leverage on perpetual contracts.</p>
          </div>
        </div>
        <button className="bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold px-6 py-3 rounded-xl whitespace-nowrap transition-colors shadow-[0_0_20px_rgba(177,250,65,0.2)]">
          Deposit USDC to Nado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Deposit/Withdraw Panel */}
        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 lg:col-span-1">
          <div className="flex items-center bg-[#0d0d11] rounded-xl p-1 mb-6 border border-white/5">
            <button 
              onClick={() => setActiveTab('Deposit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'Deposit' ? 'bg-[#B1FA41] text-black shadow-[0_0_15px_rgba(177,250,65,0.2)]' : 'text-zinc-400 hover:text-white'}`}
            >
              <Download className="w-4 h-4" /> Deposit
            </button>
            <button 
              onClick={() => setActiveTab('Withdraw')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'Withdraw' ? 'bg-[#B1FA41] text-black shadow-[0_0_15px_rgba(177,250,65,0.2)]' : 'text-zinc-400 hover:text-white'}`}
            >
              <Upload className="w-4 h-4" /> Withdraw
            </button>
            <button 
              onClick={() => setActiveTab('Transfer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'Transfer' ? 'bg-[#B1FA41] text-black shadow-[0_0_15px_rgba(177,250,65,0.2)]' : 'text-zinc-400 hover:text-white'}`}
            >
              <ArrowRightLeft className="w-4 h-4" /> Transfer
            </button>
          </div>

          <div className="mb-6">
            <div className="text-sm font-semibold text-zinc-400 mb-2">Asset</div>
            <div className="bg-[#0d0d11] border border-white/5 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#2775CA] flex items-center justify-center text-white font-bold text-lg shrink-0">
                $
              </div>
              <div>
                <div className="font-bold text-white text-lg">USDC</div>
                <div className="text-xs text-zinc-500">USD Coin (Nado Primary Settlement)</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-semibold text-zinc-400">Amount</div>
              <div className="text-xs font-mono text-zinc-500">MetaMask Wallet: $0.00</div>
            </div>
            <div className="bg-[#0d0d11] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <input 
                type="text" 
                placeholder="0.0" 
                className="bg-transparent text-3xl font-black text-white w-2/3 outline-none"
              />
              <div className="flex gap-2">
                <button className="bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-md transition-colors">50%</button>
                <button className="bg-[#B1FA41]/20 hover:bg-[#B1FA41]/30 text-[#B1FA41] text-xs font-bold px-3 py-1.5 rounded-md transition-colors">MAX</button>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#2a2a30] text-zinc-400 font-bold text-lg py-4 rounded-xl cursor-not-allowed">
            Confirm {activeTab}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-[#121216] border border-white/5 rounded-[20px] lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Transaction History</h2>
          </div>
          <div className="w-full overflow-x-auto flex-1 flex flex-col">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-bold text-zinc-500 uppercase bg-[#0d0d11]">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Network</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="flex-1">
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-zinc-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
