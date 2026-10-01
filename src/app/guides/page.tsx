import { Globe2, MapPin } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Globe2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 text-black dark:text-white">Protocol Guides & Onboarding</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Master institutional-speed trading, non-custodial workflows, and licensed fiat gateways on Ink Network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { title: 'Non-Custodial Wallet Setup', desc: 'Connect and verify your self-custody wallet for direct Ink L2 settlement.', icon: '🔐' },
          { title: 'Licensed Fiat Gateways', desc: 'Fund your wallet with cards or bank transfers via regulated third-party on-ramps.', icon: '💳' },
          { title: 'NADO Solver Orderbook', desc: 'Leverage intent-based routing and batch auctions with zero MEV slippage.', icon: '⚡' },
          { title: 'L2 Finality & Risk Management', desc: 'Deterministic block settlement, cross/isolated margin modes, and mark price feeds.', icon: '🛡️' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-start gap-4 hover:border-[#B1FA41] transition-all cursor-pointer group shadow-sm">
            <div className="text-4xl">{item.icon}</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-black dark:text-white group-hover:text-[#B1FA41] transition-colors">{item.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
