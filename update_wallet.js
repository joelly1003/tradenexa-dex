const fs = require('fs');

let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// Update imports
content = content.replace(
  /import \{ LogOut, Wallet, Loader2 \} from 'lucide-react';/,
  "import { LogOut, Wallet, Loader2, Copy, ExternalLink, Activity, User, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';"
);

// Define the new dropdown UI
const newDropdown = `
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-[340px] bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-white font-sans ring-1 ring-white/5">
          <div className="p-5 pb-4 border-b border-white/5">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[12px] font-black text-zinc-400 tracking-wider">ACCOUNT ASSETS</span>
              <button className="flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)]"></div>
                  <span className="text-[15px] font-semibold text-zinc-200">Nado DEX Collateral</span>
                </div>
                <span className="text-[15px] font-bold text-[#B1FA41]">$0.00 USDC</span>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-zinc-200">MetaMask Wallet</span>
                    <span className="text-[11px] text-[#b096e9] font-bold mt-1 bg-[#b096e9]/10 px-2 py-0.5 rounded-full w-fit">Ink Gas Reserve</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[15px] font-bold text-white">$0.00 USDC</span>
                  <span className="text-xs font-mono font-medium text-zinc-400 mt-0.5">0.0000 ETH</span>
                </div>
              </div>
            </div>

            <button 
              className="w-full mt-5 py-3.5 bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-[15px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.2)]"
            >
              Manage & Deposit Assets &rarr;
            </button>
          </div>

          <div className="p-2.5 flex flex-col gap-0.5 bg-[#08080a]">
            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <Copy className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Copy address</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <ExternalLink className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">View explorer</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)]"></div>
                </div>
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Nado Network</span>
              </div>
              <span className="text-[13px] font-bold text-[#B1FA41]">Ready</span>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <User className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">My Profile & History</span>
              </div>
            </button>

            <div className="h-px bg-white/5 w-full my-1"></div>

            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <ArrowDownToLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Deposit</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3.5">
                <ArrowUpFromLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Withdraw</span>
              </div>
            </button>

            <div className="h-px bg-white/5 w-full my-1"></div>

            <button 
              onClick={() => { disconnect(); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-red-500/10 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <LogOut className="w-[18px] h-[18px] text-red-500" strokeWidth={2} />
                <span className="text-[15px] font-semibold text-red-500">Disconnect</span>
              </div>
            </button>
          </div>
        </div>
      )}
`;

// Extract everything up to {dropdownOpen && (
const splitStr = '{dropdownOpen && (';
const parts = content.split(splitStr);

if (parts.length === 2) {
  // Find the end of the dropdownOpen block
  // It's the last )} before the final </div>);
  const endMarkerIndex = parts[1].lastIndexOf(')}');
  if (endMarkerIndex !== -1) {
    const afterDropdown = parts[1].substring(endMarkerIndex + 2); // get everything after )}
    const newContent = parts[0] + newDropdown + afterDropdown;
    fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', newContent);
    console.log("Updated ConnectWalletButton.tsx");
  } else {
    console.error("Could not find end marker");
  }
} else {
  console.error("Could not find dropdown block to replace");
}
