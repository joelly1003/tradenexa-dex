'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useState, useEffect, useRef } from 'react';
import { LogOut, Wallet, Loader2, ChevronDown } from 'lucide-react';

export function ConnectWalletButton() {
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { data: balance } = useBalance({ address });
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-[140px] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl"></div>
    );
  }

  if (isConnecting) {
    return (
      <button disabled className="h-10 px-4 flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-xl font-bold text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (!isConnected || !address) {
    return (
      <button 
        onClick={() => open()}
        className="h-10 px-5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const balanceFormatted = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 INK';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="h-10 pl-3 pr-2 flex items-center gap-3 bg-zinc-100 dark:bg-[#101114] hover:bg-zinc-200 dark:hover:bg-[#1a1b1f] border border-transparent dark:border-zinc-800 text-black dark:text-white rounded-xl transition-all font-mono text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white dark:border-zinc-950 flex-shrink-0"></div>
          <span className="font-bold tracking-tight">{truncatedAddress}</span>
        </div>
        <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800"></div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs hidden sm:block">{balanceFormatted}</span>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#151518] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Connected to Ink</div>
            <div className="font-mono font-bold text-black dark:text-white">{truncatedAddress}</div>
            <div className="text-sm font-medium text-zinc-500 mt-2">{balanceFormatted}</div>
          </div>
          <div className="p-2">
            <button 
              onClick={() => { open(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-zinc-400" />
              Wallet Settings
            </button>
            <button 
              onClick={() => { disconnect(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center gap-2 mt-1"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
