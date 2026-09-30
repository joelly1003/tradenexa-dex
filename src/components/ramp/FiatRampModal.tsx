'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Wallet, 
  CheckCircle2 
} from 'lucide-react';
import { useRampStore } from '../../store/rampStore';

interface RailOption {
  id: string;
  name: string;
  region: string;
  currency: string;
  flag: string;
  speed: string;
  providers: ('Transak' | 'Stripe' | 'MoonPay')[];
  minAmount: number;
  maxAmount: number;
  symbol: string;
  rateToUsd: number; // approximate for preview
}

const REGIONAL_RAILS: RailOption[] = [
  {
    id: 'PIX',
    name: 'PIX Instant Transfer',
    region: 'Brazil (BRL)',
    currency: 'BRL',
    flag: '🇧🇷',
    speed: '< 2 mins',
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
    providers: ['Transak'],
    minAmount: 1500,
    maxAmount: 150000,
    symbol: 'KSh',
    rateToUsd: 0.0077,
  },
  {
    id: 'STRIPE',
    name: 'Card & Apple Pay (Stripe)',
    region: 'Global / US (USD)',
    currency: 'USD',
    flag: '🇺🇸',
    speed: 'Instant',
    providers: ['Stripe', 'Transak'],
    minAmount: 25,
    maxAmount: 10000,
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
    providers: ['Transak', 'MoonPay'],
    minAmount: 20,
    maxAmount: 10000,
    symbol: '£',
    rateToUsd: 1.28,
  },
];

