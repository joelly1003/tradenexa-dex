const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// 1. Manage & Deposit Assets
content = content.replace(
  /<button[\s\S]*?className="w-full mt-5 py-3\.5 bg-\[\#B1FA41\].*?>[\s\S]*?Manage & Deposit Assets &rarr;[\s\S]*?<\/button>/,
  '<button onClick={() => { window.location.href = \'/assets\'; }} className="w-full mt-5 py-3.5 bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-[15px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.2)] cursor-pointer">\n              Manage & Deposit Assets &rarr;\n            </button>'
);

// 2. Copy address
content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group">[\s\S]*?<div className="flex items-center gap-3\.5">[\s\S]*?<Copy [\s\S]*?<\/button>/,
  '<button onClick={() => { navigator.clipboard.writeText(\'0x20BA6f38012c8883D013a3e561f34D11E7E85e0f\'); alert(\'Address copied!\'); }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <Copy className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />\n                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Copy address</span>\n              </div>\n            </button>'
);

// 3. View explorer
content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group">[\s\S]*?<div className="flex items-center gap-3\.5">[\s\S]*?<ExternalLink [\s\S]*?<\/button>/,
  '<button onClick={() => { window.open(\'https://explorer.inkonchain.com/address/0x20BA6f38012c8883D013a3e561f34D11E7E85e0f\', \'_blank\'); }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ExternalLink className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />\n                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">View explorer</span>\n              </div>\n            </button>'
);

// 4. Deposit
content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group">[\s\S]*?<div className="flex items-center gap-3\.5">[\s\S]*?<ArrowDownToLine [\s\S]*?<\/button>/,
  '<button onClick={() => { window.location.href = \'/assets\'; }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ArrowDownToLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />\n                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Deposit</span>\n              </div>\n            </button>'
);

// 5. Withdraw
content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group">[\s\S]*?<div className="flex items-center gap-3\.5">[\s\S]*?<ArrowUpFromLine [\s\S]*?<\/button>/,
  '<button onClick={() => { window.location.href = \'/assets\'; }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ArrowUpFromLine className="w-[18px] h-[18px] text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />\n                <span className="text-[15px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Withdraw</span>\n              </div>\n            </button>'
);

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
