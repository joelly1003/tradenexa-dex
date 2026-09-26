const fs = require('fs');
let content = fs.readFileSync('src/components/trading/pro/TradingViewChart.tsx', 'utf8');

const regex = /return \([\s\S]*?\);\n\}/g;
const newReturn = `return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0c] relative group">
      <div className="w-full flex-1 relative bg-[#0a0a0c]" ref={containerRef} />
    </div>
  );
}`;

content = content.replace(regex, newReturn);
fs.writeFileSync('src/components/trading/pro/TradingViewChart.tsx', content);
