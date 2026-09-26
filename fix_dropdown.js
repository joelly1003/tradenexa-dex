const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

content = content.replace(/<span className="text-\[13px\] font-bold text-\[\#B1FA41\]">Ready<\/span>/, '');

content = content.replace(/<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group">[\s\n]*<div className="flex items-center gap-3\.5">[\s\n]*<User className="w-\[18px\] h-\[18px\] text-zinc-400 group-hover:text-white transition-colors" strokeWidth=\{2\} \/>[\s\n]*<span className="text-\[15px\] font-semibold text-zinc-300 group-hover:text-white transition-colors">My Profile & History<\/span>[\s\n]*<\/div>[\s\n]*<\/button>/, '<button onClick={() => { window.location.href = \'/profile\'; }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <User className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />\n                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">My Profile & History</span>\n              </div>\n            </button>');

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
