'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useDisconnect, useAccount } from 'wagmi';
import { ConnectWalletButton } from '../wallet/ConnectWalletButton';
import { useCurrencyStore, FIAT_RATES, FiatCurrency } from '../../store/currencyStore';

export function Header() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { disconnect } = useDisconnect();
  const { chain } = useAccount();
  const { fiat, setFiat } = useCurrencyStore();
  const currencies = Object.keys(FIAT_RATES) as FiatCurrency[];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Trade', href: '/trade' },
    { name: 'Market', href: '/market' },
    { name: 'Earn', href: '/earn' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <header className="flex flex-wrap items-center justify-between p-3 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 relative z-50">
      {/* Left section: Logo */}
      <div className="flex-1 flex items-center justify-start">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-black dark:text-white leading-none">TradeNexa</span>
            <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 mt-1 uppercase">Powered by Nado</span>
          </div>
        </Link>
      </div>

      {/* Center section: Navigation */}
      <nav className="flex w-full md:w-auto order-last md:order-none mt-2 md:mt-0 overflow-x-auto flex-shrink-0 items-center justify-start md:justify-center gap-6 md:gap-8 text-xs font-black uppercase tracking-widest [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`transition-colors whitespace-nowrap ${isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1 -mb-[5px]' : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Right section: Icons, Wallet */}
      <div className="flex-1 flex items-center gap-3 sm:gap-4 justify-end relative">
        
        {/* Action Icons */}
        <div className="hidden sm:flex items-center gap-1 relative" ref={settingsRef}>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Settings"
            className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-[#1a1b1f] text-white border-[#2b2d31]' : 'bg-[#101114] text-zinc-400 hover:text-white hover:bg-[#1a1b1f]'} border border-[#1a1b1f] h-[38px] w-[38px] flex items-center justify-center`}
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
          
          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden py-2">
              <div className="px-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-black dark:text-white">Preferences</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Theme Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-1.5 px-3 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-transparent">
                      Dark
                    </button>
                    <button className="py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors">
                      Light
                    </button>
                  </div>
                </div>

                {/* Currency Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Currency</label>
                  <select 
                    value={fiat} 
                    onChange={(e) => setFiat(e.target.value as any)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Language Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Language</label>
                  <select className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500">
                    <option>English</option>
                    <option>Espanol</option>
                    <option>Portugues</option>
                  </select>
                </div>
                
                {/* RPC Node */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Network Node</label>
                  <select className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500">
                    <option>{chain ? `${chain.name} (Default)` : 'Ink Mainnet (Default)'}</option>
                    <option>{chain ? `${chain.name} Fallback 1` : 'Ink Fallback 1'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
