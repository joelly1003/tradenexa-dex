'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Search, Globe, Bell, Settings, Activity } from 'lucide-react';
import { useRegional } from '../providers/RegionalProvider';

export function Header() {
  const { currency, setCurrency, language, setLanguage, region, setRegion } = useRegional();

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

      {/* Middle section: Search */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search tokens, pairs, or markets..." 
          className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all dark:text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Right section: Region, Icons, Wallet */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        
        {/* Enhanced Regional Selectors */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
          <Globe className="w-4 h-4 text-zinc-500 ml-2" />
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value as any)}
            className="bg-transparent border-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:text-black dark:hover:text-white"
          >
            <option value="US">US</option>
            <option value="EU">EU</option>
            <option value="NG">NG</option>
            <option value="UK">UK</option>
          </select>
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700"></div>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent border-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:text-black dark:hover:text-white"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="NGN">NGN</option>
            <option value="GBP">GBP</option>
          </select>
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700"></div>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent border-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:text-black dark:hover:text-white mr-1"
          >
            <option value="EN">EN</option>
            <option value="ES">ES</option>
            <option value="FR">FR</option>
            <option value="DE">DE</option>
          </select>
        </div>

        {/* Action Icons */}
        <div className="hidden sm:flex items-center gap-1">
          <button className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <ConnectButton showBalance={true} />
      </div>
    </header>
  );
}
