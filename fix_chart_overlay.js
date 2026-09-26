const fs = require('fs');
let content = fs.readFileSync('src/components/trading/pro/TradingViewChart.tsx', 'utf8');

content = content.replace(/<div className="absolute bottom-\[30px\] left-0 w-\[80px\] h-\[45px\] bg-\[\#0a0a0c\] z-\[999\] pointer-events-none" \/>/g, '');
content = content.replace(/<div className="absolute bottom-0 left-0 w-\[45px\] h-\[30px\] bg-\[\#0a0a0c\] z-\[999\] pointer-events-none" \/>/g, '');
content = content.replace(/\{\/\* Hide TradingView Logo \/ Watermark Overlay \*\/\}/g, '');

fs.writeFileSync('src/components/trading/pro/TradingViewChart.tsx', content);
