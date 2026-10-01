import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trade Perpetuals & Spot | TradeNexa',
  description: 'Trade institutional crypto perpetuals with deep NADO liquidity and sub-second settlement on Ink Network.',
  alternates: {
    canonical: 'https://tradenexa.com/trade',
  },
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
