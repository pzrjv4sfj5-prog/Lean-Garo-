/**
 * translationEngine.js
 * Claude A — Language & Engine Side
 *
 * Priority cascade:
 *  1. corrections.json overrides
 *  1.5 Verified phrase map
 *  2. Exact phrase match (compiled dict)
 *  3. Exact word match
 *  4. Stop-word strip + retry
 *  5. Number + classifier engine
 *  6. SOV assembly
 *  7. Morphology
 *  8. Compound split
 *  9. Fuzzy match
 * 10. Gemini fallback
 * 11. Passthrough
 */

import compiledDictRaw from './compiled_dict.json' with { type: 'json' };
import corrections from './data/corrections.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import { classifyNoun } from './garo_classifier.js';
import { translateNumber } from './number_engine.js';
import { callGemini } from './gemini.js';

// Index build — support both string and array format
function normalizeEntry(val) {
  if (!val) return null;
  if (typeof val === 'string') return { garo: val, pos: null, category: null };
  if (Array.isArray(val)) return val[0];
  return val;
}

const EN_INDEX = {};
for (const [key, val] of Object.entries(compiledDictRaw)) {
  EN_INDEX[key.toLowerCase().trim()] = val;
}

function lookup(key) {
  const entry = EN_INDEX[key.toLowerCase().trim()];
  return entry ? normalizeEntry(entry) : null;
}

function lookupGaro(key) {
  const e = lookup(key);
  return e ? e.garo : null;
}

const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could',
  'should','may','might','shall','can','to','of','in','on',
  'at','by','for','with','about','from',
]);

const VERB_SUFFIXES = {
  present: 'enga', past: '·a', past_alt: 'aha',
  future: 'gen', command: 'bo',
};

function applyTense(verbRoot, tense) {
  const clean = verbRoot.replace(/[-·](enga|aha|gen|bo|·a)$/, '');
  const suffix = VERB_SUFFIXES[tense] || VERB_SUFFIXES.present;
  return clean + suffix;
}

export function analyzeGrammar(input) {
  if (!input || typeof input !== 'string') return null;
  const words = input.trim().split(/\s+/);
  const wordCount = words.length;

  let detectedTense = 'present';
  let tenseEvidence = null;

  if (/\b(will|shall|going to)\b/i.test(input)) {
    detectedTense = 'future';
    tenseEvidence = input.match(/\b(will|shall|going to)\b/i)?.[0];
  } else if (/\b(was|were|had|did|went|came|ate|drank)\b/i.test(input)) {
    detectedTense = 'past';
    tenseEvidence = input.match(/\b(was|were|had|did|went|came|ate|drank)\b/i)?.[0];
  } else if (/\b(please)\b/i.test(input) && wordCount <= 4) {
    detectedTense = 'command';
  }

  const pronounMap = {
    'i':'Anga','me':'Anga','you':'Na·a','he':'Ua','she':'Ua',
    'it':'Ua','we':'An·ching','us':'An·ching','they':'Uamang','them':'Uamang',
  };

  let subject = null, verb = null, object = null;
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g,'');
  if (pronounMap[firstWord]) {
    subject = { english: words[0], garo: pronounMap[firstWord] };
    if (wordCount >= 2) {
      const vw = words[1].toLowerCase().replace(/[^a-z]/g,'');
      const vg = lookupGaro(vw);
      if (vg) verb = { english: words[1], garo: vg, tense: detectedTense, garoWithTense: applyTense(vg, detectedTense) };
    }
    if (verb && wordCount > 2) {
      const objWords = words.slice(2).join(' ');
      object = { english: objWords, garo: lookupGaro(objWords) || '[UNKNOWN]' };
    }
  }

  const classifierHints = [];
  const li = input.toLowerCase();
  if (/\b(dog|cat|cow|bird|fish|animal|insect)\b/.test(li)) classifierHints.push({ classifier: 'mang', reason: 'animal noun' });
  if (/\b(person|man|woman|teacher|student)\b/.test(li)) classifierHints.push({ classifier: 'sak', reason: 'person noun' });
  if (/\b(money|rupee|coin)\b/.test(li)) classifierHints.push({ classifier: 'gong', reason: 'money noun' });
  if (/\b(book|paper|leaf)\b/.test(li)) classifierHints.push({ classifier: 'king', reason: 'flat object' });

  return {
    wordCount, detectedTense, tenseEvidence,
    garoTenseSuffix: VERB_SUFFIXES[detectedTense] || null,
    structure: subject ? 'SVO → SOV (Garo)' : 'unknown',
    subject, verb, object, classifierHints,
    garoWordOrder: 'SOV (Subject → Object → Verb)',
    notes: wordCount === 1 ? 'Single word — direct lookup' : wordCount <= 3 ? 'Short phrase' : 'Complex sentence — SOV assembly',
  };
}

