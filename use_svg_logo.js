const fs = require('fs');

function updateLogoToSvg(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\/logo\.png/g, '/logo.svg');
  fs.writeFileSync(filePath, content);
}

try { updateLogoToSvg('src/components/layout/Header.tsx'); } catch (e) { console.error(e); }
try { updateLogoToSvg('src/components/layout/Footer.tsx'); } catch (e) { console.error(e); }
