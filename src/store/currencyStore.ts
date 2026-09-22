import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'BRL' | 'INR' | 'KES' | 'NGN' | 'ZAR';

interface CurrencyState {
  fiat: FiatCurrency;
  setFiat: (fiat: FiatCurrency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      fiat: 'USD',
      setFiat: (fiat) => set({ fiat }),
    }),
    { name: 'tradenexa-currency' }
  )
);

// Fallback static rates based on recent approx values.
// In production, these should be dynamically fetched.
export const FIAT_RATES: Record<FiatCurrency, { rate: number; symbol: string; locale: string }> = {
  USD: { rate: 1, symbol: '$', locale: 'en-US' },
  EUR: { rate: 0.92, symbol: '€', locale: 'de-DE' },
  GBP: { rate: 0.79, symbol: '£', locale: 'en-GB' },
  BRL: { rate: 5.0, symbol: 'R$', locale: 'pt-BR' },
  INR: { rate: 83.3, symbol: '₹', locale: 'en-IN' },
  KES: { rate: 130.5, symbol: 'KSh', locale: 'en-KE' },
  NGN: { rate: 1550.0, symbol: '₦', locale: 'en-NG' },
  ZAR: { rate: 18.5, symbol: 'R', locale: 'en-ZA' }
};

export function formatFiat(usdAmount: number | string, fiat: FiatCurrency, decimals: number = 2): string {
  const amount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  if (isNaN(amount)) return '0.00';
  
  const config = FIAT_RATES[fiat] || FIAT_RATES.USD;
  const converted = amount * config.rate;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: fiat,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(converted);
}
