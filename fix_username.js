const fs = require('fs');

const path = 'src/app/profile/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The current code has: onChange={(e) => setTempUsername(e.target.value)}
// We need to replace it with: onChange={(e) => setTempUsername(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}

content = content.replace(
  /onChange=\{\(e\) => setTempUsername\(e\.target\.value\)\}/,
  "onChange={(e) => setTempUsername(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}"
);

fs.writeFileSync(path, content);
console.log('Fixed username input');
