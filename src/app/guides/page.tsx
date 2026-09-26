import { Globe2, MapPin } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Globe2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 text-black dark:text-white">Regional Guides</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">TradeNexa is built for a global audience. Find specialized tutorials for on-ramping and trading in your region.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { region: 'Europe (SEPA)', desc: 'How to on-ramp EUR and trade with zero fees.', flag: '🇪🇺' },
          { region: 'United Kingdom (FPS)', desc: 'Connecting your bank for instant GBP deposits.', flag: '🇬🇧' },
          { region: 'Brazil (PIX)', desc: 'Fast, secure BRL transfers directly to your wallet.', flag: '🇧🇷' },
          { region: 'Nigeria (P2P)', desc: 'Navigating NGN liquidity and safe P2P settlement.', flag: '🇳🇬' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-start gap-4 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm">
            <div className="text-4xl">{item.flag}</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-black dark:text-white group-hover:text-emerald-500 transition-colors">{item.region}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
