import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trade | TradeNexa',
  alternates: {
    canonical: '/trade',
  },
};

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
