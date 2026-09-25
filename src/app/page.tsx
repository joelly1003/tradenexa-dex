'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Zap, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAccount, useBlockNumber } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ watch: true });

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-80px)] bg-black overflow-hidden font-sans">
      
      {/* Decorative Neon Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#B1FA41]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-between text-center max-w-5xl mx-auto min-h-[calc(100vh-80px)] px-4 pt-16 pb-12">
        
        {/* Main Content Group */}
        <div className="flex flex-col items-center justify-center space-y-10 flex-1">
          {/* Mainnet Pill */}
          <div className="inline-flex items-center gap-2 bg-[#B1FA41]/5 border border-[#B1FA41]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#B1FA41] shadow-[0_0_15px_rgba(177,250,65,0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B1FA41] animate-pulse" />
            Live on Mainnet • Block {isLoading || isError ? '...' : blockNumber?.toString() || 'Loading'}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.25] text-white">
            Trade Crypto in Your <br />
            <span className="text-[#B1FA41]">Local Currency</span>
          </h1>
          
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Experience lightning-fast swaps and optimal routing—all priced natively in your preferred local fiat currency.
          </p>

          <Link 
            href="/trade" 
            className="group flex items-center justify-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black px-8 py-3.5 rounded-xl font-black text-lg transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] hover:shadow-[0_0_30px_rgba(177,250,65,0.4)] hover:-translate-y-0.5 w-64"
          >
            Start Trading
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bottom Features (pushed to down) */}
        <div className="flex items-center justify-center flex-wrap gap-8 text-sm font-bold text-white pt-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            0% Hidden Fees
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            Deep Liquidity
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B1FA41]" />
            MEV Protection
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 bg-[#08080a]">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Why TradeNexa is Different
          </h2>
          <p className="text-zinc-400 font-medium text-lg">
            Unlike generic global exchanges, we build native features specifically for your region so you never have to calculate exchange rates in your head again.
          </p>
          
          {/* Payment Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {['PIX', 'SEPA', 'UPI', 'M-PESA', 'TRANSAK', 'STRIPE'].map((pill) => (
              <div key={pill} className="bg-white/5 border border-white/10 text-zinc-300 font-bold text-sm px-5 py-2 rounded-xl uppercase tracking-wider">
                {pill}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Native Localization</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Every price, fee, and chart is instantly converted to your selected local fiat currency for intuitive trading.
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
                -0.2% Slippage
              </span>
            </div>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Our advanced routing algorithm hunts for the best local liquidity pools to minimize slippage in your market.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Wallet className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Local Payment Routes</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              We directly integrate the most popular regional payment methods so you can on-ramp and off-ramp effortlessly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#B1FA41]" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Compliance First</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              We automatically filter out restricted assets and enforce specific compliance rules for your jurisdiction.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