export function FiatRampModal() {
  const { isOpen, initialFiat, initialRail, initialMode, closeRamp } = useRampStore();
  const { address, isConnected } = useAccount();
  const { open: openWalletModal } = useAppKit();

  const [userMode, setUserMode] = useState<'buy' | 'sell' | null>(null);
  const [userRailId, setUserRailId] = useState<string | null>(null);
  const [fiatAmount, setFiatAmount] = useState<string>('200');
  const [cryptoAsset, setCryptoAsset] = useState<'USDC' | 'ETH'>('USDC');
  const [userProvider, setUserProvider] = useState<'Transak' | 'Stripe' | 'MoonPay' | null>(null);

  const mode = userMode ?? initialMode ?? 'buy';

  const defaultRail = 
    REGIONAL_RAILS.find(r => r.id.toLowerCase() === (initialRail || '').toLowerCase()) ||
    REGIONAL_RAILS.find(r => r.currency.toLowerCase() === (initialFiat || '').toLowerCase()) ||
    REGIONAL_RAILS[1];

  const activeRail = userRailId 
    ? (REGIONAL_RAILS.find(r => r.id === userRailId) || defaultRail)
    : defaultRail;

  const selectedProvider = userProvider && activeRail.providers.includes(userProvider)
    ? userProvider
    : activeRail.providers[0];

  const handleClose = () => {
    setUserMode(null);
    setUserRailId(null);
    setUserProvider(null);
    closeRamp();
  };

  if (!isOpen) return null;

  // Calculate estimated crypto output
  const numericFiat = parseFloat(fiatAmount) || 0;
  const usdValue = numericFiat * activeRail.rateToUsd;
  const estimatedCrypto = cryptoAsset === 'USDC' 
    ? (usdValue * 0.99).toFixed(2)
    : (usdValue / 3100).toFixed(4);

  const handleLaunchGateway = () => {
    if (!address) {
      openWalletModal();
      return;
    }

    const network = 'ink';
    let targetUrl = '';

    if (selectedProvider === 'Transak') {
      const baseUrl = 'https://global.transak.com/';
      const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || 'demo-partner-key',
        walletAddress: address,
        fiatCurrency: activeRail.currency,
        fiatAmount: fiatAmount,
        cryptoCurrency: cryptoAsset,
        network: network,
        themeColor: 'B1FA41',
        productsAvailed: mode === 'buy' ? 'BUY' : 'SELL',
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    } else if (selectedProvider === 'Stripe') {
      const baseUrl = 'https://crypto.stripe.com/onramp';
      const params = new URLSearchParams({
        destination_wallet_address: address,
        destination_currency: cryptoAsset.toLowerCase(),
        source_currency: activeRail.currency.toLowerCase(),
        source_amount: fiatAmount,
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    } else {
      const baseUrl = 'https://buy.moonpay.com/';
      const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY || 'pk_test_demo',
        walletAddress: address,
        currencyCode: cryptoAsset.toLowerCase(),
        baseCurrencyCode: activeRail.currency.toLowerCase(),
        baseCurrencyAmount: fiatAmount,
      });
      targetUrl = `${baseUrl}?${params.toString()}`;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer,width=500,height=700');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0c0e14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B1FA41]/10 border border-[#B1FA41]/20 flex items-center justify-center text-[#B1FA41]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Licensed Fiat Gateway
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B1FA41]/15 text-[#B1FA41] border border-[#B1FA41]/30">
                  Non-Custodial
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Direct on/off-ramp settled straight to your Web3 wallet</p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Mode Tabs: Buy vs Sell */}
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setUserMode('buy')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'buy' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Buy Crypto (On-Ramp)
            </button>
            <button
              onClick={() => setUserMode('sell')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'sell' ? 'bg-[#B1FA41] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sell Crypto (Off-Ramp)
            </button>
          </div>

          {/* Regional Payment Rails Selection */}
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
              Select Regional Payment Rail
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONAL_RAILS.map((rail) => {
                const isSelected = rail.id === activeRail.id;
                return (
                  <button
                    key={rail.id}
                    onClick={() => {
                      setUserRailId(rail.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
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
                      <div className="font-bold text-xs">{rail.id}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{rail.region}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount and Currency Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fiat Input */}
            <div className="bg-[#121824] border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>You {mode === 'buy' ? 'Pay' : 'Receive'}</span>
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
                <span>You {mode === 'buy' ? 'Receive (Est.)' : 'Deliver'}</span>
                <span className="text-[#B1FA41]">Ink Network L2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-[#B1FA41]">
                  ~{estimatedCrypto}
                </span>
                <div className="flex gap-1">
                  {(['USDC', 'ETH'] as const).map((coin) => (
                    <button
                      key={coin}
                      onClick={() => setCryptoAsset(coin)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        cryptoAsset === coin 
                          ? 'bg-[#B1FA41] text-black' 
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

          {/* Provider Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Licensed Provider Routing
              </label>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B1FA41]" /> Regulated VASP / MSB
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {activeRail.providers.map((p) => {
                const isSelected = selectedProvider === p;
                return (
                  <button
                    key={p}
                    onClick={() => setUserProvider(p)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#B1FA41]/10 border-[#B1FA41] text-white font-bold shadow-sm'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <div className="text-xs">{p}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {p === 'Transak' ? 'Direct Rail Match' : p === 'Stripe' ? 'US / Global Gateway' : 'Global Debit'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Settlement Target */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                <Wallet className="w-4 h-4 text-[#B1FA41]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Receiving Wallet Address</div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'No wallet connected'}
                </div>
              </div>
            </div>

            {!isConnected ? (
              <button
                onClick={() => openWalletModal()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#B1FA41] font-bold">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </div>
            )}
          </div>

          {/* Strict Custodial Boundary & Regulatory Disclaimer */}
          <div className="bg-[#B1FA41]/5 border border-[#B1FA41]/15 rounded-2xl p-4 text-xs text-zinc-400 space-y-2">
            <div className="flex items-start gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#B1FA41] shrink-0 mt-0.5" />
              <span>Independent Custody & Third-Party Licensing Disclosure</span>
            </div>
            <p className="leading-relaxed text-[11px] text-zinc-400">
              Fiat on/off-ramp services are powered by licensed, independent third-party providers (e.g., Transak, Stripe, MoonPay). TradeNexa is a non-custodial protocol interface and never custodies fiat currency or user bank credentials. Crypto purchases are transferred directly between your payment method and your personal Web3 wallet.
            </p>
          </div>

        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
          <button
            onClick={handleClose}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleLaunchGateway}
            className="flex-1 py-3 px-6 rounded-xl bg-[#B1FA41] hover:bg-[#9de036] text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)]"
          >
            {!isConnected ? (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet to Continue
              </>
            ) : (
              <>
                Proceed with {selectedProvider}
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
