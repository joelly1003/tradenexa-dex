const fs = require('fs');
let content = fs.readFileSync('src/app/assets/page.tsx', 'utf8');

content = content.replace(
  /import React, \{ useState, useRef \} from 'react';/,
  `import React, { useState, useRef } from 'react';\nimport { useAccount, useBalance } from 'wagmi';`
);

content = content.replace(
  /const mockBalance = 10000\.00;/,
  `const { address, isConnected } = useAccount();\n  const { data: balanceData } = useBalance({ address });\n  const realBalance = (isConnected && balanceData) ? parseFloat(balanceData.formatted) : 0.00;`
);

content = content.replace(/mockBalance/g, 'realBalance');

fs.writeFileSync('src/app/assets/page.tsx', content);
