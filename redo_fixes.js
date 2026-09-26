const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/lib/nado/types.ts', 'utf8');
types = types.replace(/timestamp: number;/, 'timestamp: number;\n  onBinance?: boolean;');
fs.writeFileSync('src/lib/nado/types.ts', types);

// 2. useNadoEdgeTicker.ts
let useNado = fs.readFileSync('src/hooks/nado/useNadoEdgeTicker.ts', 'utf8');
useNado = useNado.replace(/timestamp: now\n\s*\} as CachedPriceItem;/g, 'timestamp: now,\n          onBinance: !!mMatch\n        } as CachedPriceItem;');
useNado = useNado.replace(/timestamp: Date\.now\(\) \},/g, 'timestamp: Date.now(), onBinance: true },');
fs.writeFileSync('src/hooks/nado/useNadoEdgeTicker.ts', useNado);

// 3. MarketInterface.tsx
let mkt = fs.readFileSync('src/components/market/MarketInterface.tsx', 'utf8');
mkt = mkt.replace(/const assets: Asset\[\] = \(nadoPrices \|\| \[\]\)\.map/g, 'const assets: Asset[] = (nadoPrices || []).filter((p: any) => p.onBinance).map');
fs.writeFileSync('src/components/market/MarketInterface.tsx', mkt);

// 4. OrderEntry.tsx
let oe = fs.readFileSync('src/components/trading/pro/OrderEntry.tsx', 'utf8');
oe = oe.replace(/<span className="text-xs text-white">\{leverage\}x<\/span>/g, '<span className="text-xs text-[#B1FA41]">{leverage}x</span>');
oe = oe.replace(/<ChevronDown className="w-3 h-3 text-zinc-400" \/>/g, '');
oe = oe.replace(/className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"/g, 'className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#B1FA41]"');
fs.writeFileSync('src/components/trading/pro/OrderEntry.tsx', oe);

// 5. TradingViewChart.tsx
let tv = fs.readFileSync('src/components/trading/pro/TradingViewChart.tsx', 'utf8');
tv = tv.replace(/<div className="absolute bottom-0 left-0 w-\[60px\] h-\[30px\] bg-\[\#0a0a0c\] z-10 pointer-events-none" \/>/g, '');
tv = tv.replace(/<div className="absolute bottom-0 left-\[60px\] w-\[40px\] h-\[40px\] bg-\[\#0a0a0c\] z-10 pointer-events-none" \/>/g, '');
fs.writeFileSync('src/components/trading/pro/TradingViewChart.tsx', tv);
