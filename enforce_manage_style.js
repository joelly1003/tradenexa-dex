const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// Replace the Manage button to ensure style is enforced
content = content.replace(
  /<button onClick=\{\(\) => \{ window\.location\.href = '\/assets'; \}\} className="w-full mt-5 py-3\.5 bg-\[\#B1FA41\] hover:bg-\[\#a0e238\] text-black font-bold text-\[15px\] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-\[0_0_20px_rgba\(177,250,65,0\.2\)\] cursor-pointer">\n\s*Manage & Deposit Assets &rarr;\n\s*<\/button>/s,
  '<button onClick={() => { window.location.href = \'/assets\'; }} style={{ backgroundColor: \'#B1FA41\', color: \'#000000\' }} className="w-full mt-5 py-3.5 font-bold text-[15px] rounded-xl transition-all hover:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(177,250,65,0.3)] cursor-pointer">\n              Manage & Deposit Assets &rarr;\n            </button>'
);

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
