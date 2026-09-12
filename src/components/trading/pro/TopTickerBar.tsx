'use client';

export function TopTickerBar() {
  return (
    <div className="flex items-center gap-6 p-3 bg-zinc-950 border-b border-zinc-800 text-sm overflow-x-auto whitespace-nowrap shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center gap-3 pr-6 border-r border-zinc-800 shrink-0">
        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] font-black text-black">₿</div>
        <h1 className="font-bold text-lg text-white flex items-center gap-2">
          BTC <span className="text-xs font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Perp</span>
        </h1>
      </div>

      <div className="flex flex-col">
        <span className="text-red-500 font-mono font-bold text-lg">77,068</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Oracle Price</span>
        <span className="text-white font-mono">77,065</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Index Price</span>
        <span className="text-white font-mono">77,102</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Change</span>
        <span className="text-green-500 font-mono">+158 (+0.20%)</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">24h Volume</span>
        <span className="text-white font-mono">197,948,342</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Open Interest</span>
        <span className="text-white font-mono">19,798,538</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Est. Funding (1h)</span>
        <span className="text-green-500 font-mono">+0.0011%</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Countdown</span>
        <span className="text-white font-mono">11:26</span>
      </div>
    </div>
  );
}
