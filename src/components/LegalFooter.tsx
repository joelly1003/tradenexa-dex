'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, ExternalLink, AlertTriangle } from 'lucide-react';

export function LegalFooter() {
  return (
    <div className="w-full border-t border-white/5 bg-[#080a0f] py-6 px-4 sm:px-8 text-xs text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Disclaimers info */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-[#B1FA41]/10 flex items-center justify-center text-[#B1FA41] shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <p className="text-[11px] text-zinc-400">
            Non-custodial protocol interface. All fiat rails operated independently by licensed third-party providers.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[11px] font-medium">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Notice
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Protocol Architecture
          </Link>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 font-mono text-[10px]">
            Ink L2 (763373)
          </span>
        </div>

      </div>
    </div>
  );
}
