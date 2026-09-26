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
    <header className="flex flex-wrap items-center justify-between p-4 sm:px-8 bg-white border-b border-black/5 relative z-50 font-sans">
      {/* Left section: Logo */}
      <div className="flex-1 flex items-center justify-start">
        <Link href="/" className="flex flex-col items-start gap-0.5">
          <Image 
            src="/logo.png" 
            alt="TradeNexa Logo" 
            width={180} 
            height={50} 
            className="w-auto h-8 md:h-10 object-contain"
            priority
          />
        </Link>
      </div>

      {/* Center section: Navigation (Pill-shaped like Cryptfy) */}
      <nav className="hidden md:flex flex-shrink-0 items-center justify-center gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-black/10 text-black' 
                  : 'text-zinc-500 hover:text-black hover:bg-black/5'
              }`}
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
            className={`transition-all rounded-full border ${isSettingsOpen ? 'bg-zinc-100 border-black/20 text-black' : 'bg-zinc-100 border-black/5 text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-black/10'} h-[52px] px-4 flex items-center justify-center`}
          >
            <Settings className="w-5 h-5" />
          </button>
          
          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-black/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
              <div className="px-4 pb-3 pt-2 border-b border-black/5">
                <h3 className="font-bold text-sm text-black">Preferences</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Theme Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-1.5 px-3 rounded-lg text-sm font-medium bg-[#B1FA41] text-black border border-transparent">
                      Dark
                    </button>
                    <button className="py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-black/5 text-zinc-500 transition-colors">
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
                    className="w-full bg-zinc-100 border border-black/10 rounded-lg p-2 text-sm text-black focus:outline-none focus:border-[#B1FA41]"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Language Setting */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Language</label>
                  <select className="w-full bg-zinc-100 border border-black/10 rounded-lg p-2 text-sm text-black focus:outline-none focus:border-[#B1FA41]">
                    <option>English</option>
                    <option>Espanol</option>
                    <option>Portugues</option>
                  </select>
                </div>
                
                {/* RPC Node */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Network Node</label>
                  <select className="w-full bg-zinc-100 border border-black/10 rounded-lg p-2 text-sm text-black focus:outline-none focus:border-[#B1FA41]">
                    <option>{chain ? `${chain.name} (Default)` : 'Ink Mainnet (Default)'}</option>
                    <option>{chain ? `${chain.name} Fallback 1` : 'Ink Fallback 1'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom style for the wallet button to match the dark neon theme */}
        <div className="[&_button]:!bg-white [&_button]:!text-black [&_button]:hover:!bg-zinc-100 [&_button]:!font-bold [&_button]:!rounded-full">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
