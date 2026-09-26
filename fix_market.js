const fs = require('fs');

let content = fs.readFileSync('src/components/market/MarketInterface.tsx', 'utf8');

// Remove onClick that redirects to trade
content = content.replace(/onClick=\{\(\) => router\.push\(`\/trade\?symbol=\$\{asset\.symbol\}`\)\}/g, '');

// Remove cursor-pointer from the row if it exists
content = content.replace(/cursor-pointer/g, '');

// Remove router since it's unused
content = content.replace(/const router = useRouter\(\);\n/g, '');
content = content.replace(/import \{ useRouter \} from 'next\/navigation';\n/g, '');

// Re-write back
fs.writeFileSync('src/components/market/MarketInterface.tsx', content);