function assembleSentenceSOV(words) {
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  if (!content.length) return null;
  const translated = content.map(w => lookupGaro(w) || w);
  if (translated.every((t, i) => t === content[i])) return null;
  const verbs = [], nonVerbs = [];
  translated.forEach((t, i) => {
    const e = lookup(content[i].toLowerCase());
    if (e?.pos === 'verb' || /enga$|aha$|gen$|bo$/.test(t)) verbs.push(t);
    else nonVerbs.push(t);
  });
  return [...nonVerbs, ...verbs].join(' ');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_,i) => Array.from({length: n+1}, (_,j) => i===0?j:j===0?i:0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(input) {
  const lower = input.toLowerCase();
  let best = null, bestDist = Infinity;
  for (const key of Object.keys(EN_INDEX)) {
    const dist = levenshtein(lower, key);
    const threshold = Math.max(2, Math.floor(key.length * 0.25));
    if (dist < bestDist && dist <= threshold) { bestDist = dist; best = key; }
  }
  return best ? { key: best, distance: bestDist } : null;
}

export async function translate(input) {
  if (!input || typeof input !== 'string') return { garo: '', method: 'empty', confidence: 0 };

  const cleaned = input.trim();
  const lower = cleaned.toLowerCase();
  const words = lower.split(/\s+/);

  // 1. Corrections
  const correction = corrections?.[lower] || corrections?.[cleaned];
  if (correction) return { garo: correction, method: 'correction', confidence: 1.0 };

  // 1.5 Phrase map
  const phraseMap = lookupPhrase(lower);
  if (phraseMap) return { garo: phraseMap, method: 'phrase-map', confidence: 0.99 };

  // 2. Exact phrase
  const exactPhrase = lookupGaro(lower);
  if (exactPhrase) return { garo: exactPhrase, method: 'exact-phrase', confidence: 0.98 };

  // 3. Single word
  if (words.length === 1) {
    const w = lookupGaro(words[0]);
    if (w) return { garo: w, method: 'exact-word', confidence: 0.95 };
  }

  // 4. Stop-word strip
  const stripped = words.filter(w => !STOP_WORDS.has(w)).join(' ');
  if (stripped && stripped !== lower) {
    const sm = lookupGaro(stripped);
    if (sm) return { garo: sm, method: 'stopword-stripped', confidence: 0.88 };
  }

  // 5. Number engine
  const numResult = translateNumber(cleaned);
  if (numResult) return { garo: numResult, method: 'number-engine', confidence: 0.96 };

  // 6. SOV assembly
  const sov = assembleSentenceSOV(words);
  if (sov) return { garo: sov, method: 'sov-assembly', confidence: 0.75 };

  // 7. Morphology
  const morph = words.map(w => lookupGaro(w) || lookupGaro(w.replace(/ing$|ed$|s$|ly$/,'')) || null).filter(Boolean);
  if (morph.length >= Math.ceil(words.length * 0.5)) return { garo: morph.join(' '), method: 'morphology', confidence: 0.65 };

  // 8. Compound split
  const compound = words.flatMap(w => w.split('-')).map(w => lookupGaro(w)).filter(Boolean);
  if (compound.length) return { garo: compound.join(' '), method: 'compound-split', confidence: 0.60 };

  // 9. Fuzzy
  const fuzzy = fuzzyMatch(lower);
  if (fuzzy) {
    const fg = lookupGaro(fuzzy.key);
    if (fg) return { garo: fg, method: `fuzzy(${fuzzy.key},d=${fuzzy.distance})`, confidence: Math.max(0.40, 0.75 - fuzzy.distance * 0.1) };
  }

  // 10. Gemini
  try {
    const g = await callGemini(cleaned);
    if (g) return { garo: g, method: 'gemini', confidence: 0.60 };
  } catch (_) {}

  // 11. Passthrough
  return { garo: `${cleaned} [UNKNOWN]`, method: 'passthrough', confidence: 0 };
}

export function getAllVocabulary() {
  const entries = [];
  for (const [english, val] of Object.entries(EN_INDEX)) {
    const arr = Array.isArray(val) ? val : [normalizeEntry(val)];
    for (const e of arr) {
      if (e?.garo) entries.push({ english, garo: e.garo, pos: e.pos||null, category: e.category||'uncategorized', classifier: e.classifier||null });
    }
  }
  return entries;
}

export function getByCategory(category) { return getAllVocabulary().filter(e => e.category === category); }
export function getCategories() { return [...new Set(getAllVocabulary().map(e => e.category))].sort(); }
