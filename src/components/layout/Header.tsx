'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useDisconnect } from 'wagmi';

export function Header() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { disconnect } = useDisconnect();

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
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Discover', href: '/discover' },
  ];

  return (
    <header className="flex flex-wrap items-center justify-between p-3 sm:px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 relative">
      {/* Left section: Logo */}
      <div className="flex-1 flex items-center justify-start">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="TradeNexa" width={280} height={80} className="h-20 w-auto object-contain" />
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
            className={`p-2.5 rounded-full transition-colors ${isSettingsOpen ? 'bg-[#1a1b1f] text-white border-[#2b2d31]' : 'bg-[#101114] text-zinc-400 hover:text-white hover:bg-[#1a1b1f]'} border border-[#1a1b1f]`}
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
          
          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-black dark:text-white">Preferences</h3>
              </div>
              
              <div className="p-3 space-y-4">
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

                {/* Display Currency */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Currency</label>
                  <select className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>NGN (₦)</option>
                  </select>
                </div>
                
                {/* RPC Node */}
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Network Node</label>
                  <select className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm text-black dark:text-white focus:outline-none focus:border-blue-500">
                    <option>Ink Mainnet (Default)</option>
                    <option>Ink Fallback 1</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/20">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="relative group flex items-center h-full">
                      <button 
                        type="button" 
                        className="flex items-center gap-3 bg-[#0a0a0c] hover:bg-[#1a1b1f] text-white pl-1.5 pr-2 py-1.5 rounded-full font-bold text-[15px] transition-colors border border-blue-500/40"
                      >
                        {account.ensAvatar ? (
                          <img src={account.ensAvatar} alt="ENS Avatar" className="w-[26px] h-[26px] rounded-full" />
                        ) : (
                          <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner" />
                        )}
                        <span className="font-mono tracking-wide leading-none pt-0.5">{account.displayName}</span>
                        <div className="bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full text-[13px] font-black mr-0.5">
                          {chain.name === 'Ink Mainnet' || chain.name === 'Ink' ? 'Ink' : chain.name}
                        </div>
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-1">
                          <a href={`https://explorer.inkonchain.com/address/${account.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View on Ink Explorer
                          </a>
                          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            My Profile
                          </Link>
                          <Link href="/portfolio" className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            Wallet Dashboard
                          </Link>
                          <div className="h-px bg-zinc-800 my-1"></div>
                          <button 
                            onClick={() => disconnect()}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-left"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
