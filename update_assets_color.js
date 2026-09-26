const fs = require('fs');
let content = fs.readFileSync('src/app/assets/page.tsx', 'utf8');

// Replace cyan colors with the theme color for the deposit buttons and tabs
content = content.replace(/bg-cyan-400/g, 'bg-[#B1FA41]');
content = content.replace(/hover:bg-cyan-300/g, 'hover:bg-[#a0e238]');
content = content.replace(/text-cyan-400/g, 'text-[#B1FA41]');
content = content.replace(/bg-cyan-500\/10/g, 'bg-[#B1FA41]/10');
content = content.replace(/bg-cyan-500\/20/g, 'bg-[#B1FA41]/20');
content = content.replace(/hover:bg-cyan-500\/30/g, 'hover:bg-[#B1FA41]/30');
content = content.replace(/shadow-\[0_0_20px_rgba\(34,211,238,0\.2\)\]/g, 'shadow-[0_0_20px_rgba(177,250,65,0.2)]');
content = content.replace(/shadow-\[0_0_15px_rgba\(34,211,238,0\.2\)\]/g, 'shadow-[0_0_15px_rgba(177,250,65,0.2)]');
content = content.replace(/text-black/g, 'text-black'); // already there

fs.writeFileSync('src/app/assets/page.tsx', content);
