const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');
content = content.replace(/className="w-full mt-5 py-3\.5 bg-\[\#B1FA41\] hover:bg-\[\#a0e238\] text-black font-bold text-\[15px\] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-\[0_0_20px_rgba\(177,250,65,0\.2\)\]"/g, 'className="w-full mt-5 py-3.5 bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-[15px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.2)] cursor-pointer"');
fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
