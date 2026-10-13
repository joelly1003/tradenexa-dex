'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

export function PositionsPanel() {
  const [activeTab, setActiveTab] = useState('Positions');
  const { isConnected, address } = useAccount();

  const tabs = [
    { name: 'Positions', count: 0 },
    { name: 'Open Orders', count: 0 },
    { name: 'Order History', count: 0 },
    { name: 'Realized PnL', count: 0 }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0E14] border-t border-white/10 text-white font-sans text-xs">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-2 bg-[#08090C]">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-3 font-semibold transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.name 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.name ? 'bg-[#B1FA41]/20 text-[#B1FA41]' : 'bg-white/5 text-zinc-500'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B1FA41]" />
              )}
            </button>
          ))}
        </div>

        {isConnected && address && (
          <div className="hidden sm:flex items-center gap-2 pr-3 text-[11px] text-zinc-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA41]" />
            <span>Ink Subaccount: {address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        )}
      </div>

      {/* Table Headers for Professional DEX Layout */}
      {activeTab === 'Positions' && (
        <div className="grid grid-cols-7 px-4 py-2 text-[10px] uppercase font-bold text-zinc-500 bg-[#0c0e14] border-b border-white/5">
          <div>Market</div>
          <div>Size</div>
          <div>Entry Price</div>
          <div>Mark Price</div>
          <div>Liq. Price</div>
          <div>Margin</div>
          <div className="text-right">PnL (ROE)</div>
        </div>
      )}

      {activeTab === 'Open Orders' && (
        <div className="grid grid-cols-6 px-4 py-2 text-[10px] uppercase font-bold text-zinc-500 bg-[#0c0e14] border-b border-white/5">
          <div>Market</div>
          <div>Type</div>
          <div>Side</div>
          <div>Price</div>
          <div>Amount</div>
          <div className="text-right">Action</div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-600">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mb-2 opacity-30 text-zinc-400" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" />
          <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" />
        </svg>
        <span className="text-xs text-zinc-500">
          {isConnected ? `No active ${activeTab.toLowerCase()} on Ink Network` : 'Connect wallet to view positions & orders'}
        </span>
      </div>
    </div>
  );
}
