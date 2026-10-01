import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets & Real-Time Price Discovery | TradeNexa',
  description: 'Real-time crypto asset market overviews, 24h volumes, and low-latency oracle price discovery on Ink Network.',
  alternates: {
    canonical: 'https://tradenexa.com/market',
  },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
