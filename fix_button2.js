const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// The connected button
content = content.replace(/!bg-white/g, '!bg-black');
content = content.replace(/hover:!bg-zinc-100/g, 'hover:!bg-[#121824]');
content = content.replace(/!text-black/g, '!text-white'); // ensure text is white

// The disconnected button
content = content.replace(/bg-white text-black hover:bg-zinc-200/g, 'bg-black text-white hover:bg-[#121824]');

// The loading button
content = content.replace(/bg-white border border-\[\#05c4a7\]\/30/g, 'bg-black border border-[#05c4a7]/30');

// Fix the skeleton
content = content.replace(/bg-black\/5 animate-pulse rounded-full border border-black\/10/, 'bg-white/5 animate-pulse rounded-full border border-white/10');

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
