const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const pnlCard = `
        {/* Historical PnL */}
        <div className="bg-[#121216] border border-white/5 rounded-[20px] p-6 h-[300px]">
          <div className="flex items-center gap-2 text-white font-bold mb-4">
            <Activity className="w-4 h-4" /> 30-Day Historical PnL
          </div>
        </div>

        {/* Lower Row: PnL and Stats */}
`;

content = content.replace(/\{\/\* Lower Row: PnL and Stats \*\/\}/, pnlCard);

fs.writeFileSync('src/app/profile/page.tsx', content);
