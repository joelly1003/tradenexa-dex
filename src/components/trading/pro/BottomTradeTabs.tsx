import { useState } from 'react';

export function BottomTradeTabs() {
  const [activeTab, setActiveTab] = useState('Positions');
  
  const tabs = ['Positions', 'Open Orders', 'Order History', 'Realized PnL'];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border-t border-zinc-900 text-sm">
      <div className="flex border-b border-zinc-900">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === tab 
                ? 'text-[#B1FA41] border-b-2 border-[#B1FA41]' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-zinc-600 flex flex-col items-center">
          <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>No {activeTab.toLowerCase()} found</span>
        </div>
      </div>
    </div>
  );
}

