'use client';

import Link from 'next/link';
import { Settings, CreditCard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '../WalletConnectButton';
import { useCurrencyStore, FIAT_RATES, FiatCurrency } from '../../store/currencyStore';
import { useRampStore } from '../../store/rampStore';

export function Header() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { chain } = useAccount();
  const { fiat, setFiat } = useCurrencyStore();
  const { openRamp } = useRampStore();
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
    { name: 'Docs', href: '/docs' },
  ];

  return (
    <header className="flex flex-wrap items-center justify-between p-4 sm:px-8 bg-black border-b border-white/5 relative z-50 font-sans">
      {/* Left section: Logo */}
      <div className="flex-1 flex items-center justify-start shrink-0">
        <Link href="/" className="flex flex-col items-start justify-center gap-0 whitespace-nowrap shrink-0">
          <div className="text-xl md:text-2xl font-black tracking-tight text-white flex items-baseline leading-none">
            Trade<span className="text-[#B1FA41]">Nexa</span>
          </div>
          <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-zinc-400 mt-1 uppercase">
            POWERED BY NADO
          </div>
        </Link>
      </div>

      {/* Center section: Navigation (Pill-shaped like Cryptfy) */}
      <nav className="flex w-full md:w-auto order-3 md:order-none mt-4 md:mt-0 flex-shrink-0 items-center justify-start md:justify-center gap-2 overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Right section: Icons, Wallet */}
      <div className="flex-1 flex items-center gap-3 sm:gap-4 justify-end relative">
        
        {/* Buy / Sell Crypto Button */}
        <button
          onClick={() => openRamp()}
          className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#B1FA41]/10 hover:bg-[#B1FA41]/20 border border-[#B1FA41]/30 text-[#B1FA41] text-xs font-bold transition-all shadow-[0_0_15px_rgba(177,250,65,0.1)] hover:scale-105"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Buy Crypto
        </button>

        {/* Action Icons */}
        <div className="hidden sm:flex items-center gap-1 relative" ref={settingsRef}>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Settings"
            className={`transition-all rounded-full border ${isSettingsOpen ? 'bg-[#121824] border-white/20 text-white' : 'bg-[#08080a] border-white/5 text-zinc-400 hover:text-white hover:bg-[#121824] hover:border-white/10'} h-[52px] px-4 flex items-center justify-center`}
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
              <div className="px-4 pb-3 pt-2 border-b border-white/5">
                <h3 className="font-bold text-sm text-white">Preferences</h3>
              </div>
              
              <div className="p-4 space-y-4">


                {/* Currency Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Currency</label>
                  <select 
                    value={fiat} 
                    onChange={(e) => setFiat(e.target.value as FiatCurrency)}
                    className="w-full bg-[#121824] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#B1FA41]"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Language Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Language</label>
                  <select className="w-full bg-[#121824] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#B1FA41]">
                    <option>English</option>
                    <option>Espanol</option>
                    <option>Portugues</option>
                  </select>
                </div>
                
                {/* RPC Node */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Network Node</label>
                  <select className="w-full bg-[#121824] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#B1FA41]">
                    <option>{chain ? `${chain.name} (Default)` : 'Ink Mainnet (Default)'}</option>
                    <option>{chain ? `${chain.name} Fallback 1` : 'Ink Fallback 1'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Web3 Wallet Connect Button */}
        <div>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
