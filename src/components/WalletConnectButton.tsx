'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect, useBalance, useSwitchChain, useEnsName } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { 
  Wallet, 
  Loader2, 
  Copy, 
  Check, 
  ExternalLink, 
  LogOut, 
  ChevronDown, 
  AlertTriangle,
  ArrowDownToLine,
  RefreshCw,
  User,
  CreditCard
} from 'lucide-react';
import { useCurrencyStore, formatFiat } from '../store/currencyStore';
import { useRampStore } from '../store/rampStore';

const emptySubscribe = () => () => {};

export function WalletConnectButton() {
  const router = useRouter();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Wagmi & AppKit hooks
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { open } = useAppKit();
  const { data: balance, refetch: refetchBalance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  // Store hooks
  const { fiat } = useCurrencyStore();
  const { openRamp } = useRampStore();

  // Local state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Copy address handler
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Refresh balance
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchBalance();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // 1. Render neat skeleton pill while mounting to prevent hydration mismatches
  if (!mounted) {
    return (
      <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-800" />
    );
  }

  // Connecting state
  if (isConnecting) {
    return (
      <button 
        disabled 
        className="h-10 px-5 flex items-center justify-center gap-2 bg-black border border-[#B1FA41]/30 text-zinc-400 rounded-xl font-bold text-xs"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B1FA41]" />
        <span>Connecting...</span>
      </button>
    );
  }

  // 2. Disconnected State: High-contrast action button triggering AppKit modal
  if (!isConnected || !address) {
    return (
      <button 
        onClick={() => open()}
        className="h-10 px-5 flex items-center justify-center gap-2 bg-[#B1FA41] hover:bg-[#a0e238] text-black rounded-xl font-black text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(177,250,65,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Wallet className="w-4 h-4 text-black" strokeWidth={2.5} />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Check network: Ink Mainnet Chain ID is 57073
  const isWrongNetwork = chainId !== undefined && chainId !== 57073;
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const displayLabel = ensName || truncatedAddress;

  // Calculate balances
  const ethBalanceNum = balance ? parseFloat(balance.formatted) : 0;
  const ethFormatted = ethBalanceNum.toFixed(4);
  const approxUsd = ethBalanceNum * 3100; // Benchmark approx ETH/USD
  const localFiatFormatted = formatFiat(approxUsd, fiat);

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      
      {/* Network indicator pill or Network Warning Switcher */}
      {isWrongNetwork ? (
        <button
          onClick={() => switchChain ? switchChain({ chainId: 57073 }) : open({ view: 'Networks' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Switch to</span> Ink Network
        </button>
      ) : (
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.8)] animate-pulse" />
          <span>Ink Network</span>
          <span className="text-[10px] text-zinc-500 font-mono">57073</span>
        </div>
      )}

      {/* Account Pill button */}
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black hover:bg-[#121824] border border-[#B1FA41]/40 rounded-xl transition-all text-left group shadow-[0_0_15px_rgba(177,250,65,0.06)] cursor-pointer"
        aria-expanded={dropdownOpen}
      >
        <div className="w-7 h-7 rounded-lg bg-[#B1FA41] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(177,250,65,0.3)]">
          <Wallet className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-white text-xs tracking-wide">
              {displayLabel}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-zinc-400 leading-tight">
            {ethFormatted} ETH <span className="text-[#B1FA41]">({localFiatFormatted})</span>
          </span>
        </div>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* 3. Account Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-[340px] bg-[#0c0e14] border border-white/10 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-white font-sans animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header & Wallet Address Row */}
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Connected Account</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA41]" />
                <span className="text-[11px] font-mono text-[#B1FA41]">Ink L2 (57073)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/60 border border-white/5 rounded-xl">
              <div className="font-mono text-xs text-white truncate max-w-[200px]" title={address}>
                {address}
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handleCopy}
                  title="Copy address"
                  className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#B1FA41]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`https://explorer.inkonchain.com/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Ink Explorer"
                  className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Balance Section */}
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Wallet Balance</span>
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-white">
                  ETH
                </div>
                <div>
                  <div className="text-sm font-mono font-bold text-white">{ethFormatted} ETH</div>
                  <div className="text-[11px] text-zinc-400">Native Gas & Margin</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-[#B1FA41]">{localFiatFormatted}</div>
                <div className="text-[10px] text-zinc-500 font-mono">≈ ${approxUsd.toFixed(2)} USD</div>
              </div>
            </div>

            {/* Quick Action: Buy Crypto via Fiat Rail */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                openRamp({ mode: 'buy' });
              }}
              className="w-full py-2.5 px-3 bg-[#B1FA41]/10 hover:bg-[#B1FA41]/20 border border-[#B1FA41]/30 text-[#B1FA41] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(177,250,65,0.1)]"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Buy / Deposit via Regional Rails (PIX, SEPA, UPI)</span>
            </button>
          </div>

          {/* Navigation & Asset Links */}
          <div className="p-2 space-y-1">
            <button 
              onClick={() => {
                setDropdownOpen(false);
                router.push('/assets');
              }} 
              className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ArrowDownToLine className="w-4 h-4 text-zinc-400" />
                <span>Deposit & Withdraw Assets</span>
              </div>
              <span className="text-[10px] text-zinc-500">Assets &rarr;</span>
            </button>

            <button 
              onClick={() => {
                setDropdownOpen(false);
                router.push('/profile');
              }} 
              className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Profile & Trade History</span>
              </div>
              <span className="text-[10px] text-zinc-500">Profile &rarr;</span>
            </button>

            {/* Disconnect Action */}
            <button 
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-colors cursor-pointer mt-1 border-t border-white/5"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
