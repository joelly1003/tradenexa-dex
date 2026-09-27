const fs = require('fs');

function updateLogo(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Header Logo Replacement
  content = content.replace(
    /<Image\s+src="\/logo\.png"\s+alt="TradeNexa Logo"\s+width=\{180\}\s+height=\{50\}\s+className="w-auto h-8 md:h-10 object-contain"\s+priority\s*\/>/g,
    '<Image src="/logo.png" alt="TradeNexa Logo" width={600} height={160} quality={100} unoptimized={true} className="w-auto h-12 md:h-14 object-contain" priority />'
  );

  // Footer Logo Replacement
  content = content.replace(
    /<Image\s+src="\/logo\.png"\s+alt="TradeNexa Logo"\s+width=\{180\}\s+height=\{50\}\s+className="w-auto h-8 md:h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"\s+loading="lazy"\s*\/>/g,
    '<Image src="/logo.png" alt="TradeNexa Logo" width={600} height={160} quality={100} unoptimized={true} className="w-auto h-12 md:h-14 object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />'
  );

  fs.writeFileSync(filePath, content);
}

try { updateLogo('src/components/layout/Header.tsx'); } catch (e) { console.error(e); }
try { updateLogo('src/components/layout/Footer.tsx'); } catch (e) { console.error(e); }
