const fs = require('fs');
let content = fs.readFileSync('src/components/market/MarketInterface.tsx', 'utf8');

const replacement = `const ALLOWED_COINS = ['BTC', 'ETH', 'SOL', 'PENGU', 'ASTR', 'USDC', 'PUMP', 'HYPE', 'AVAX', 'DOGE', 'XRP', 'BNB'];
  const assets: Asset[] = (nadoPrices || []).filter((p: any) => ALLOWED_COINS.includes(p.symbol.replace('-PERP', '').toUpperCase())).map((p: any) => ({`;

content = content.replace(/const assets: Asset\[\] = \(nadoPrices \|\| \[\]\)\.filter\(\(p: any\) => p\.onBinance\)\.map\(\(p: any\) => \(\{/g, replacement);

fs.writeFileSync('src/components/market/MarketInterface.tsx', content);
