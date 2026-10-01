import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trader Leaderboard & Volume Rankings | TradeNexa',
  description: 'Track top performing traders, volume milestones, and PnL rankings across TradeNexa.',
  alternates: {
    canonical: 'https://tradenexa.com/leaderboard',
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
