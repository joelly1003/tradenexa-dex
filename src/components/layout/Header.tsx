'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

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
