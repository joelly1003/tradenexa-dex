'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Terminal, 
  Code, 
  Shield, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode,
  Lock,
  Bug
} from 'lucide-react';
import { ArchitectureOverview } from '../../components/ArchitectureOverview';
import { INK_VERIFIED_CONTRACTS, ContractDeployment } from '../../config/contracts.config';

export default function DocsPage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const sections = [
    {
      title: 'Execution & Settlement Pipeline',
      icon: <Layers className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'How orders travel from client-side fiat discovery to off-chain NADO matching and final settlement on the Ink Network rollup.',
      points: [
        'Decentralized Oracle Feeds: Institutional-grade real-time index feeds',
        'NADO Liquidity Engine: Intent-based batch auctions shielding orders from MEV',
        'Ink Network L2: Sub-second finality on Chain ID 57073 with EIP-712 security'
      ]
    },
    {
      title: 'Smart Contracts & Verification',
      icon: <Code className="w-5 h-5 text-[#B1FA41]" />,
      desc: 'Transparent core smart contracts deployed on the Ink Network settlement layer.',
      points: [
        'Settlement Chain: Ink Network Mainnet (EVM L2)',
        'Chain ID: 57073',
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
          Comprehensive technical specifications, smart contract deployments on Ink Network (57073), and EIP-712 intent settlement.
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
      <div className="border-t border-white/10 pt-10 mb-16">
        <ArchitectureOverview />
      </div>

      {/* Verified Ink Contract Registry */}
      <div className="border-t border-white/10 pt-12 mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded-full px-3 py-1 text-xs font-bold text-[#B1FA41] mb-2">
              <Code className="w-3.5 h-3.5" />
              Ink Mainnet (57073)
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Verified Smart Contract Deployments
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              All contracts are deployed on the Ink Network rollup, source-code verified, and non-custodial by design.
            </p>
          </div>

          <a 
            href="https://explorer.inkonchain.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-[#B1FA41] hover:underline"
          >
            <span>Ink Block Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Contract Cards Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INK_VERIFIED_CONTRACTS.map((contract: ContractDeployment) => (
            <div 
              key={contract.address}
              className="bg-[#0e1118] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{contract.name}</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-[#B1FA41]/10 border border-[#B1FA41]/30 text-[#B1FA41] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Source Code
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  {contract.role}
                </p>

                {/* Copyable Address Box */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs text-zinc-300 truncate">
                    {contract.address}
                  </span>
                  <button
                    onClick={() => handleCopy(contract.address)}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer"
                    title="Copy Contract Address"
                  >
                    {copiedAddress === contract.address ? (
                      <>
                        <Check className="w-3 h-3 text-[#B1FA41]" />
                        <span className="text-[#B1FA41]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ABI Interface Preview */}
                <div className="mb-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">
                    Core External Interface
                  </span>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 space-y-1">
                    {contract.abiSummary.map((fn, fIdx) => (
                      <div key={fIdx} className="text-[11px] font-mono text-zinc-400 truncate">
                        • {fn}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <a
                  href={contract.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B1FA41] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>View on Ink Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {contract.githubUrl && (
                  <a
                    href={contract.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <FileCode className="w-3 h-3" />
                    <span>View Solidity Source</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Architecture: EIP-712 Specification */}
      <div className="border-t border-white/10 pt-12 mb-16">
        <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded-full px-3 py-1 text-xs font-bold text-[#B1FA41] mb-3">
          <Lock className="w-3.5 h-3.5" />
          Cryptographic Signer Standard
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
          EIP-712 Off-Chain Intent Specification
        </h2>
        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed mb-6">
          TradeNexa executes trades without custodial custody by relying on EIP-712 typed structured data signatures. 
          Orders are signed gaslessly in the browser and dispatched to NADO batch auction solvers for execution.
        </p>

        <div className="bg-[#0e1118] border border-white/10 rounded-2xl p-6 font-mono text-xs overflow-x-auto">
          <div className="text-[#B1FA41] mb-2 font-bold">// EIP-712 Order Struct (Chain ID: 57073)</div>
          <pre className="text-zinc-300">
{`struct Order {
    address sender;       // User Web3 account / subaccount address
    uint256 priceX18;     // Fixed-point order price scaled by 10^18
    int256  amount;       // Signed order size (positive = Long/Buy, negative = Short/Sell)
    uint64  expiration;   // Unix timestamp after which intent becomes unfillable
    uint64  nonce;        // Unique timestamp-derived salt preventing replay attacks
    uint256 appendix;     // Bitflags encoding post-only, reduce-only, and margin modes
}`}
          </pre>
        </div>
      </div>

      {/* Security Disclosure & Bug Bounty Banner */}
      <div className="border-t border-white/10 pt-12 mb-12">
        <div className="bg-gradient-to-r from-white/[0.03] to-[#B1FA41]/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 text-[#B1FA41] rounded-full px-3 py-1 text-xs font-bold mb-3">
              <Bug className="w-3.5 h-3.5" />
              Responsible Security Disclosure
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Bug Bounty & Vulnerability Reporting
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We operate an active protocol bug bounty program for vulnerabilities discovered across our smart contracts and solver APIs. Reports are evaluated under responsible disclosure guidelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/bounty"
              className="bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
            >
              Bug Bounty Program
            </Link>
            <a
              href="mailto:security@tradenexa.com"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/10 transition-all"
            >
              security@tradenexa.com
            </a>
          </div>
        </div>
      </div>

      {/* Quick Action CTA */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">Ready to start trading?</h4>
          <p className="text-xs text-zinc-400">Launch the decentralized terminal and trade perpetuals with sub-second mark pricing.</p>
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
