const fs = require('fs');
let content = fs.readFileSync('src/components/trading/pro/TradingViewChart.tsx', 'utf8');

// Add supported_resolutions
content = content.replace(/interval: "1",/g, 'interval: "1",\n      supported_resolutions: ["1", "3", "5", "15", "30", "45", "60", "120", "D"],');

// Replace return statement to remove white/black boxes
const newReturn = `  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0c] relative group">
      <div className="w-full flex-1 relative bg-[#0a0a0c]" ref={containerRef} />
    </div>
  );`;

content = content.replace(/  return \([\s\S]*?\);\n/g, newReturn + '\n');

fs.writeFileSync('src/components/trading/pro/TradingViewChart.tsx', content);
