'use client';

export function OrderEntry() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] p-4 text-white shrink-0">
      {/* Margin / Leverage row */}
      <div className="flex gap-2 mb-6">
        <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800">Cross</button>
        <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-1.5 rounded text-sm font-semibold transition-colors border border-zinc-800 flex items-center justify-center gap-1">
          50x <span className="text-[10px] text-zinc-500">▼</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-800 pb-2 mb-4 text-sm font-semibold">
        <button className="text-white border-b-2 border-white pb-2 -mb-[9px]">Market</button>
        <button className="text-zinc-500 hover:text-white transition-colors">Limit</button>
        <button className="text-zinc-500 hover:text-white transition-colors">Advanced</button>
      </div>

      <div className="flex justify-between text-xs text-zinc-400 mb-2 font-sans">
        <span>Available Margin</span>
        <span className="text-white font-mono">$0.00</span>
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mb-6 font-sans">
        <span>Position</span>
        <span className="text-white font-mono">0.00000 BTC</span>
      </div>

      {/* Input */}
      <div className="bg-zinc-900/50 rounded p-2 flex items-center justify-between mb-4 border border-zinc-800 focus-within:border-blue-500 transition-colors">
        <span className="text-zinc-500 text-sm pl-2">Size</span>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="0.00000" className="bg-transparent text-right text-white font-mono outline-none w-24 text-sm placeholder:text-zinc-700" />
          <span className="text-zinc-500 text-sm">BTC ⇌</span>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6 px-1 relative h-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 rounded-full" />
        <div className="absolute top-1/2 left-0 w-0 h-1 bg-white -translate-y-1/2 rounded-full" />
        <div className="absolute top-1/2 left-0 w-3 h-3 bg-white border border-zinc-400 rounded-full -translate-y-1/2 -translate-x-1.5 cursor-pointer shadow-sm" />
        
        <div className="flex justify-between text-[10px] text-zinc-500 mt-4 font-mono font-bold">
          <span>0%</span>
          <span>Max --</span>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-8">
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
          <input type="checkbox" className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" />
          Reduce Only
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors font-medium">
          <input type="checkbox" className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" />
          TP/SL
        </label>
      </div>

      <button className="w-full bg-zinc-200 hover:bg-white text-black font-bold py-3 rounded mb-6 transition-colors shadow-lg shadow-white/5">
        Sign In
      </button>

      <div className="space-y-2 text-xs text-zinc-500 mt-auto font-sans">
        <div className="flex justify-between"><span>Value</span><span className="font-mono">--</span></div>
        <div className="flex justify-between"><span>Cost</span><span className="font-mono">--</span></div>
        <div className="flex justify-between"><span>Liq. Price</span><span className="font-mono">--</span></div>
      </div>
    </div>
  );
}
