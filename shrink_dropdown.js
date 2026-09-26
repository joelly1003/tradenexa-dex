const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

// Reduce width from 360 to 320
content = content.replace(/w-\[360px\]/, 'w-[320px]');

// Top section padding and gaps
content = content.replace(/p-5 pb-5/g, 'p-4 pb-4');
content = content.replace(/mb-6/g, 'mb-4');
content = content.replace(/gap-5/g, 'gap-4');
content = content.replace(/mt-7 py-3\.5/g, 'mt-5 py-3');

// Text sizes and icons for top section
content = content.replace(/text-\[16px\]/g, 'text-[14px]');
content = content.replace(/w-3 h-3/g, 'w-2.5 h-2.5');

// Bottom section padding
content = content.replace(/p-3 flex flex-col gap-2/g, 'p-2 flex flex-col gap-1.5');
content = content.replace(/px-5 py-3\.5/g, 'px-4 py-3');

// Bottom section text sizes and icons
content = content.replace(/w-\[20px\] h-\[20px\]/g, 'w-[18px] h-[18px]');
content = content.replace(/text-\[15px\]/g, 'text-[14px]');

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
