'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, Code, Send, MessageSquare } from 'lucide-react';
import { useBlockNumber } from 'wagmi';
import { useEffect, useState } from 'react';

function NetworkStatus() {
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ watch: true });
  const [status, setStatus] = useState<'checking' | 'operational' | 'degraded'>('checking');

  useEffect(() => {
    if (blockNumber) {
      setStatus('operational');
    } else if (isError) {
      setStatus('degraded');
    }
  }, [blockNumber, isError]);

  if (status === 'checking' || isLoading) {
    return (
      <div className="flex items-center gap-2 mb-4 p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium w-fit">
        <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></span>
        RPC: Checking...
      </div>
    );
  }

  if (status === 'degraded') {
    return (
      <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-500/20 font-medium w-fit">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        RPC: Degraded
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20 font-medium w-fit">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      RPC: Operational ({Number(blockNumber)})
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-12 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
        <div className="col-span-2">
          <div className="mb-4">
            <Image src="/logo.png" alt="TradeNexa" width={280} height={80} className="h-20 w-auto object-contain" />
          </div>
          <p className="max-w-xs mb-6 leading-relaxed">
            TradeNexa is a globally localized decentralized exchange providing seamless cryptocurrency trading with deep liquidity, native fiat support, and region-specific optimizations.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://tradenexa.com" target="_blank" rel="noopener noreferrer" aria-label="TradeNexa Website" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="https://t.me/tradenexa" target="_blank" rel="noopener noreferrer" aria-label="TradeNexa Telegram" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Send className="w-5 h-5" /></a>
            <a href="https://discord.gg/tradenexa" target="_blank" rel="noopener noreferrer" aria-label="TradeNexa Discord" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></a>
            <a href="https://github.com/joelly1003/tradenexa-dex" target="_blank" rel="noopener noreferrer" aria-label="TradeNexa GitHub" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Code className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Products</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/trade" className="hover:text-blue-500 transition-colors">Spot Trading</Link></li>
            <li><Link href="/trade?tab=limit" className="hover:text-blue-500 transition-colors">Limit Orders</Link></li>
            <li><Link href="/market" className="hover:text-blue-500 transition-colors">Market Explorer</Link></li>
            <li><Link href="/portfolio" className="hover:text-blue-500 transition-colors">Portfolio Manager</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Support</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/docs" className="hover:text-blue-500 transition-colors">Documentation</Link></li>
            <li><Link href="/guides" className="hover:text-blue-500 transition-colors">Regional Guides</Link></li>
            <li><Link href="/fees" className="hover:text-blue-500 transition-colors">Fees & Slippage</Link></li>
            <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Network</h4>
          <NetworkStatus />
          <ul className="space-y-3 font-medium">
            <li><a href="https://explorer.inkonchain.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Verified Contracts ↗</a></li>
            <li><Link href="/bounty" className="hover:text-blue-500 transition-colors">Bug Bounty</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} TradeNexa. All rights reserved.</p>
        <div className="flex items-center gap-6 font-medium">
          <Link href="/terms" className="hover:text-black dark:hover:text-white">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-black dark:hover:text-white">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-black dark:hover:text-white">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  );
}
