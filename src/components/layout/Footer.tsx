'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0c] px-6 py-8 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left Section: Logo & Tagline */}
        <div className="flex flex-col gap-1.5">
          <Link href="/" className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-black dark:text-white leading-none">TradeNexa</span>
              <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 mt-1 uppercase">Powered by Nado</span>
            </div>
          </Link>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-xs">
            Institutional-grade performance built on the Ink network.
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
            <div className="flex items-center gap-2 text-zinc-400 cursor-not-allowed">
              <span>Documentation</span>
              <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">Soon</span>
            </div>
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
