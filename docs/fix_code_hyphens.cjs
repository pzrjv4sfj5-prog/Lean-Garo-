// Run: node docs/fix_code_hyphens.cjs
// Converts hardcoded hyphens to raka (·) inside src/translationEngine.js and
// src/garo_classifier.js. Scoped to known line ranges (object literals +
// string concatenations) so we never touch JS syntax, comments, or regex.
// Prepared by Claude A — 2026-06-18, in response to Claude B's
// GLOBAL_RAKA_CONVERSION_HANDOFF.md (Part 3), extended after discovering
// PURPOSE_VERBS (line 111) and PROGRESSIVE_MAP (line 345) also contained
// hardcoded hyphens that the original handoff doc did not flag.

const fs = require('fs');

function fixEngine() {
  const path = 'src/translationEngine.js';
  let lines = fs.readFileSync(path, 'utf8').split('\n');
  let totalReplaced = 0;

  const ranges = [
    [72, 104],  // IRREGULAR_VERBS
    [111, 117], // PURPOSE_VERBS
    [270, 281], // PURPOSE_MAP
    [341, 352], // PROGRESSIVE_MAP
  ];

  for (const [start, end] of ranges) {
    for (let i = start - 1; i < end; i++) {
      const before = lines[i];
      const count = (before.match(/-/g) || []).length;
      if (count > 0) {
        lines[i] = before.replace(/-/g, '·');
        totalReplaced += count;
      }
    }
  }

  const exactFixes = [
    {
      old: "object = { english: objEng, garo: objGaro, withMarker: objGaro + '-ko' };",
      new: "object = { english: objEng, garo: objGaro, withMarker: objGaro + '·ko' };",
    },
    {
      old: "parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '-ko');",
      new: "parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '·ko');",
    },
    {
      old: "parts.push(grammar.object.garo.toLowerCase() + '-ko');",
      new: "parts.push(grammar.object.garo.toLowerCase() + '·ko');",
    },
    {
      old: "const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '-na');",
      new: "const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '·na');",
    },
  ];

  let joined = lines.join('\n');
  let exactApplied = 0;
  for (const fix of exactFixes) {
    if (joined.includes(fix.old)) {
      joined = joined.replace(fix.old, fix.new);
      exactApplied++;
    } else {
      console.log(`WARNING: exact match not found, skipped: ${fix.old}`);
    }
  }

  fs.writeFileSync(path, joined);
  console.log(`${path}: ${totalReplaced} hyphen(s) replaced in object literals, ${exactApplied}/${exactFixes.length} concatenation fixes applied`);
}

function fixClassifier() {
  const path = 'src/garo_classifier.js';
  let content = fs.readFileSync(path, 'utf8');

  const exactFixes = [
    {
      old: "if (n > 10 && n < 20) return `chiking-ma-${NUMBERS[n-10]||n-10}`;",
      new: "if (n > 10 && n < 20) return `chiking·ma·${NUMBERS[n-10]||n-10}`;",
    },
    {
      old: "return `${classifier}-${getClassifierSuffix(count)}`;",
      new: "return `${classifier}·${getClassifierSuffix(count)}`;",
    },
    {
      old: "if (num > 10 && num < 20) return `chiking-ma-${NUMBERS[num-10]}`;",
      new: "if (num > 10 && num < 20) return `chiking·ma·${NUMBERS[num-10]}`;",
    },
  ];

  let exactApplied = 0;
  for (const fix of exactFixes) {
    if (content.includes(fix.old)) {
      content = content.replace(fix.old, fix.new);
      exactApplied++;
    } else {
      console.log(`WARNING: exact match not found, skipped: ${fix.old}`);
    }
  }

  fs.writeFileSync(path, content);
  console.log(`${path}: ${exactApplied}/${exactFixes.length} fixes applied`);
}

fixEngine();
fixClassifier();
console.log('Done.');
