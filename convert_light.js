const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[\#0B0E14\]/g, replacement: 'bg-zinc-50' },
  { regex: /bg-\[\#0c0d10\]/g, replacement: 'bg-white' },
  { regex: /bg-\[\#0a0a0c\]/g, replacement: 'bg-white' },
  { regex: /bg-\[\#08080a\]/g, replacement: 'bg-zinc-100' },
  { regex: /bg-\[\#121824\]/g, replacement: 'bg-zinc-100' },
  { regex: /bg-\[\#1a2332\]/g, replacement: 'bg-zinc-200' },
  { regex: /bg-\[\#121318\]/g, replacement: 'bg-zinc-100' },
  { regex: /bg-black/g, replacement: 'bg-white' },
  { regex: /border-white\/5/g, replacement: 'border-black/5' },
  { regex: /border-white\/10/g, replacement: 'border-black/10' },
  { regex: /border-white\/20/g, replacement: 'border-black/20' },
  { regex: /border-white\/30/g, replacement: 'border-black/30' },
  { regex: /border-zinc-900/g, replacement: 'border-zinc-200' },
  { regex: /border-zinc-800/g, replacement: 'border-zinc-300' },
  { regex: /border-zinc-800\/50/g, replacement: 'border-zinc-300/50' },
  { regex: /text-zinc-400/g, replacement: 'text-zinc-500' },
  { regex: /text-zinc-300/g, replacement: 'text-zinc-600' },
  { regex: /hover:bg-white\/5/g, replacement: 'hover:bg-black/5' },
  { regex: /hover:bg-white\/10/g, replacement: 'hover:bg-black/10' },
  { regex: /bg-white\/5/g, replacement: 'bg-black/5' },
  { regex: /bg-white\/10/g, replacement: 'bg-black/10' },
  { regex: /hover:border-white\/10/g, replacement: 'hover:border-black/10' },
  { regex: /hover:border-white\/20/g, replacement: 'hover:border-black/20' },
  { regex: /hover:text-white/g, replacement: 'hover:text-black' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Custom safe replacements for text-white -> text-black
  content = content.replace(/text-white/g, (match, offset, str) => {
    const context = str.substring(Math.max(0, offset - 100), Math.min(str.length, offset + 100));
    if (context.includes('bg-[#22C55E]') || context.includes('bg-[#EF4444]') || context.includes('bg-[#F59E0B]') || context.includes('bg-red-') || context.includes('bg-green-') || context.includes('bg-blue-')) {
      return 'text-white';
    }
    return 'text-black';
  });

  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  
  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx')) {
      processFile(full);
    }
  }
}

walk('./src/components');
walk('./src/app');
