'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black px-6 py-8 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left Section: Logo & Tagline */}
        <div className="flex flex-col gap-1.5">
          <Link href="/" className="flex flex-col items-start justify-center gap-0 whitespace-nowrap shrink-0 group">
            <div className="text-xl md:text-2xl font-black tracking-tight text-white flex items-baseline leading-none">
              Trade<span className="text-[#B1FA41]">Nexa</span>
            </div>
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-zinc-400 mt-1 uppercase">
              POWERED BY NADO
            </div>
          </Link>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-xs">
            Powered by NADO Liquidity Engine • Settled on Ink Network.
          </p>
        </div>

        {/* Right Section: Links & Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          <nav className="flex items-center gap-6 font-medium">
            <Link href="/trade" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Pro Trade
            </Link>
            <Link href="/leaderboard" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/docs" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Documentation
            </Link>
          </nav>

          <div className="text-zinc-500 dark:text-zinc-600 hidden md:block">|</div>

          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} TradeNexa. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
