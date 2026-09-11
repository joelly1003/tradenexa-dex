'use client';

import { useRegional } from '../providers/RegionalProvider';

export function PortfolioSummary() {
  const { getSymbol } = useRegional();
  const symbol = getSymbol();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-zinc-500 mb-1">Total Portfolio Value</h2>
          <div className="text-4xl font-bold">{symbol}12,450.00</div>
          <div className="text-green-500 font-medium mt-2">+ {symbol}340.50 (2.8%) 24h</div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">Deposit</button>
          <button className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg font-medium">Withdraw</button>
        </div>
      </div>

      <h3 className="font-semibold mb-4 text-black dark:text-white">Your Assets</h3>
      <div className="space-y-4">
        {[
          { token: 'ETH', name: 'Ethereum', balance: '2.45', value: '8,379.00', allocation: '67%' },
          { token: 'USDC', name: 'USD Coin', balance: '3,150.00', value: '3,150.00', allocation: '25%' },
          { token: 'UNI', name: 'Uniswap', balance: '124.00', value: '921.00', allocation: '8%' },
        ].map(asset => (
          <div key={asset.token} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold">
                {asset.token[0]}
              </div>
              <div>
                <div className="font-semibold text-lg">{asset.token}</div>
                <div className="text-sm text-zinc-500">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-lg">{symbol}{asset.value}</div>
              <div className="text-sm text-zinc-500">{asset.balance} {asset.token}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
