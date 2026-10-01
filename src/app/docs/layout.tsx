import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Documentation & Verified Contracts | TradeNexa',
  description: 'Protocol architecture specifications, verified smart contract registry on Ink Network (57073), and EIP-712 intent guides.',
  alternates: {
    canonical: 'https://tradenexa.com/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
