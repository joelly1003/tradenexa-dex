import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  Building2, 
  ArrowLeft 
} from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-white font-sans min-h-[calc(100vh-80px)]">
      
      {/* Back Link */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#B1FA41] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 bg-[#B1FA41]/10 border border-[#B1FA41]/20 rounded-full px-3 py-1 text-xs font-bold text-[#B1FA41] mb-4">
          <EyeOff className="w-3.5 h-3.5" />
          Data Governance
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          Privacy Notice & Non-Custodial Data Policy
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Last revised: September 30, 2026. TradeNexa is designed with privacy-first principles. We do not harvest, monetize, or store personal identity data, bank credentials, or user browsing activity.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10 text-sm text-zinc-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <Lock className="w-5 h-5 text-[#B1FA41]" />
            <h2>1. Zero Personal Data Collection (Non-Custodial Guarantee)</h2>
          </div>
          <p>
            TradeNexa does not require user accounts, email addresses, passwords, phone numbers, or national identification documents to access or interact with the decentralized interface.
          </p>
          <p>
            We do not sell, rent, license, or monetize any user data to advertisers, data brokers, or commercial marketing partners.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <Database className="w-5 h-5 text-[#B1FA41]" />
            <h2>2. Public Blockchain Records & Wallet Addresses</h2>
          </div>
          <p>
            When connecting your self-custodial Web3 wallet, your public EVM address is read by your client-side browser to populate your account balance, position details, and trade history directly from the Ink Network blockchain (Chain ID: 763373) and the NADO orderbook API.
          </p>
          <p>
            Please note that all blockchain transactions, smart contract approvals, deposits, and transfers are inherently public, permanent, and visible on public blockchain explorers (e.g., Inkscan).
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <Building2 className="w-5 h-5 text-[#B1FA41]" />
            <h2>3. Third-Party Fiat Gateway KYC/AML Handling</h2>
          </div>
          <p>
            When accessing fiat on-ramp or off-ramp services (such as Transak, Stripe Crypto Onramp, or MoonPay), all regulatory Know-Your-Customer (KYC) and Anti-Money Laundering (AML) identity verifications are performed directly and solely by those regulated third-party entities.
          </p>
          <p>
            TradeNexa never receives, stores, or processes your government ID, biometric selfie, bank account details, or payment card numbers. Any personal information submitted during checkout is governed by the respective provider&apos;s privacy policy:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
            <li><strong>Transak:</strong> Regulated by UK FCA & FinCEN (US); processes data in compliance with GDPR.</li>
            <li><strong>Stripe:</strong> PCI-DSS Level 1 compliant financial infrastructure.</li>
            <li><strong>MoonPay:</strong> Registered Money Services Business (MSB).</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#B1FA41]" />
            <h2>4. Client-Side Local Storage & Preferences</h2>
          </div>
          <p>
            The Interface utilizes standard browser local storage (`localStorage`) solely to preserve client-side user experience settings, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
            <li>Selected fiat display currency (e.g., EUR, BRL, USD, INR)</li>
            <li>Trading slippage preference (e.g., Auto 0.5% or custom)</li>
            <li>Theme and visual chart settings</li>
          </ul>
          <p>
            No cookies are used for tracking, profiling, or cross-site user identification.
          </p>
        </section>

      </div>

      {/* Footer Nav */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
        <div>&copy; {new Date().getFullYear()} TradeNexa Non-Custodial Interface.</div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">Technical Docs</Link>
          <Link href="/trade" className="text-[#B1FA41] hover:underline font-bold">Launch Trading Interface</Link>
        </div>
      </div>

    </div>
  );
}
