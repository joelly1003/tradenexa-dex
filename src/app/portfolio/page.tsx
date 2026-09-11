import { PortfolioSummary } from '../../components/portfolio/PortfolioSummary';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <PortfolioSummary />
      
      {/* Transaction History Stub */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="font-semibold mb-4 text-black dark:text-white">Recent Transactions</h2>
        <div className="text-center py-8 text-zinc-500">
          No recent transactions found.
        </div>
      </div>
    </div>
  );
}
