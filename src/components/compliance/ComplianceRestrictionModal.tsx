'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  X, 
  Lock,
  Globe2
} from 'lucide-react';
import { RestrictionType } from '../../hooks/useComplianceCheck';

interface ComplianceRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  restrictionType: RestrictionType;
  details: string | null;
  countryName?: string;
}

export function ComplianceRestrictionModal({
  isOpen,
  onClose,
  restrictionType,
  details,
  countryName,
}: ComplianceRestrictionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0c0e14] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-red-500/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {restrictionType === 'SANCTIONED_ADDRESS' 
                  ? 'Sanctioned Address Detected' 
                  : 'Jurisdiction Access Notice'}
              </h2>
              <p className="text-xs text-red-300/80 mt-0.5 font-medium">
                Regulatory & Trade Compliance Policy
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-zinc-300">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              {restrictionType === 'SANCTIONED_ADDRESS' ? (
                <>
                  <Lock className="w-4 h-4 text-red-400" />
                  OFAC SDN List Match
                </>
              ) : (
                <>
                  <Globe2 className="w-4 h-4 text-amber-400" />
                  Geographic Restriction ({countryName || 'Restricted Region'})
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 font-mono">
              {details || 'Your connection or wallet address matches restricted criteria under applicable international sanctions regulations.'}
            </p>
          </div>

          <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              TradeNexa enforces strict compliance with United States Office of Foreign Assets Control (OFAC), European Union, and international anti-money laundering (AML) frameworks.
            </p>
            <p>
              Smart contract trading and solver order placement have been disabled for this session to safeguard protocol integrity and regulatory compliance.
            </p>
          </div>

          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>
              If you believe this restriction has been triggered in error (e.g., VPN routing or misidentified IP), please disconnect and reconnect with your standard provider.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
          <Link
            href="/terms"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View Compliance Terms
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
