'use client';

import Link from 'next/link';
import { ArrowRight, Wallet, ArrowDownUp, TrendingUp, ShieldCheck, Banknote, LineChart, PieChart, Globe, CheckCircle2, Zap, Activity } from 'lucide-react';
import { useRegional } from '../components/providers/RegionalProvider';
import { useAccount, useBlockNumber } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

export default function Home() {
  const { region, getSymbol, currency } = useRegional();
  const symbol = getSymbol();
  const { isConnected } = useAccount();
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ watch: true });
  const { open } = useAppKit();

  return (
    <div className="relative flex flex-col gap-10 max-w-7xl mx-auto py-4 px-4 sm:px-6 overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] pointer-events-none -z-10 flex justify-center opacity-60 dark:opacity-40">
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      {/* Top Section: Hero */}
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 min-h-[75vh]">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
          isError 
            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' 
            : isLoading 
              ? 'bg-zinc-50 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></span>
          {isError ? 'Network Offline' : isLoading ? 'Checking Network...' : `Live on Mainnet • Block ${Number(blockNumber)}`}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
          Trade Crypto in Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            Local Currency
          </span>
        </h1>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          Experience lightning-fast swaps and optimal routing—all priced natively in your preferred local fiat currency.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link href="/trade" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] hover:-translate-y-1 text-lg">
            Start Trading <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
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
          <div className="flex flex-wrap justify-center gap-4 mb-12 transition-all duration-500">
            {['PIX', 'SEPA', 'UPI', 'M-PESA', 'TRANSAK', 'STRIPE'].map((badge) => (
              <button 
                key={badge} 
                onClick={() => open()}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-sm font-black tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shadow-sm active:scale-95"
              >
                {badge}
              </button>
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
