'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useState, useEffect, useRef } from 'react';
import { LogOut, Wallet, Loader2 } from 'lucide-react';

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
      <div className="h-12 w-[160px] bg-white/5 animate-pulse rounded-full border border-white/10"></div>
    );
  }

  if (isConnecting) {
    return (
      <button disabled className="h-12 px-5 flex items-center justify-center gap-2 bg-black border border-[#05c4a7]/30 text-zinc-500 rounded-full font-bold text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (!isConnected || !address) {
    return (
      <button 
        onClick={() => open()}
        className="h-12 px-6 flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-sm transition-all active:scale-95"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const balanceValue = balance ? parseFloat(balance.formatted).toFixed(2) : '0.00';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
        className="flex items-center gap-3 pr-5 pl-1.5 py-1.5 !bg-black hover:!bg-[#121824] border border-[#B1FA41]/40 rounded-full transition-all text-left group shadow-[0_0_15px_rgba(177,250,65,0.05)]"
      >
        <div className="w-10 h-10 rounded-full bg-[#B1FA41] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(177,250,65,0.3)]">
          <Wallet className="w-4 h-4 text-black" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-mono font-black !text-white text-[14px] leading-tight mb-0.5 tracking-wide">
            {truncatedAddress}
          </span>
          <span className="font-semibold text-[11px] leading-tight">
            <span className="text-zinc-400">Nado: </span>
            <span className="!text-white font-bold">${balanceValue}</span>
          </span>
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#0a0a0c] border border-[#085a5a]/50 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/5">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Connected</div>
            <div className="font-mono font-bold text-white">{truncatedAddress}</div>
          </div>
          <div className="p-2">
            <button 
              onClick={() => { open(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-zinc-400" />
              Wallet Settings
            </button>
            <button 
              onClick={() => { disconnect(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2 mt-1"
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
