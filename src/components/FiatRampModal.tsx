'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { isAddress } from 'viem';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Wallet, 
  CheckCircle2,
  Clock,
  Percent,
  AlertCircle
} from 'lucide-react';
import { useRampStore } from '../store/rampStore';

export interface RailOption {
  id: string;
  name: string;
  region: string;
  currency: string;
  flag: string;
  speed: string;
  feeEstimate: string;
  providers: ('Transak' | 'Stripe' | 'MoonPay')[];
  minAmount: number;
  maxAmount: number;
  symbol: string;
  rateToUsd: number;
}

export const REGIONAL_RAILS: RailOption[] = [
  {
    id: 'PIX',
    name: 'PIX Instant Transfer',
    region: 'Brazil (BRL)',
    currency: 'BRL',
    flag: '🇧🇷',
    speed: '< 2 mins',
    feeEstimate: '0.99% - 1.5%',
    providers: ['Transak', 'MoonPay'],
    minAmount: 50,
    maxAmount: 25000,
    symbol: 'R$',
    rateToUsd: 0.20,
  },
  {
    id: 'SEPA',
    name: 'SEPA / SEPA Instant',
    region: 'European Union (EUR)',
    currency: 'EUR',
    flag: '🇪🇺',
    speed: 'Instant / 1 hr',
    feeEstimate: '0.99% - 1.2%',
    providers: ['Transak', 'Stripe', 'MoonPay'],
    minAmount: 20,
    maxAmount: 15000,
    symbol: '€',
    rateToUsd: 1.08,
  },
  {
    id: 'UPI',
    name: 'UPI / IMPS Payments',
    region: 'India (INR)',
    currency: 'INR',
    flag: '🇮🇳',
    speed: '< 5 mins',
    feeEstimate: '1.2% - 1.8%',
    providers: ['Transak'],
    minAmount: 1000,
    maxAmount: 100000,
    symbol: '₹',
    rateToUsd: 0.012,
  },
  {
    id: 'M-PESA',
    name: 'M-PESA Mobile Money',
    region: 'Kenya (KES)',
    currency: 'KES',
    flag: '🇰🇪',
    speed: '< 5 mins',
    feeEstimate: '1.5% - 2.0%',
    providers: ['Transak'],
    minAmount: 1500,
    maxAmount: 150000,
    symbol: 'KSh',
    rateToUsd: 0.0077,
  },
  {
    id: 'STRIPE',
    name: 'Debit, Credit & Apple Pay',
    region: 'Global / US (USD)',
    currency: 'USD',
    flag: '🇺🇸',
    speed: 'Instant',
    feeEstimate: '1.5% - 2.5%',
    providers: ['Stripe', 'Transak'],
    minAmount: 25,
    maxAmount: 10000,
    symbol: '$',
    rateToUsd: 1.0,
  },
  {
    id: 'TRANSAK',
    name: 'Direct Local Bank Rail',
    region: 'Global Multi-Rail',
    currency: 'USD',
    flag: '🌐',
    speed: '< 5 mins',
    feeEstimate: '0.99% - 1.5%',
    providers: ['Transak', 'MoonPay'],
    minAmount: 25,
    maxAmount: 15000,
    symbol: '$',
    rateToUsd: 1.0,
  },
  {
    id: 'UK-FP',
    name: 'Faster Payments (UK)',
    region: 'United Kingdom (GBP)',
    currency: 'GBP',
    flag: '🇬🇧',
    speed: '< 5 mins',
    feeEstimate: '0.99% - 1.2%',
    providers: ['Transak', 'MoonPay'],
    minAmount: 20,
    maxAmount: 10000,
    symbol: '£',
    rateToUsd: 1.28,
  },
];

export interface ProviderMeta {
  name: 'Transak' | 'Stripe' | 'MoonPay';
  badge: string;
  settlement: string;
  fees: string;
  description: string;
}

export const PROVIDERS_META: Record<'Transak' | 'Stripe' | 'MoonPay', ProviderMeta> = {
  Transak: {
    name: 'Transak',
    badge: 'Direct Local Rails',
    settlement: '< 2 - 5 mins',
    fees: '0.99% - 1.5%',
    description: 'Specialized in PIX, SEPA, UPI, and M-PESA native bank transfers.',
  },
  Stripe: {
    name: 'Stripe',
    badge: 'US & Global FinTech',
    settlement: 'Instant',
    fees: '1.5% - 2.5%',
    description: 'Fast debit card, credit card, and Apple Pay checkout.',
  },
  MoonPay: {
    name: 'MoonPay',
    badge: 'Global Debit & Wire',
    settlement: '< 5 mins',
    fees: '1.5% - 3.0%',
    description: 'Worldwide card and bank transfer support across 160+ countries.',
  },
};

export interface FiatRampModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialRail?: string;
}

