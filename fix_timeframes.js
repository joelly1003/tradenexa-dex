const fs = require('fs');
let content = fs.readFileSync('src/components/trading/pro/TradingViewChart.tsx', 'utf8');

content = content.replace(/supported_resolutions: \["1", "3", "5", "15", "30", "45", "60", "120", "D"\],/g, 'supported_resolutions: ["1", "5", "15", "60", "240", "1D"],');

fs.writeFileSync('src/components/trading/pro/TradingViewChart.tsx', content);
