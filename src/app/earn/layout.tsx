import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earn & Lending Vaults | TradeNexa',
  description: 'Stake collateral and supply liquidity to earn protocol yields on Ink Network.',
  alternates: {
    canonical: 'https://tradenexa.com/earn',
  },
};

export default function EarnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
