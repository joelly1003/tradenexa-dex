'use client';

import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useState, useEffect, useRef } from 'react';
import { LogOut, Wallet, Loader2, Copy, ExternalLink, Activity, User, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';

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
        className="h-12 px-6 flex items-center justify-center gap-2 bg-black text-white hover:bg-[#121824] rounded-full font-black text-sm transition-all active:scale-95"
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
            <span className="text-zinc-500">Nado: </span>
            <span className="!text-white font-bold">${balanceValue}</span>
          </span>
        </div>
      </button>

      
            {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-[#050506] border border-white/5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-white font-sans">
          
          {/* Top Section */}
          <div className="p-4 pb-4 border-b border-white/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[13px] font-black text-zinc-400 tracking-wider">ACCOUNT ASSETS</span>
              <button className="flex items-center gap-1.5 text-[13px] font-bold text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)]"></div>
                  <span className="text-[14px] font-semibold text-white">Nado DEX Collateral</span>
                </div>
                <span className="text-[14px] font-bold text-[#B1FA41]">$0.00 USDC</span>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)] mt-1"></div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">MetaMask Wallet</span>
                    <span className="text-[11px] text-[#b096e9] font-bold mt-1.5 bg-[#b096e9]/10 px-2.5 py-0.5 rounded-full w-fit">Ink Gas Reserve</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[14px] font-bold text-white">$0.00 USDC</span>
                  <span className="text-xs font-mono font-medium text-zinc-400 mt-1">0.0000 ETH</span>
                </div>
              </div>
            </div>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full mt-5 py-3 bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-[14px] rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.3)] cursor-pointer">
              Manage & Deposit Assets &rarr;
            </button>
          </div>

          {/* Bottom Section */}
          <div className="p-2 flex flex-col gap-1.5 bg-[#050506]">
            
            <button onClick={() => { navigator.clipboard.writeText('0x20BA6f38012c8883D013a3e561f34D11E7E85e0f'); alert('Address copied!'); }} className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <Copy className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[14px] font-bold text-white">Copy address</span>
            </button>
            
            <button onClick={() => { window.open('https://explorer.inkonchain.com/address/0x20BA6f38012c8883D013a3e561f34D11E7E85e0f', '_blank'); }} className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ExternalLink className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[14px] font-bold text-white">View explorer</span>
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-default">
              <div className="w-[18px] h-[18px] rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)] ml-[1px]"></div>
              <span className="text-[14px] font-bold text-white ml-[1px]">Nado Network</span>
            </button>

            <button onClick={() => { window.location.href = '/profile'; }} className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <User className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[14px] font-bold text-white">My Profile & History</span>
            </button>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ArrowDownToLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[14px] font-bold text-white">Deposit</span>
            </button>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full flex items-center gap-4 px-4 py-3 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ArrowUpFromLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[14px] font-bold text-white">Withdraw</span>
            </button>

            <button 
              onClick={() => { disconnect(); setDropdownOpen(false); }}
              className="w-full flex items-center gap-4 px-4 py-3 bg-[#12141a] hover:bg-[#1a1c24] rounded-[16px] transition-colors group cursor-pointer mt-1"
            >
              <LogOut className="w-[18px] h-[18px] text-red-500" strokeWidth={2} />
              <span className="text-[14px] font-bold text-red-500">Disconnect</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}