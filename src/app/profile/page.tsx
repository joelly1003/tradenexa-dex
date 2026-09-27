"use client";

import React, { useState } from 'react';
import { User, Edit2, Shield, Activity, ListOrdered } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('Joelly1003');
  const [tempUsername, setTempUsername] = useState('Joelly1003');

  const handleSave = () => {
    setUsername(tempUsername);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTempUsername(username);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto font-sans">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Top Profile Card */}
        <div className="bg-[#121216] border border-white/5 rounded-[24px] p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          {/* Subtle glow effect behind */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          
          {/* Avatar */}
          <div className="w-[120px] h-[120px] rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 to-blue-600 shrink-0">
            <div className="w-full h-full bg-[#121216] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-zinc-400" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 z-10 w-full mt-2">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  autoFocus
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-3xl font-bold text-white outline-none focus:border-[#B1FA41]/50"
                />
              ) : (
                <h1 className="text-3xl font-bold">{username}</h1>
              )}
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-white/5"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-black/40 border border-white/5 rounded-full px-4 py-1.5 text-[13px] font-mono text-zinc-400">
                0x20BA6f38012c8883D013a3e561f34D11E7E85e0f
              </div>
              <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1 text-xs font-bold">
                Ink
              </div>
              <div className="text-sm text-zinc-400 ml-2">
                Subaccount: default
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                Verified
              </div>
              <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Active Trader
              </div>
            </div>
          </div>
        </div>

        {/* Middle row: Margin Meter & Equity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Margin Meter */}
          <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 lg:col-span-2 relative overflow-hidden">
            <Shield className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 text-white/[0.02]" />
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" /> Liquidation Margin Meter
            </div>
            
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">0.00%</span>
                <span className="text-zinc-500 text-sm">used</span>
              </div>
              <div className="text-right">
                <div className="text-zinc-400 text-xs mb-1">Margin Maintenance</div>
                <div className="text-yellow-500 font-bold">$0.00</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="h-2.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B1FA41] to-red-500 w-[0%]" />
              </div>
              <div className="flex justify-between items-center mt-3 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                <span>Safe</span>
                <span>Warning</span>
                <span className="text-red-900">Liquidation</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 flex flex-col justify-center gap-6">
            <div>
              <div className="text-zinc-400 text-sm mb-1 font-semibold">Total Equity (Collateral)</div>
              <div className="text-3xl font-black">$0.00</div>
            </div>
            <div>
              <div className="text-zinc-400 text-xs mb-1 font-semibold">Free Collateral</div>
              <div className="text-xl font-black text-[#B1FA41]">$0.00</div>
            </div>
          </div>
        </div>

        
        {/* Historical PnL */}
        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 h-[300px]">
          <div className="flex items-center gap-2 text-white font-bold mb-4">
            <Activity className="w-4 h-4" /> 30-Day Historical PnL
          </div>
        </div>

        {/* Lower Row: PnL and Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold mb-4">
              <ListOrdered className="w-4 h-4" /> Estimated Net PnL
            </div>
            <div className="text-3xl font-black text-[#B1FA41]">+$0.00</div>
          </div>

          <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> 
              Win Rate (Fills)
            </div>
            <div className="text-3xl font-black text-white mb-2">0%</div>
            <div className="h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden">
                <div className="h-full bg-white w-[0%]" />
            </div>
          </div>

          <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold mb-4">
              <Activity className="w-4 h-4" /> Total Volume (Fills)
            </div>
            <div className="text-3xl font-black text-white">$0.00</div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-[#121216] border border-white/5 rounded-[20px] overflow-hidden mt-2">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2 text-white font-bold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Past Fills History
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-bold text-zinc-500 uppercase bg-[#0d0d11]">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Side</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Amount</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No fills found on this subaccount.
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
