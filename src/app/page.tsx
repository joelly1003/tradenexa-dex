'use client';

import Link from 'next/link';
import { ArrowRight, Wallet, ArrowDownUp, TrendingUp, ShieldCheck, Banknote, LineChart, PieChart, Globe } from 'lucide-react';
import { useRegional } from '../components/providers/RegionalProvider';
import { useAccount } from 'wagmi';

export default function Home() {
  const { region, getSymbol } = useRegional();
  const symbol = getSymbol();
  const { isConnected } = useAccount();

  const regionalFeatures = {
    US: { methods: ['ACH Transfer', 'Credit Card', 'Apple Pay'], limits: '$10,000/day', name: 'the US' },
    EU: { methods: ['SEPA Transfer', 'Credit Card', 'Google Pay'], limits: '€10,000/day', name: 'the EU' },
    UK: { methods: ['Faster Payments', 'Credit Card'], limits: '£10,000/day', name: 'the UK' },
    NG: { methods: ['Bank Transfer', 'P2P Transfer', 'Mobile Money'], limits: '₦5,000,000/day', name: 'Nigeria' },
  }[region] || { methods: ['Credit Card'], limits: 'Varies', name: region };

  return (
    <div className="relative flex flex-col gap-10 max-w-7xl mx-auto py-4">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Section: Hero */}
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 min-h-[75vh]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Live on Mainnet
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Trade Crypto in Your <span className="text-blue-600 dark:text-blue-500">Local Currency</span>
        </h1>
        
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          Experience lightning-fast swaps and optimal routing—all priced natively in your preferred local fiat currency.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/trade" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 text-lg">
            Start Trading <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </div>



      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Link href="/trade" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ArrowDownUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            Trade Engine <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-zinc-500 leading-relaxed">Swap tokens instantly with localized pricing, optimal routing, and exact limits.</p>
        </Link>
        
        <Link href="/market" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <LineChart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            Market Data <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-zinc-500 leading-relaxed">Explore top gainers, trending assets, and in-depth TradingView charts.</p>
        </Link>
        
        <Link href="/portfolio" className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PieChart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            Portfolio <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </h2>
          <p className="text-zinc-500 leading-relaxed">Manage your assets, track PnL, and view your complete transaction history.</p>
        </Link>
      </div>

      {/* Why TradeNexa is Different Section */}
      <div className="pt-16 pb-8 border-t border-zinc-200 dark:border-zinc-800 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why TradeNexa is Different</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">Unlike generic global exchanges, we build native features specifically for your region so you never have to calculate exchange rates in your head again.</p>
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
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Local Payment Routes</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">We directly integrate the most popular regional payment methods so you can on-ramp and off-ramp effortlessly.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Regional Arbitrage</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Our advanced routing algorithm hunts for the best local liquidity pools to minimize slippage in your market.</p>
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
