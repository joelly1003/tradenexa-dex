import { Activity, Twitter, Github, Send, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-12 text-sm text-zinc-500">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-xl font-black text-black dark:text-white tracking-tighter mb-4">
            <Activity className="w-5 h-5 text-blue-500" />
            TradeNexa
          </div>
          <p className="max-w-xs mb-6 leading-relaxed">
            TradeNexa is a globally localized decentralized exchange providing seamless cryptocurrency trading with deep liquidity, native fiat support, and region-specific optimizations.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Send className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Products</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="/trade" className="hover:text-blue-500 transition-colors">Spot Trading</a></li>
            <li><a href="/trade" className="hover:text-blue-500 transition-colors">Limit Orders</a></li>
            <li><a href="/market" className="hover:text-blue-500 transition-colors">Market Explorer</a></li>
            <li><a href="/portfolio" className="hover:text-blue-500 transition-colors">Portfolio Manager</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Support</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Regional Guides</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Fees & Slippage</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">Network</h4>
          <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20 font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            RPC & Aggregator: Operational
          </div>
          <ul className="space-y-3 font-medium">
            <li><a href="https://etherscan.io/" className="hover:text-blue-500 transition-colors">Verified Contracts ↗</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Bug Bounty</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} TradeNexa. All rights reserved.</p>
        <div className="flex items-center gap-6 font-medium">
          <a href="#" className="hover:text-black dark:hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-black dark:hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-black dark:hover:text-white">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
