import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earn & Vaults | TradeNexa',
  alternates: {
    canonical: '/earn',
  },
};

export default function EarnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
