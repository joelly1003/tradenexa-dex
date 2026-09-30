'use client';

import React from 'react';
import { Layers, Cpu, Shield, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export function ArchitectureOverview() {
  const steps = [
    {
      step: '01',
      title: 'Local Price Discovery & Oracle',
      subtitle: 'Client-Side Real-Time Conversion',
      desc: 'All trading pairs, collateral amounts, and PnL are evaluated natively against regional fiat currency feeds for seamless local pricing without mental FX conversion.',
      badge: 'Zero Latency Oracle',
      icon: <Cpu className="w-5 h-5 text-[#B1FA41]" />
    },
    {
      step: '02',
      title: 'NADO Liquidity & Solver Routing',
      subtitle: 'Off-Chain High-Speed Matching',
      desc: 'Orders are matched via NADO’s low-latency liquidity engine using intent-based batch auctions. Private RPC submission shields every order against MEV front-running and sandwich attacks.',
      badge: 'MEV-Shielded Execution',
      icon: <Zap className="w-5 h-5 text-[#B1FA41]" />
    },
    {
      step: '03',
      title: 'Ink Network Settlement',
      subtitle: 'On-Chain Verifiable Finality',
      desc: 'Matched trades and position states settle deterministically on the Ink Network (Chain ID: 57073) with sub-second L2 finality, minimal gas overhead, and cryptographic EIP-712 security.',
      badge: 'Ink L2 Settlement',
      icon: <Shield className="w-5 h-5 text-[#B1FA41]" />
    }
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-16 text-white font-sans">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#B1FA41] mb-4">
          <Layers className="w-3.5 h-3.5" />
          Protocol Architecture
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
          Powered by NADO Engine • Settled on Ink Network
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          TradeNexa combines institutional off-chain matching performance with transparent, trustless on-chain settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item, index) => (
          <div 
            key={item.step}
            className="bg-[#0e1118] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-[#B1FA41]/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-black text-zinc-500 group-hover:text-[#B1FA41] transition-colors">
                  PHASE {item.step}
                </span>
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <h4 className="text-xs font-semibold text-[#B1FA41] mb-3">{item.subtitle}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1 text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B1FA41]" />
                Verified Protocol Path
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Transparency Guarantee Callout */}
      <div className="mt-8 bg-gradient-to-r from-[#B1FA41]/5 via-[#121824] to-[#B1FA41]/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-white mb-1">
            Transparent Execution Guarantee
          </span>
          <span className="text-xs text-zinc-400">
            0% TradeNexa protocol markup fee • Pay only network L2 gas and LP taker fee • Zero hidden spreads.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-[#B1FA41] bg-[#B1FA41]/10 border border-[#B1FA41]/20 px-3 py-1.5 rounded-lg font-bold">
            Ink Chain ID: 57073
          </span>
        </div>
      </div>
    </section>
  );
}
