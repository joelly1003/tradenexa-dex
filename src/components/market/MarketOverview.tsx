'use client';

import { useRegional } from '../providers/RegionalProvider';

export function MarketOverview() {
  const { getSymbol } = useRegional();
  const symbol = getSymbol();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Market Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-zinc-500 text-sm mb-1">Global Volume (24h)</div>
          <div className="text-xl font-bold">{symbol}1.2B</div>
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-zinc-500 text-sm mb-1">Total Value Locked</div>
          <div className="text-xl font-bold">{symbol}4.5B</div>
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-zinc-500 text-sm mb-1">Top Gainer</div>
          <div className="text-xl font-bold text-green-500">ETH +4.2%</div>
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-zinc-500 text-sm mb-1">Top Loser</div>
          <div className="text-xl font-bold text-red-500">SOL -1.8%</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-3 text-zinc-500">Trending Assets</h3>
        <div className="space-y-2">
          {[
            { name: 'Bitcoin', ticker: 'BTC', price: '64,230', change: '+2.4%' },
            { name: 'Ethereum', ticker: 'ETH', price: '3,420', change: '+4.2%' },
            { name: 'LocalToken', ticker: 'LCL', price: '1.20', change: '+12.5%' },
          ].map(asset => (
            <div key={asset.ticker} className="flex justify-between items-center p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs">{asset.ticker[0]}</div>
                <div>
                  <div className="font-semibold">{asset.ticker}</div>
                  <div className="text-xs text-zinc-500">{asset.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{symbol}{asset.price}</div>
                <div className="text-xs text-green-500">{asset.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
