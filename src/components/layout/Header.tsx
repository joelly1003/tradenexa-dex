'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Settings, Activity } from 'lucide-react';

export function Header() {

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-3 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 gap-4">
      {/* Left section: Logo and Nav */}
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
          <Activity className="w-6 h-6" />
          TradeNexa
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          <Link href="/trade" className="hover:text-black dark:hover:text-white transition-colors">Trade</Link>
          <Link href="/market" className="hover:text-black dark:hover:text-white transition-colors">Markets</Link>
          <Link href="/portfolio" className="hover:text-black dark:hover:text-white transition-colors">Portfolio</Link>
        </nav>
      </div>

      {/* Right section: Region, Icons, Wallet */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end relative">
        
        {/* Action Icons */}
        <div className="hidden sm:flex items-center gap-1">
          <button className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <ConnectButton showBalance={true} />
      </div>
    </header>
  );
}
