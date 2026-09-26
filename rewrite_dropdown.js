const fs = require('fs');

const replacement = `      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-[360px] bg-[#050506] border border-white/5 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-white font-sans">
          
          {/* Top Section */}
          <div className="p-5 pb-5 border-b border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[13px] font-black text-zinc-400 tracking-wider">ACCOUNT ASSETS</span>
              <button className="flex items-center gap-1.5 text-[13px] font-bold text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)]"></div>
                  <span className="text-[16px] font-semibold text-white">Nado DEX Collateral</span>
                </div>
                <span className="text-[16px] font-bold text-[#B1FA41]">$0.00 USDC</span>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)] mt-1"></div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-white">MetaMask Wallet</span>
                    <span className="text-[11px] text-[#b096e9] font-bold mt-1.5 bg-[#b096e9]/10 px-2.5 py-0.5 rounded-full w-fit">Ink Gas Reserve</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[16px] font-bold text-white">$0.00 USDC</span>
                  <span className="text-xs font-mono font-medium text-zinc-400 mt-1">0.0000 ETH</span>
                </div>
              </div>
            </div>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full mt-7 py-3.5 bg-[#000000] hover:bg-[#111111] text-white font-bold text-[16px] rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.15)] cursor-pointer">
              Manage & Deposit Assets &rarr;
            </button>
          </div>

          {/* Bottom Section */}
          <div className="p-3 flex flex-col gap-2 bg-[#050506]">
            
            <button onClick={() => { navigator.clipboard.writeText('0x20BA6f38012c8883D013a3e561f34D11E7E85e0f'); alert('Address copied!'); }} className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <Copy className="w-[20px] h-[20px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[15px] font-bold text-white">Copy address</span>
            </button>
            
            <button onClick={() => { window.open('https://explorer.inkonchain.com/address/0x20BA6f38012c8883D013a3e561f34D11E7E85e0f', '_blank'); }} className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ExternalLink className="w-[20px] h-[20px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[15px] font-bold text-white">View explorer</span>
            </button>

            <button className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-default">
              <div className="w-[18px] h-[18px] rounded-full bg-[#B1FA41] shadow-[0_0_8px_rgba(177,250,65,0.6)] ml-[1px]"></div>
              <span className="text-[15px] font-bold text-white ml-[1px]">Nado Network</span>
            </button>

            <button onClick={() => { window.location.href = '/profile'; }} className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <User className="w-[20px] h-[20px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[15px] font-bold text-white">My Profile & History</span>
            </button>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ArrowDownToLine className="w-[20px] h-[20px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[15px] font-bold text-white">Deposit</span>
            </button>

            <button onClick={() => { window.location.href = '/assets'; }} className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#0a0a0c] hover:bg-white/5 rounded-[16px] transition-colors group cursor-pointer">
              <ArrowUpFromLine className="w-[20px] h-[20px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
              <span className="text-[15px] font-bold text-white">Withdraw</span>
            </button>

            <button 
              onClick={() => { disconnect(); setDropdownOpen(false); }}
              className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#12141a] hover:bg-[#1a1c24] rounded-[16px] transition-colors group cursor-pointer mt-1"
            >
              <LogOut className="w-[20px] h-[20px] text-red-500" strokeWidth={2} />
              <span className="text-[15px] font-bold text-red-500">Disconnect</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}`;

let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// Find the start of {dropdownOpen && ( and replace to the end
const startIndex = content.indexOf('{dropdownOpen && (');
if (startIndex !== -1) {
  content = content.substring(0, startIndex) + replacement;
  fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
  console.log("Successfully replaced dropdown!");
} else {
  console.log("Could not find dropdown start!");
}
