'use client';

export function PortfolioInterface() {
  return (
    <div className="flex flex-col h-[calc(100vh-81px)] bg-[#0a0a0c] text-white overflow-hidden p-6 mx-auto w-full">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
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
        
        <div className="flex gap-3">
          <button className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800/50 px-6 py-2 rounded text-sm font-semibold transition-colors">Transfer</button>
          <button className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800/50 px-6 py-2 rounded text-sm font-semibold transition-colors">Withdraw</button>
          <button className="bg-[#1c1c1f] hover:bg-zinc-800 border border-zinc-800/50 px-6 py-2 rounded text-sm font-semibold transition-colors">Deposit</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-900 mb-6 shrink-0">
        <button className="text-white border-b-2 border-white pb-3 font-semibold text-sm -mb-[1px]">Overview</button>
        <button className="text-zinc-500 hover:text-white pb-3 font-semibold text-sm transition-colors -mb-[1px]">Margin Manager</button>
        <button className="text-zinc-500 hover:text-white pb-3 font-semibold text-sm transition-colors -mb-[1px]">History</button>
      </div>

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
      <div className="flex flex-1 min-h-0 border border-zinc-900 rounded-lg overflow-hidden bg-[#0a0a0c] flex-col md:flex-row">
        {/* Left Side Stats */}
        <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col bg-[#0a0a0c]">
          <div className="flex gap-4 p-4 border-b border-zinc-900 text-xs font-semibold">
            <button className="text-white">Account</button>
            <button className="text-zinc-500 hover:text-white">PnL</button>
            <button className="text-zinc-500 hover:text-white">Volume</button>
          </div>
          
          <div className="p-4 space-y-4 text-xs">
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
            <button className="bg-zinc-900 border border-zinc-800 text-xs text-white px-3 py-1.5 rounded flex items-center gap-2 hover:bg-zinc-800">
              24h <span className="text-[10px] text-zinc-500">▼</span>
            </button>
          </div>
          
          {/* Faux Grid Background */}
          <div className="flex-1 w-full h-full p-8 pb-12 relative flex items-end">
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
            
            {/* The Green flat line for $0 balance */}
            <div className="w-full h-[1px] bg-[#22c55e] relative z-10 opacity-80 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
            
            {/* X Axis labels */}
            <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] text-zinc-600 font-mono hidden sm:flex">
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
    </div>
  );
}
