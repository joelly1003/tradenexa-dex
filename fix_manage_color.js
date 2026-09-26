const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

content = content.replace(
  /bg-\[\#000000\] hover:bg-\[\#111111\] text-white font-bold text-\[16px\] rounded-\[16px\] transition-all flex items-center justify-center gap-2 shadow-\[0_0_20px_rgba\(177,250,65,0\.15\)\] cursor-pointer">\n\s*Manage & Deposit Assets/g,
  'bg-[#B1FA41] hover:bg-[#a0e238] text-black font-bold text-[16px] rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.3)] cursor-pointer">\n              Manage & Deposit Assets'
);

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
