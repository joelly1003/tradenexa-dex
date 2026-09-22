'use client';

import { useAccount, useBalance } from 'wagmi';
import { useRegional } from '../providers/RegionalProvider';

export function PortfolioSummary() {
  const { getSymbol } = useRegional();
  const symbol = getSymbol();
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const formattedBalance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.00';
  const tokenSymbol = balanceData?.symbol || 'ETH';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-zinc-500 mb-1">Wallet Balance</h2>
          <div className="text-4xl font-bold">{symbol}{formattedBalance}</div>
          <div className="text-green-500 font-medium mt-2">+ {symbol}0.00 (0.0%) 24h</div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">Deposit</button>
          <button className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg font-medium">Withdraw</button>
        </div>
      </div>

      <h3 className="font-semibold mb-4 text-black dark:text-white">Your Assets</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold">
              {tokenSymbol[0]}
            </div>
            <div>
              <div className="font-semibold text-lg">{tokenSymbol}</div>
              <div className="text-sm text-zinc-500">Ink Chain Asset</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">{symbol}{formattedBalance}</div>
            <div className="text-sm text-zinc-500">{formattedBalance} {tokenSymbol}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
