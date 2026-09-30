import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Building2, 
  FileText, 
  Lock,
  ArrowLeft 
} from 'lucide-react';

export default function TermsPage() {
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
          <Scale className="w-3.5 h-3.5" />
          Legal Framework
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          Terms of Service & Non-Custodial Protocol Agreement
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Last revised: September 30, 2026. Please read these terms carefully. By accessing the TradeNexa interface, you acknowledge and accept all provisions regarding non-custodial operations, third-party fiat gateways, and assumption of risk.
        </p>
      </div>

      {/* Main Body */}
      <div className="space-y-10 text-sm text-zinc-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <Lock className="w-5 h-5 text-[#B1FA41]" />
            <h2>1. Non-Custodial Protocol Interface Nature</h2>
          </div>
          <p>
            TradeNexa is a decentralized, non-custodial graphical user interface (&quot;Interface&quot;) that facilitates interaction with autonomous, open-source smart contracts deployed on the Ink Network (Chain ID: 57073) and off-chain orderbook solvers operated by NADO.
          </p>
          <p>
            At no point does TradeNexa, its developers, or its affiliates take custody, possession, control, or management of your private cryptographic keys, digital assets, or funds. All trades and orders are executed directly through your own self-custodial Web3 wallet via cryptographic signatures (EIP-712 / EIP-191).
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <Building2 className="w-5 h-5 text-[#B1FA41]" />
            <h2>2. Third-Party Fiat On/Off-Ramp Services</h2>
          </div>
          <div className="p-4 bg-[#B1FA41]/5 border border-[#B1FA41]/20 rounded-xl text-xs text-zinc-300">
            <strong>Mandatory Custodial Disclaimer:</strong> TradeNexa is not a bank, money services business (MSB), virtual asset service provider (VASP), or payment processor. We do not custody, transfer, or intermediate fiat currencies.
          </div>
          <p>
            All fiat on-ramp and off-ramp operations—including regional rails such as PIX (Brazil), SEPA (European Union), UPI (India), M-PESA (Kenya), and credit/debit card processing—are operated entirely and independently by licensed third-party providers (including Transak, Stripe, and MoonPay).
          </p>
          <p>
            When utilizing fiat services, you enter into a direct contractual relationship with the applicable provider. You are subject to their specific terms of service, AML/KYC procedures, fee structures, and dispute resolution processes. TradeNexa stores no banking details or payment credentials.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#B1FA41]" />
            <h2>3. Sanctioned Jurisdictions & Geofencing</h2>
          </div>
          <p>
            The Interface is strictly unavailable to persons or entities residing in, located in, or incorporated under the laws of sanctioned jurisdictions, including Cuba, Iran, North Korea, Syria, the Russian Federation, Belarus, Myanmar, and the Ukrainian territories of Crimea, Donetsk, and Luhansk, or any other jurisdiction subject to comprehensive United States (OFAC), European Union, or United Nations sanctions.
          </p>
          <p>
            You represent and warrant that you are not a Specially Designated National (&quot;SDN&quot;), on any denied persons list, or employing a virtual private network (&quot;VPN&quot;) or proxy mechanism to circumvent geographic restrictions.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2>4. Assumption of Risk & Absence of Fiduciary Duty</h2>
          </div>
          <p>
            Trading cryptographic assets, perpetual contracts, and derivatives carries a high degree of financial risk, including the possible total loss of principal. Leveraged trading carries the immediate risk of position liquidation when mark prices hit liquidation thresholds.
          </p>
          <p>
            TradeNexa owes no fiduciary duty, advisory duty, or duty of care to any user. Reference exchange rates, fiat currency conversions, and oracle benchmark prices displayed in the interface are purely informational estimates and do not constitute financial, investment, or legal advice.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 text-white font-bold text-lg border-b border-white/5 pb-3">
            <FileText className="w-5 h-5 text-[#B1FA41]" />
            <h2>5. Protocol Modifications & Smart Contract Upgrades</h2>
          </div>
          <p>
            Smart contract interactions on Ink Network are executed as programmed. TradeNexa does not have the administrative ability or authority to reverse, halt, or amend confirmed on-chain transactions or solver-matched order settlements.
          </p>
        </section>

      </div>

      {/* Footer Nav */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
        <div>&copy; {new Date().getFullYear()} TradeNexa Non-Custodial Interface.</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Notice</Link>
          <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">Technical Docs</Link>
          <Link href="/trade" className="text-[#B1FA41] hover:underline font-bold">Launch Trading Interface</Link>
        </div>
      </div>

    </div>
  );
}
