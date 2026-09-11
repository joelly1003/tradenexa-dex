'use client';

import Link from 'next/link';
import { ArrowRight, Wallet, ArrowDownUp, TrendingUp, ShieldCheck, Banknote, LineChart, PieChart, Globe, CheckCircle2, Zap, Activity } from 'lucide-react';
import { useRegional } from '../components/providers/RegionalProvider';
import { useAccount } from 'wagmi';

export default function Home() {
  const { region, getSymbol, currency } = useRegional();
  const symbol = getSymbol();
  const { isConnected } = useAccount();


  return (
    <div className="relative flex flex-col gap-10 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Section: Hero */}
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 min-h-[75vh]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Live on Mainnet
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Trade Crypto in Your <span className="text-blue-600 dark:text-blue-500">Local Currency</span>
        </h1>
        
        <p className="text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Experience lightning-fast swaps and optimal routing—all priced natively in your preferred local fiat currency ({currency}).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link href="/trade" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 text-lg">
            Start Trading <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> 0% Hidden Fees
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Deep Liquidity
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> MEV Protection
          </div>
        </div>
      </div>



      {/* Why TradeNexa is Different Section with Trust Badges */}
      <div className="pt-16 pb-8 border-t border-zinc-200 dark:border-zinc-800 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why TradeNexa is Different</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
            Unlike generic global exchanges, we build native features specifically for your region so you never have to calculate exchange rates in your head again.
          </p>
          
          {/* Trust Badges / Payment Rails */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {['PIX', 'SEPA', 'UPI', 'M-PESA', 'TRANSAK', 'STRIPE'].map((badge) => (
              <div key={badge} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-black tracking-widest text-zinc-500 dark:text-zinc-400">
                {badge}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Native Localization</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Every price, fee, and chart is instantly converted to your selected local fiat currency for intuitive trading.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              Smart Routing <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-0.2% Slippage</span>
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Our advanced routing algorithm hunts for the best local liquidity pools to minimize slippage in your market.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Local Payment Routes</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">We directly integrate the most popular regional payment methods so you can on-ramp and off-ramp effortlessly.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Compliance First</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">We automatically filter out restricted assets and enforce specific compliance rules for your jurisdiction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
