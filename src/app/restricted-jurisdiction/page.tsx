'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Globe, FileText, ArrowLeft, Lock } from 'lucide-react';

export default function RestrictedJurisdictionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-[#0B0E14] text-white px-4 py-16 text-center font-sans">
      <div className="max-w-xl w-full bg-[#0e121a] border border-red-500/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-6">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold font-mono">
            <Lock className="w-3.5 h-3.5" />
            Regulatory Geofencing Notice
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Restricted Jurisdiction
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
            Access to trade execution and order routing is unavailable from your geographic region in accordance with international sanctions and export control regulations.
          </p>
        </div>

        {/* Compliance Details Card */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3 text-xs text-zinc-300 leading-relaxed font-mono">
          <div className="flex items-center gap-2 text-[#B1FA41] font-bold text-xs uppercase tracking-wider font-sans">
            <Globe className="w-4 h-4" />
            Compliance & Enforcement Policy
          </div>
          <p className="text-zinc-400">
            TradeNexa implements automated edge geofencing in compliance with United States Office of Foreign Assets Control (OFAC), European Union, and international Anti-Money Laundering (AML) standards.
          </p>
          <p className="text-zinc-400">
            Trading interfaces and transaction submission are restricted for IP addresses resolving to comprehensively sanctioned jurisdictions (including Cuba, Iran, North Korea, Syria, Russia, Belarus, Myanmar, and embargoed regions).
          </p>
        </div>

        {/* Informational Transparency Notice */}
        <p className="text-[11px] text-zinc-500">
          Non-transactional pages including protocol documentation, Terms of Service, and technical guides remain accessible globally for transparency.
        </p>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/terms"
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <FileText className="w-4 h-4 text-[#B1FA41]" />
            Terms of Service
          </Link>
          
          <Link
            href="/docs"
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            Technical Docs
          </Link>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
