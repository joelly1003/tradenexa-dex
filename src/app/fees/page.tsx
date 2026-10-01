import React from 'react';
import { Layers, ShieldCheck, Zap, Server } from 'lucide-react';

export default function FeesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20 min-h-[calc(100vh-80px)] font-sans">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Protocol Fees & Execution Cost</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          TradeNexa operates on a strict <strong className="text-[#B1FA41]">0% Protocol Markup</strong> model. 
          We are a non-custodial interface routing your EIP-712 intents directly to the NADO solver network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* TradeNexa Protocol Fee */}
        <div className="bg-[#121824] border border-[#B1FA41]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(177,250,65,0.05)]">
          <div className="w-10 h-10 bg-[#B1FA41]/10 rounded-xl flex items-center justify-center text-[#B1FA41] mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">TradeNexa Fee</h3>
          <div className="text-3xl font-black text-[#B1FA41] mb-2 font-mono">0.00%</div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Zero basis points added. We do not skim, markup, or charge a frontend fee for routing your trades.
          </p>
        </div>

        {/* NADO Taker/Maker Fee */}
        <div className="bg-[#121824] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">NADO Solver Fee</h3>
          <div className="text-3xl font-black text-white mb-2 font-mono">Dynamic</div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Taker/Maker fees pass directly to NADO LPs and solvers based on current protocol liquidity schedules.
          </p>
        </div>

        {/* Ink Network L2 Gas */}
        <div className="bg-[#121824] border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold mb-1">Ink L2 Gas</h3>
          <div className="text-3xl font-black text-white mb-2 font-mono">ETH</div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Standard calldata and L2 execution cost paid in native ETH to the Ink Network (Chain ID: 57073).
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#B1FA41]" />
          MEV-Shielded Execution Pipeline
        </h2>
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <p>
            TradeNexa utilizes an intent-based architecture where execution happens through off-chain batch auctions before being deterministically settled on-chain.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Private RPC Intents:</strong> Orders bypass the public mempool. Signed EIP-712 intents are routed directly to NADO solver nodes.
            </li>
            <li>
              <strong className="text-white">Zero Front-Running:</strong> Because intents are matched off-chain by competitive solvers, transactions cannot be front-run, back-run, or sandwich-attacked by public searchers.
            </li>
            <li>
              <strong className="text-white">Verifiable On-Chain Settlement:</strong> Batched state updates are committed to the Ink Network L2, providing Ethereum-secured finality via OP Stack fraud proofs.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
