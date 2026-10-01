'use client';

import Link from 'next/link';
import { ShieldCheck, Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black px-6 py-10 text-sm text-zinc-500 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Row: Brand & Main Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-1.5">
            <Link href="/" className="flex flex-col items-start justify-center gap-0 whitespace-nowrap shrink-0 group">
              <div className="text-xl md:text-2xl font-black tracking-tight text-white flex items-baseline leading-none">
                Trade<span className="text-[#B1FA41]">Nexa</span>
              </div>
              <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-zinc-400 mt-1 uppercase">
                POWERED BY NADO
              </div>
            </Link>
            <p className="text-zinc-400 text-xs">
              Powered by NADO Liquidity Engine • Settled on Ink Network (Chain ID: 57073).
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center gap-6 font-medium text-xs">
            <Link href="/trade" className="text-zinc-400 hover:text-white transition-colors">
              Pro Trade
            </Link>
            <Link href="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
              Privacy Notice
            </Link>
          </nav>

        </div>

        {/* Middle Row: Legal & Non-Custodial Disclosures */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-zinc-500 leading-relaxed">
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B1FA41]" />
              Non-Custodial Protocol & Risk Disclaimer
            </div>
            <p>
              TradeNexa is a decentralized, non-custodial software interface that routes cryptographic orders to independent off-chain solvers and smart contracts deployed on the Ink Network. TradeNexa never holds, custodies, or controls user digital assets or private keys. Trading perpetual contracts and digital assets involves significant financial risk and may result in the complete loss of invested capital.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-[#B1FA41]" />
              Third-Party Fiat Gateway Notice
            </div>
            <p>
              Fiat on/off-ramp gateways (cards, bank wires, third-party transfers) are facilitated solely by independent, licensed third-party providers. TradeNexa is a non-custodial software interface and never holds, custodies, or processes fiat currency.
            </p>
          </div>
        </div>

        {/* Bottom Row: Copyright & Status */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} TradeNexa Non-Custodial Interface. All rights reserved.
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA41]" />
                Settlement: Ink Mainnet (57073) • Matching: NADO Engine • Audited Settlement Contracts
              </span>
            </div>
            <Link 
              href="https://explorer.inkonchain.com/address/0x3bB11C18bC6a22D77fD6cE87A4F8b40E600021b3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-zinc-500 hover:text-[#B1FA41] transition-colors font-mono underline underline-offset-2"
            >
              View Settlement Router Contract
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
