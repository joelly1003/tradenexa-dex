import { FileText, BookOpen, Code, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-white min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 text-black dark:text-white">Documentation</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Learn how to trade, provide liquidity, and build on top of the TradeNexa protocol.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Getting Started', desc: 'Connect your wallet, deposit funds, and make your first trade.', icon: <Terminal className="w-6 h-6" /> },
          { title: 'Smart Contracts', desc: 'Architecture, addresses, and ABIs for the TradeNexa protocol on Ink Chain.', icon: <Code className="w-6 h-6" /> },
          { title: 'API Reference', desc: 'REST and WebSocket endpoints for algorithmic trading and data fetching.', icon: <FileText className="w-6 h-6" /> },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group shadow-sm">
            <div className="text-blue-500 mb-6">{item.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-blue-500 transition-colors">{item.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
