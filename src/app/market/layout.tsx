import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Overview | TradeNexa',
  alternates: {
    canonical: '/market',
  },
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
