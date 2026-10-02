import React from 'react';
import { X, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

interface FiatRampModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
}

export function FiatRampModal({ isOpen, onClose, type }: FiatRampModalProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  if (!isOpen) return null;

  // Use Transak staging URL for demonstration, appending wallet address and Ink chain details
  const buildTransakUrl = () => {
    const baseUrl = 'https://global-stg.transak.com';
    const params = new URLSearchParams({
      apiKey: 'your-transak-api-key',
      environment: 'STAGING',
      network: 'ink',
      cryptoCurrencyList: 'ETH,USDC',
      defaultCryptoCurrency: 'USDC',
      walletAddress: address || '',
      fiatCurrency: 'USD',
      themeColor: 'B1FA41'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(177,250,65,0.1)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-2">
          <div className="w-12 h-12 bg-[#B1FA41]/10 rounded-2xl flex items-center justify-center text-[#B1FA41] mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            {type === 'buy' ? 'Buy Crypto' : 'Sell Crypto'}
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            {type === 'buy' 
              ? 'Fund your Ink L2 wallet directly with credit card, debit card, or bank transfer.'
              : 'Withdraw your Ink L2 assets directly to your fiat bank account.'}
          </p>

          {!isConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center mb-6">
              <p className="text-sm text-amber-200 mb-3">
                Please connect your wallet first to proceed with the fiat gateway.
              </p>
              <button 
                onClick={() => {
                  onClose();
                  open();
                }}
                className="w-full bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(177,250,65,0.2)]"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                Receiving Wallet
              </div>
              <div className="font-mono text-sm text-white break-all">
                {address}
              </div>
            </div>
          )}

        </div>

        {isConnected && (
          <div className="px-6 pb-6 space-y-3">
            <a 
              href={buildTransakUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#B1FA41] hover:bg-[#a0e238] text-black font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(177,250,65,0.2)] flex items-center justify-center gap-2"
            >
              Continue to Transak <ExternalLink className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-2 justify-center text-[10px] text-zinc-500">
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
              Regulated third-party fiat gateway. Non-custodial.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
