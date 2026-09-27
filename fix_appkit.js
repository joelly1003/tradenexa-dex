const fs = require('fs');
let content = fs.readFileSync('src/app/providers.tsx', 'utf8');

content = content.replace(
  /features: \{\s*analytics: false,\s*email: false,\s*socials: \[\]\s*\}/g,
  `features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook']
  }`
);

fs.writeFileSync('src/app/providers.tsx', content);
