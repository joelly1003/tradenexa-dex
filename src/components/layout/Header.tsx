'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Globe, Bell, Settings, Activity, ChevronDown } from 'lucide-react';
import { useRegional } from '../providers/RegionalProvider';

export function Header() {
  const { currency, setCurrency, language, setLanguage, region, setRegion } = useRegional();
  const [isRegionOpen, setIsRegionOpen] = useState(false);

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
        
        {/* Unified Regional Settings Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsRegionOpen(!isRegionOpen)}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-semibold hover:border-blue-500 transition-colors"
          >
            <Globe className="w-4 h-4 text-zinc-500" />
            <span className="hidden sm:inline">{region} / {currency} / {language}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isRegionOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value as any)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg p-2 text-sm outline-none">
                    <option value="US">🇺🇸 United States</option>
                    <option value="EU">🇪🇺 European Union</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="NG">🇳🇬 Nigeria</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg p-2 text-sm outline-none">
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="NGN">₦ NGN</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg p-2 text-sm outline-none">
                    <option value="EN">English</option>
                    <option value="ES">Spanish</option>
                    <option value="FR">French</option>
                    <option value="DE">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

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
