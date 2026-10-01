'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Zap, Wallet, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { ArchitectureOverview } from '../components/ArchitectureOverview';

export default function Home() {

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-80px)] bg-black overflow-hidden font-sans">
      
      {/* Decorative Neon Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#B1FA41]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-between text-center max-w-5xl mx-auto min-h-[calc(100vh-80px)] px-4 pt-16 pb-12">
        
        {/* Main Content Group */}
        <div className="flex flex-col items-center justify-center space-y-10 flex-1">
          <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.25] text-white">
            Trade Crypto with <br />
            <span className="text-[#B1FA41]">Sub-Second Precision</span>
          </h1>
          
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Experience institutional-speed swaps and solver-optimized orderbook liquidity—powered by NADO and settled with deterministic finality on Ink Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/trade" 
              className="group flex items-center justify-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black px-8 py-3.5 rounded-xl font-black text-lg transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] hover:shadow-[0_0_30px_rgba(177,250,65,0.4)] hover:-translate-y-0.5 w-60"
            >
              Start Trading
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="flex items-center justify-center flex-wrap gap-8 text-sm font-bold text-white pt-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            Transparent 0% Protocol Fee
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            Deep NADO Liquidity
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            MEV-Shielded Execution
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 bg-black">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Why TradeNexa is Different
          </h2>
          <p className="text-zinc-400 font-medium text-lg">
            Unlike legacy perpetual exchanges, we build high-performance infrastructure specifically designed for decentralized execution, zero spread markups, and true non-custodial custody.
          </p>
          

        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Real-Time Precision</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Transparent mark prices, millisecond index updates, and dynamic PnL tracking evaluated with zero hidden spreads.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-black text-white">Smart Routing</h3>
              <span className="bg-[#B1FA41]/10 text-[#B1FA41] border border-[#B1FA41]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Solver Optimized
              </span>
            </div>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Dynamic slippage minimization and price improvement via NADO&apos;s liquidity engine and solver execution.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Direct Non-Custodial Gateways</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Seamless integration with licensed third-party on-ramps for instant, non-custodial deposits and withdrawals directly to your Ink L2 address.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Multi-Layer Compliance & Sanctions Screening</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Automated edge geofencing, real-time oracle address screening, and solver-level verification safeguard protocol integrity.
            </p>
          </div>

        </div>
      </div>

      {/* Architecture Overview Section */}
      <ArchitectureOverview />
    </div>
  );
}
