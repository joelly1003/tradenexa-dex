import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets & Local Currency Quotations | TradeNexa',
  description: 'Real-time crypto asset market overviews and 24h volumes priced natively in regional fiat currencies.',
  alternates: {
    canonical: 'https://tradenexa.com/market',
  },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
