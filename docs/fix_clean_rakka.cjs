// Run: node docs/fix_clean_rakka.cjs
// Fixes Finding A from the repo audit:
// The second .replace() in cleanRakka() strips raka (·) from verb roots
// before common suffixes (a, aha, enga, bo, ja, gen etc.), corrupting
// 2,418 entries in master_dictionary.json when compiled.
// Fix: remove the bad regex, keep only the legitimate spacing fix.

const fs = require('fs');
const path = 'prepare-data.js';

const content = fs.readFileSync(path, 'utf8');

const OLD = `function cleanRakka(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\s+·/g, '·')
    .replace(/·(?=(a|enga|oenga|bo|ja|aha|gen|manjok|ama|engma)(?:\\b|-))/g, '');
}`;

const NEW = `function cleanRakka(str) {
  if (typeof str !== 'string') return str;
  // Only fix spacing errors (space before raka).
  // The previous regex that stripped raka before verb suffixes was REMOVED —
  // it was corrupting 2,418 entries by deleting the glottal stop from verb
  // roots like cha·a → chaa, nik·aha → nikaha, on·bo → onbo etc.
  // (Audit Finding A, 2026-06-17)
  return str.replace(/\\s+·/g, '·');
}`;

if (!content.includes(OLD.replace(/\\\\/g, '\\'))) {
  // Try without escaped backslashes
  const OLD2 = `function cleanRakka(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\s+·/g, '·')
    .replace(/·(?=(a|enga|oenga|bo|ja|aha|gen|manjok|ama|engma)(?:\\b|-))/g, '');
}`;
  if (content.includes('cleanRakka')) {
    // Use line-based replacement instead
    const lines = content.split('\n');
    let start = -1, end = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('function cleanRakka')) start = i;
      if (start !== -1 && lines[i] === '}' && i > start) { end = i; break; }
    }
    if (start !== -1 && end !== -1) {
      const fixed = [
        ...lines.slice(0, start),
        `function cleanRakka(str) {`,
        `  if (typeof str !== 'string') return str;`,
        `  // Only fix spacing errors (space before raka).`,
        `  // The previous regex that stripped raka before verb suffixes was REMOVED —`,
        `  // it was corrupting 2,418 entries by deleting the glottal stop from verb`,
        `  // roots like cha·a → chaa, nik·aha → nikaha, on·bo → onbo etc.`,
        `  // (Audit Finding A, 2026-06-17)`,
        `  return str.replace(/\\s+·/g, '·');`,
        `}`,
        ...lines.slice(end + 1)
      ].join('\n');
      fs.writeFileSync(path, fixed);
      console.log(`Fixed cleanRakka() at lines ${start+1}-${end+1}`);
      console.log('Now run: npm run build');
    } else {
      console.log('ERROR: Could not locate cleanRakka function bounds');
      process.exit(1);
    }
  }
} else {
  const fixed = content.replace(OLD.replace(/\\\\/g, '\\'), NEW);
  fs.writeFileSync(path, fixed);
  console.log('Fixed cleanRakka() — bad regex removed');
  console.log('Now run: npm run build');
}
