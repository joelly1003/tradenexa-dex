const fs = require('fs');
let content = fs.readFileSync('src/hooks/nado/useNadoEdgeTicker.ts', 'utf8');

// The fallback block
content = content.replace(/onBinance: !!match/g, 'onBinance: true');

fs.writeFileSync('src/hooks/nado/useNadoEdgeTicker.ts', content);
