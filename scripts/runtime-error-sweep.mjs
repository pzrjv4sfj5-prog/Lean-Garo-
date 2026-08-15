// Runtime error sweep: catches unhandled exceptions/crashes across the
// public API surface, NOT linguistic correctness (that's test-dictionary.js
// and repository-intelligence.js's job). Two passes:
//   1. Every compiled_dict.json key run through translate() directly.
//   2. A batch of structural edge cases (empty/null/whitespace/punctuation/
//      numerals/very long input/mixed case/unicode raka chars/multi-word
//      combinations of compiled keys) likely to hit code paths a plain
//      key-sweep wouldn't (stopword-stripping, pluralization, classifier
//      composition, morphology's findVerbForm, sentence assembly).

import fs from 'fs';
import { translate, getAllVocabulary, getByCategory, getCategories, getAlternates } from '../src/translationEngine.js';

const compiledDict = JSON.parse(fs.readFileSync('src/compiled_dict.json', 'utf8'));
const keys = Object.keys(compiledDict);

let errors = [];
let checked = 0;

async function safeTranslate(input, label) {
  checked++;
  try {
    const result = await translate(input);
    if (result === undefined || result === null) {
      errors.push({ label, input, error: 'translate() returned undefined/null (no throw, but no result)' });
    }
  } catch (e) {
    errors.push({ label, input, error: e.stack || String(e) });
  }
}

console.log(`Pass 1: every compiled_dict.json key (${keys.length} total) through translate()...`);
for (const k of keys) {
  await safeTranslate(k, 'compiled_dict key');
}
console.log(`  done, ${checked} checked so far, ${errors.length} error(s)`);

console.log('Pass 1b: plural forms of every compiled_dict key (naive "+s")...');
for (const k of keys) {
  if (/^[a-zA-Z ]+$/.test(k) && !k.endsWith('s')) {
    await safeTranslate(k + 's', 'plural of compiled_dict key');
  }
}
console.log(`  done, ${checked} checked so far, ${errors.length} error(s)`);

console.log('Pass 1c: counted-noun forms ("twenty <key>") for a sample of single-word keys...');
const singleWordKeys = keys.filter(k => /^[a-z]+$/i.test(k)).slice(0, 500);
for (const k of singleWordKeys) {
  await safeTranslate('twenty ' + k, 'counted-noun (twenty)');
  await safeTranslate('one ' + k, 'counted-noun (one)');
}
console.log(`  done, ${checked} checked so far, ${errors.length} error(s)`);

console.log('Pass 2: structural edge cases...');
const edgeCases = [
  '', ' ', '   ', '\n', '\t',
  'a', 'I', 'the', 'so', 'and', 'of',
  '?', '!', '.', ',', '...',
  '123', '0', '-1', '3.14', '20th',
  'a'.repeat(500),
  'THE QUICK BROWN FOX',
  'ThE qUiCk BrOwN fOx',
  'student teacher house',
  'twenty students and thirty teachers',
  'I am angry and I am also hungry',
  'a dog bit me and then it ran away quickly into the forest',
  'chattro sak·sa', // raw Garo input
  '日本語', // non-Latin unicode
  'café naïve', // accented Latin
  '<script>alert(1)</script>', // injection-shaped input
  'undefined', 'null', 'NaN',
  'twenty twenty students', // malformed count
  'zero students',
  'negative one students',
  '  leading and trailing whitespace  ',
  'multiple   internal   spaces',
  "it's a dog's bone",
  'student, teacher, and house',
];
for (const input of edgeCases) {
  await safeTranslate(input, 'edge case');
}
console.log(`  done, ${checked} checked so far, ${errors.length} error(s)`);

console.log('Pass 2b: null/undefined/non-string inputs (type-safety)...');
for (const input of [null, undefined, 123, {}, [], true, NaN]) {
  await safeTranslate(input, 'type-safety edge case');
}
console.log(`  done, ${checked} checked so far, ${errors.length} error(s)`);

console.log('Pass 3: other exported API surface...');
try {
  const vocab = getAllVocabulary();
  console.log(`  getAllVocabulary(): ${vocab.length} entries, OK`);
} catch (e) {
  errors.push({ label: 'getAllVocabulary', input: null, error: e.stack || String(e) });
}
try {
  const cats = getCategories();
  console.log(`  getCategories(): ${cats.length} categories, OK`);
  for (const c of cats) {
    try {
      getByCategory(c);
    } catch (e) {
      errors.push({ label: 'getByCategory', input: c, error: e.stack || String(e) });
    }
  }
  console.log(`  getByCategory() x${cats.length}: OK`);
} catch (e) {
  errors.push({ label: 'getCategories', input: null, error: e.stack || String(e) });
}
try {
  for (const k of keys.slice(0, 200)) getAlternates(k);
  console.log('  getAlternates() x200 sample: OK');
} catch (e) {
  errors.push({ label: 'getAlternates', input: null, error: e.stack || String(e) });
}

console.log(`\n=== SWEEP COMPLETE ===`);
console.log(`Total translate() calls: ${checked}`);
console.log(`Errors: ${errors.length}`);
if (errors.length > 0) {
  console.log('\n--- ERROR DETAILS (first 30) ---');
  for (const e of errors.slice(0, 30)) {
    console.log(`[${e.label}] input=${JSON.stringify(e.input)}\n  ${e.error}\n`);
  }
  process.exit(1);
} else {
  console.log('PASSED — zero runtime errors across full compiled_dict key sweep, plural/counted-noun sample, structural edge cases, type-safety inputs, and full API surface.');
  process.exit(0);
}