function FiatRampModalContent({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  initialRail: propsInitialRail,
}: FiatRampModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL search parameter integration: ?action=buy&rail=pix
  const urlAction = searchParams?.get('action') || searchParams?.get('ramp');
  const urlRail = searchParams?.get('rail');

  // Zustand store integration
  const store = useRampStore();

  // Determine open state: props take precedence, followed by store, then URL params
  const isUrlOpen = urlAction === 'buy' || urlAction === 'sell' || urlAction === 'true';
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : (store.isOpen || isUrlOpen);

  // Wagmi & AppKit
  const { address, isConnected } = useAccount();
  const { open: openWalletModal } = useAppKit();

  const [overrideMode, setOverrideMode] = useState<'buy' | 'sell' | null>(null);
  const [userRailId, setUserRailId] = useState<string | null>(null);
  const [fiatAmount, setFiatAmount] = useState<string>('250');
  const [cryptoAsset, setCryptoAsset] = useState<'ETH' | 'USDC'>('ETH');
  const [userProvider, setUserProvider] = useState<'Transak' | 'Stripe' | 'MoonPay' | null>(null);
  const [customWallet, setCustomWallet] = useState<string>('');
  const [walletError, setWalletError] = useState<string | null>(null);

  // Derived mode: user interaction override -> store -> url search param -> default 'buy'
  const userMode = overrideMode ?? store.initialMode ?? (urlAction === 'sell' ? 'sell' : 'buy');

  // Derived active rail: user selection -> props -> url search param -> store -> default 'SEPA'
  const effectiveRailId = userRailId || propsInitialRail || urlRail || store.initialRail || 'SEPA';
  const activeRail = useMemo(() => {
    return (
      REGIONAL_RAILS.find((r) => r.id.toLowerCase() === effectiveRailId.toLowerCase()) ||
      REGIONAL_RAILS[1]
    );
  }, [effectiveRailId]);

  // Derived selected provider: ensure chosen provider is supported by current rail
  const selectedProvider = (userProvider && activeRail.providers.includes(userProvider))
    ? userProvider
    : activeRail.providers[0];

  // Destination wallet logic: auto-fill connected wallet or custom input
  const destinationAddress = address || customWallet.trim();

  // Handle closing modal
  const handleClose = () => {
    setOverrideMode(null);
    setUserRailId(null);
    setUserProvider(null);

    if (propsOnClose) {
      propsOnClose();
    }
    store.closeRamp();

    // Clean up URL search params if opened via URL
    if (urlAction || urlRail) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('action');
      params.delete('ramp');
      params.delete('rail');
      const newQuery = params.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false });
    }
  };

  if (!isOpen) return null;

  // Output estimation
  const numericFiat = parseFloat(fiatAmount) || 0;
  const usdValue = numericFiat * activeRail.rateToUsd;
  const ethBenchmarkPrice = 3100;
  const estimatedCrypto = cryptoAsset === 'ETH'
    ? (usdValue / ethBenchmarkPrice).toFixed(4)
    : (usdValue * 0.99).toFixed(2);

  // Launch gateway
  const handleLaunchGateway = () => {
    setWalletError(null);

    if (!destinationAddress) {
      setWalletError('Please connect a Web3 wallet or enter an EVM recipient address.');
      return;
    }

    if (!isAddress(destinationAddress)) {
      setWalletError('Invalid EVM destination address format (must start with 0x).');
      return;
    }

    const network = 'ink';
    let targetUrl = '';

    if (selectedProvider === 'Transak') {
      const baseUrl = 'https://global.transak.com/';
      const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || 'demo-partner-key',
        walletAddress: destinationAddress,
        fiatCurrency: activeRail.currency,
        fiatAmount: fiatAmount,
        cryptoCurrency: cryptoAsset,
        network: network,
        themeColor: 'B1FA41',
        productsAvailed: userMode === 'buy' ? 'BUY' : 'SELL',
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    } else if (selectedProvider === 'Stripe') {
      const baseUrl = 'https://crypto.stripe.com/onramp';
      const params = new URLSearchParams({
        destination_wallet_address: destinationAddress,
        destination_currency: cryptoAsset.toLowerCase(),
        source_currency: activeRail.currency.toLowerCase(),
        source_amount: fiatAmount,
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    } else {
      const baseUrl = 'https://buy.moonpay.com/';
      const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY || 'pk_test_demo',
        walletAddress: destinationAddress,
        currencyCode: cryptoAsset.toLowerCase(),
        baseCurrencyCode: activeRail.currency.toLowerCase(),
        baseCurrencyAmount: fiatAmount,
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer,width=520,height=750');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0c0e14] border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title, Regional Currency Badge, Close */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B1FA41]/10 border border-[#B1FA41]/20 flex items-center justify-center text-[#B1FA41] shadow-[0_0_15px_rgba(177,250,65,0.15)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {activeRail.name}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B1FA41]/15 text-[#B1FA41] border border-[#B1FA41]/30">
                  {activeRail.id} / {activeRail.currency}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Licensed non-custodial fiat on/off-ramp • Settled on Ink L2
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Mode Selector: Buy vs Sell */}
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setOverrideMode('buy')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                userMode === 'buy' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Buy Crypto (On-Ramp)
            </button>
            <button
              onClick={() => setOverrideMode('sell')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                userMode === 'sell' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sell Crypto (Off-Ramp)
            </button>
          </div>

          {/* Regional Payment Rails Selection */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Select Regional Rail
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {REGIONAL_RAILS.length} Regional Rails Supported
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONAL_RAILS.map((rail) => {
                const isSelected = rail.id === activeRail.id;
                return (
                  <button
                    key={rail.id}
                    onClick={() => setUserRailId(rail.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#B1FA41]/10 border-[#B1FA41] text-white shadow-[0_0_15px_rgba(177,250,65,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{rail.flag}</span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">
                        {rail.speed}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{rail.id}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{rail.currency}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{rail.region}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount & Settlement Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fiat Input */}
            <div className="bg-[#121824] border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>You {userMode === 'buy' ? 'Pay' : 'Receive'}</span>
                <span>Limits: {activeRail.symbol}{activeRail.minAmount} - {activeRail.symbol}{activeRail.maxAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  className="bg-transparent text-xl font-mono font-bold text-white outline-none w-3/5"
                  placeholder="0.00"
                />
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white">
                  <span>{activeRail.currency}</span>
                  <span className="text-zinc-400 font-normal">({activeRail.symbol})</span>
                </div>
              </div>
            </div>

            {/* Crypto Output */}
            <div className="bg-[#121824] border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>You {userMode === 'buy' ? 'Receive (Est.)' : 'Deliver'}</span>
                <span className="text-[#B1FA41] font-mono text-[11px]">Ink L2 (763373)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-[#B1FA41]">
                  ~{estimatedCrypto}
                </span>
                <div className="flex gap-1">
                  {(['ETH', 'USDC'] as const).map((coin) => (
                    <button
                      key={coin}
                      onClick={() => setCryptoAsset(coin)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        cryptoAsset === coin 
                          ? 'bg-[#B1FA41] text-black shadow-sm' 
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Provider Selector with Fee and Settlement Estimates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Licensed Gateway Providers
              </label>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B1FA41]" /> Regulated FinTech & VASP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeRail.providers.map((p) => {
                const meta = PROVIDERS_META[p];
                const isSelected = selectedProvider === p;
                return (
                  <button
                    key={p}
                    onClick={() => setUserProvider(p)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#B1FA41]/10 border-[#B1FA41] text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{meta.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#B1FA41]" />}
                      </div>
                      <div className="text-[10px] text-zinc-400 mb-2">{meta.badge}</div>
                    </div>
                    
                    <div className="space-y-1 text-[10px] border-t border-white/5 pt-1.5">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Percent className="w-2.5 h-2.5 text-[#B1FA41]" />
                        <span>Fee: {meta.fees}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-2.5 h-2.5 text-zinc-500" />
                        <span>{meta.settlement}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destination Wallet Pre-fill or Input */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                  <Wallet className="w-4 h-4 text-[#B1FA41]" />
                </div>
                <div className="text-xs font-bold text-white">Destination Wallet (Ink L2)</div>
              </div>

              {isConnected ? (
                <div className="flex items-center gap-1 text-xs text-[#B1FA41] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Wallet Connected</span>
                </div>
              ) : (
                <button
                  onClick={() => openWalletModal()}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Connect Wallet
                </button>
              )}
            </div>

            {isConnected && address ? (
              <div className="p-2.5 bg-black/60 border border-white/5 rounded-xl flex items-center justify-between">
                <span className="font-mono text-xs text-white truncate">{address}</span>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0 pl-2">Auto-filled</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Enter recipient EVM address (0x...) or connect wallet"
                  value={customWallet}
                  onChange={(e) => {
                    setCustomWallet(e.target.value);
                    if (walletError) setWalletError(null);
                  }}
                  className="w-full bg-[#121824] border border-white/10 focus:border-[#B1FA41] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 outline-none"
                />
                <p className="text-[10px] text-zinc-500">
                  Crypto will be delivered directly to this self-custodial address on the Ink Network.
                </p>
              </div>
            )}

            {walletError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{walletError}</span>
              </div>
            )}
          </div>

          {/* Non-Custodial Disclosure Banner */}
          <div className="bg-[#B1FA41]/5 border border-[#B1FA41]/20 rounded-2xl p-4 text-xs text-zinc-400 space-y-2">
            <div className="flex items-start gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#B1FA41] shrink-0 mt-0.5" />
              <span>Non-Custodial Disclosure & Licensing Notice</span>
            </div>
            <p className="leading-relaxed text-[11px] text-zinc-300">
              You will complete this purchase through our licensed partner. TradeNexa never handles or stores your payment details or fiat balance.
            </p>
            <p className="leading-relaxed text-[10px] text-zinc-500">
              Fiat transactions are executed by {selectedProvider} under applicable FinCEN, FCA, or EU VASP authorizations. Assets are delivered directly to your destination Web3 address.
            </p>
          </div>

        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
          <button
            onClick={handleClose}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleLaunchGateway}
            className="flex-1 py-3 px-6 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] cursor-pointer"
          >
            <span>Proceed to Gateway ({selectedProvider})</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export function FiatRampModal(props: FiatRampModalProps) {
  return (
    <Suspense fallback={null}>
      <FiatRampModalContent {...props} />
    </Suspense>
  );
}
