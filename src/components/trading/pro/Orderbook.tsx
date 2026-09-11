'use client';

export function Orderbook() {
  // Mock orderbook data
  const asks = Array.from({ length: 14 }).map((_, i) => ({
    price: 77070 + (i * 10),
    size: (Math.random() * 10).toFixed(4),
    total: (Math.random() * 50).toFixed(4)
  })).reverse();
  
  const bids = Array.from({ length: 14 }).map((_, i) => ({
    price: 77060 - (i * 10),
    size: (Math.random() * 10).toFixed(4),
    total: (Math.random() * 50).toFixed(4)
  }));

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-xs font-mono border-l border-r border-zinc-900 shrink-0">
      <div className="flex gap-4 p-3 border-b border-zinc-900 text-zinc-500 font-sans font-semibold text-sm">
        <button className="text-white border-b-2 border-zinc-700 pb-1 -mb-[13px]">Book</button>
        <button className="hover:text-white transition-colors">Trades</button>
      </div>
      
      <div className="flex justify-between px-3 py-2 text-zinc-500 border-b border-zinc-900 font-sans text-[10px] uppercase tracking-wider font-semibold">
        <span>Price</span>
        <span>Size</span>
        <span>Total BTC</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col py-1">
        {/* Asks (Red) */}
        <div className="flex flex-col-reverse flex-1 justify-end">
          {asks.map((ask, i) => (
            <div key={i} className="flex justify-between px-3 py-0.5 hover:bg-zinc-800/50 cursor-pointer relative group">
              <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${Math.min(100, Number(ask.total) * 2)}%` }} />
              <span className="text-red-500 relative z-10 w-1/3 text-left">{ask.price.toFixed(0)}</span>
              <span className="text-zinc-300 relative z-10 w-1/3 text-right">{ask.size}</span>
              <span className="text-zinc-500 relative z-10 w-1/3 text-right">{ask.total}</span>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="py-2 px-3 border-y border-zinc-900 my-1 flex items-center justify-between font-sans">
          <span className="text-lg font-bold text-green-500 flex items-center gap-2 font-mono">
            77,068 <span className="text-sm">↓</span>
          </span>
          <span className="text-zinc-500 font-semibold text-[10px]">Spread: 0.00%</span>
        </div>

        {/* Bids (Green) */}
        <div className="flex flex-col flex-1 justify-start">
          {bids.map((bid, i) => (
            <div key={i} className="flex justify-between px-3 py-0.5 hover:bg-zinc-800/50 cursor-pointer relative group">
              <div className="absolute right-0 top-0 h-full bg-green-500/10" style={{ width: `${Math.min(100, Number(bid.total) * 2)}%` }} />
              <span className="text-green-500 relative z-10 w-1/3 text-left">{bid.price.toFixed(0)}</span>
              <span className="text-zinc-300 relative z-10 w-1/3 text-right">{bid.size}</span>
              <span className="text-zinc-500 relative z-10 w-1/3 text-right">{bid.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
