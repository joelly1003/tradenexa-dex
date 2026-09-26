const fs = require('fs');

let types = fs.readFileSync('src/lib/nado/types.ts', 'utf8');
types = types.replace(/onBinance\?: boolean;\s+onBinance\?: boolean;/, 'onBinance?: boolean;');
fs.writeFileSync('src/lib/nado/types.ts', types);

let useNado = fs.readFileSync('src/hooks/nado/useNadoEdgeTicker.ts', 'utf8');
useNado = useNado.replace(/!!mMatch/g, '!!match');
fs.writeFileSync('src/hooks/nado/useNadoEdgeTicker.ts', useNado);
