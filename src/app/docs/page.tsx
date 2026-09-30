'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Terminal, Code, Shield, Layers, ArrowUpRight, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import { ArchitectureOverview } from '../../components/ArchitectureOverview';

export default function DocsPage() {
  const sections = [
    {
      title: 'Execution & Settlement Pipeline',
      icon: <Layers className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'How orders travel from client-side fiat discovery to off-chain NADO matching and final settlement on the Ink Network rollup.',
      points: [
        'Local Fiat Oracle: Instant conversions for BRL, EUR, INR, NGN, and USD',
        'NADO Liquidity Engine: Intent-based batch auctions shielding orders from MEV',
        'Ink Network L2: Sub-second finality on Chain ID 763373 with EIP-712 security'
      ]
    },
    {
      title: 'Smart Contracts & Verification',
      icon: <Code className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'Transparent core smart contracts deployed on the Ink Network settlement layer.',
      points: [
        'Settlement Chain: Ink Network Mainnet (EVM L2)',
        'Chain ID: 763373',
        'Native Token: ETH (L2 Gas)',
        'Signer Standard: EIP-712 Typed Structured Data'
      ]
    },
    {
      title: 'MEV Mitigation & Slippage Model',
      icon: <Shield className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'Technical guarantees protecting traders from toxic order flow, front-running, and sandwich attacks.',
      points: [
        'Private RPC Gateway routing to avoid public mempool exposure',
        'Dynamic slippage minimization with solver price improvement',
        'Transparent 0% protocol fee schedule (pay only network gas & LP fees)'
      ]
    },
    {
      title: 'API & Developer Gateway',
      icon: <Terminal className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'High-throughput REST and WebSocket gateways for institutional and programmatic market makers.',
      points: [
        'REST Gateway: https://api.prod.nado.xyz/gateway/v1',
        'WebSocket v2: wss://api.prod.nado.xyz/gateway/ws/v2',
        'Sub-second order placement, cancellation, and position tracking'
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white min-h-[calc(100vh-80px)] font-sans">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 text-[#B1FA41] rounded-full px-4 py-1.5 text-xs font-bold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Technical Documentation
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          TradeNexa Protocol Architecture
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Comprehensive technical specifications, settlement mechanics on Ink Network, and NADO liquidity integration.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {sections.map((sec, idx) => (
          <div 
            key={idx}
            className="bg-[#0e1118] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#B1FA41]/30 transition-all group"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {sec.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#B1FA41] transition-colors">
                  {sec.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {sec.desc}
              </p>
              <ul className="space-y-2">
                {sec.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B1FA41] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Architecture Diagram Component */}
      <div className="border-t border-white/10 pt-10">
        <ArchitectureOverview />
      </div>

      {/* Quick Action CTA */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">Ready to start trading?</h4>
          <p className="text-xs text-zinc-400">Launch the decentralized terminal and trade perpetuals with local fiat pricing.</p>
        </div>
        <Link 
          href="/trade"
          className="flex items-center gap-2 bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] shrink-0"
        >
          Launch Terminal
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
