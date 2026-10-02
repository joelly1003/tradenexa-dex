'use client';

import Link from 'next/link';
import { Settings, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '../WalletConnectButton';
import { useCurrencyStore, FIAT_RATES, FiatCurrency } from '../../store/currencyStore';
import { FiatRampModal } from '../FiatRampModal';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRampOpen, setIsRampOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
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

      {/* Center section: Navigation (Hidden on mobile) */}
      <nav className="hidden lg:flex w-auto items-center justify-center gap-2">
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
        <div className="hidden sm:flex items-center gap-1 relative" ref={settingsRef}>
          <button
            onClick={() => setIsRampOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-4 h-[38px] bg-[#B1FA41]/10 hover:bg-[#B1FA41]/20 border border-[#B1FA41]/30 text-[#B1FA41] rounded-full text-xs font-bold transition-all"
          >
            Buy Crypto
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Settings"
            className={`transition-all rounded-full border ${isSettingsOpen ? 'bg-[#121824] border-white/20 text-white' : 'bg-[#08080a] border-white/5 text-zinc-400 hover:text-white hover:bg-[#121824] hover:border-white/10'} h-[38px] px-3.5 flex items-center justify-center`}
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <FiatRampModal isOpen={isRampOpen} onClose={() => setIsRampOpen(false)} type="buy" />
          
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
        
        {/* Web3 Wallet Connect Button (Hidden on very small mobile if taking too much space, but let's leave it) */}
        <div className="hidden sm:block">
          <WalletConnectButton />
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        navLinks={navLinks} 
        pathname={pathname}
      />
    </header>
  );
}
