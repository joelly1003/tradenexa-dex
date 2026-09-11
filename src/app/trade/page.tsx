import { TradeInterface } from '../../components/trading/TradeInterface';

export default function TradePage() {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      <div className="flex-1 max-w-xl">
        <TradeInterface />
      </div>
      <div className="flex-1 max-w-sm hidden lg:block">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 h-full">
          <h2 className="font-semibold mb-4 text-black dark:text-white">Recent Trades</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-green-500">
              <span>0.05 ETH</span>
              <span>171.00 USDC</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>0.12 ETH</span>
              <span>410.40 USDC</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>1.00 ETH</span>
              <span>3,420.00 USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
