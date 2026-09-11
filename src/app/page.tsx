'use client';

import Link from 'next/link';
import { ArrowRight, Wallet, ArrowDownUp, TrendingUp, ShieldCheck, Banknote, LineChart, PieChart, Globe, CheckCircle2, Zap, Activity } from 'lucide-react';
import { useRegional } from '../components/providers/RegionalProvider';
import { useAccount } from 'wagmi';
import { TradeInterface } from '../components/trading/TradeInterface';
import { useEffect, useState } from 'react';

export default function Home() {
  const { region, getSymbol, currency } = useRegional();
  const symbol = getSymbol();
  const { isConnected } = useAccount();

  // Mock live ticker data
  const [ticker, setTicker] = useState([
    { pair: 'BTC/USD', price: '64,230.00', change: '+2.4%' },
    { pair: 'ETH/USD', price: '3,450.20', change: '+1.8%' },
    { pair: 'SOL/USD', price: '145.80', change: '-0.5%' },
  ]);

  useEffect(() => {
    // Simulate live ticker updates
    const interval = setInterval(() => {
      setTicker(prev => prev.map(t => ({
        ...t,
        price: (parseFloat(t.price.replace(/,/g, '')) * (1 + (Math.random() * 0.002 - 0.001))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col gap-10 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Top Section: Hero (2-Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[75vh] py-12">
        <div className="flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Live on Mainnet
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Trade Crypto in Your <span className="text-blue-600 dark:text-blue-500">Local Currency</span>
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            Experience lightning-fast swaps and optimal routing—all priced natively in your preferred local fiat currency ({currency}).
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
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

        {/* Right Column: Swap Widget */}
        <div className="w-full max-w-md mx-auto lg:ml-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
            <div className="relative">
              <TradeInterface />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Live Ticker Section */}
      <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Trending Markets
          </h2>
          <Link href="/market" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ticker.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="font-bold">{item.pair}</div>
              <div className="text-right">
                <div className="font-mono font-semibold">{symbol}{item.price}</div>
                <div className={`text-xs font-bold ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change}
                </div>
              </div>
            </div>
          ))}
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
