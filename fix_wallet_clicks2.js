const fs = require('fs');
let content = fs.readFileSync('src/components/wallet/ConnectWalletButton.tsx', 'utf8');

content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group(?: cursor-pointer)?">\n\s*<div className="flex items-center gap-3\.5">\n\s*<Copy /g,
  '<button onClick={() => { navigator.clipboard.writeText(\'0x20BA6f38012c8883D013a3e561f34D11E7E85e0f\'); alert(\'Address copied!\'); }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <Copy '
);

content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group(?: cursor-pointer)?">\n\s*<div className="flex items-center gap-3\.5">\n\s*<ExternalLink /g,
  '<button onClick={() => { window.open(\'https://explorer.inkonchain.com/address/0x20BA6f38012c8883D013a3e561f34D11E7E85e0f\', \'_blank\'); }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ExternalLink '
);

content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group(?: cursor-pointer)?">\n\s*<div className="flex items-center gap-3\.5">\n\s*<ArrowDownToLine /g,
  '<button onClick={() => { window.location.href = \'/assets\'; }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ArrowDownToLine '
);

content = content.replace(
  /<button className="w-full flex items-center justify-between px-3 py-2\.5 hover:bg-white\/5 rounded-xl transition-colors group(?: cursor-pointer)?">\n\s*<div className="flex items-center gap-3\.5">\n\s*<ArrowUpFromLine /g,
  '<button onClick={() => { window.location.href = \'/assets\'; }} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">\n              <div className="flex items-center gap-3.5">\n                <ArrowUpFromLine '
);

fs.writeFileSync('src/components/wallet/ConnectWalletButton.tsx', content);
