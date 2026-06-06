/**
 * translationEngine.js
 * Claude A — Language & Engine Side
 *
 * Priority cascade (highest → lowest):
 *  1. corrections.json overrides
 *  2. Exact phrase match
 *  3. Exact word match (EN_INDEX)
 *  4. Stop-word strip + retry
 *  5. Number + classifier engine
 *  6. Sentence SOV assembly
 *  7. Morphology analysis
 *  8. Compound split
 *  9. Fuzzy match (Levenshtein)
 * 10. Gemini AI fallback
 * 11. Passthrough + [UNKNOWN]
 */

import compiledDictRaw from './compiled_dict.json';
import corrections from './data/corrections.json';
import { lookupPhrase } from './data/phrase_maps.js';
import { classifyNoun } from './garo_classifier.js';
import { translateNumber } from './number_engine.js';
import { callGemini } from './gemini.js';

// ─── Index build ──────────────────────────────────────────────────────────────
// compiled_dict.json is now: { "english": [{ garo, pos, category, classifier }] }
// Support both old string format and new array format.

function normalizeEntry(val) {
  if (!val) return null;
  if (typeof val === 'string') return { garo: val, pos: null, category: null };
  if (Array.isArray(val)) return val[0]; // best match = first entry
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

// ─── Stop words ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could',
  'should','may','might','shall','can','need','dare','ought',
  'to','of','in','on','at','by','for','with','about','from',
]);

// ─── Verb morphology ──────────────────────────────────────────────────────────

const VERB_SUFFIXES = {
  present:  '-enga',
  past:     '-aha',
  future:   '-gen',
  command:  '-bo',
};

function applyTense(verbRoot, tense) {
  const suffix = VERB_SUFFIXES[tense] || VERB_SUFFIXES.present;
  // Remove bare suffix indicator from root if present
  const clean = verbRoot.replace(/[-·](enga|aha|gen|bo)$/, '');
  return clean + suffix.replace('-', '');
}

// ─── Grammar analysis ─────────────────────────────────────────────────────────

/**
 * analyzeGrammar(input)
 * Returns structural analysis of the English input and how Garo grammar applies.
 * No longer a stub — returns real analysis.
 */
export function analyzeGrammar(input) {
  if (!input || typeof input !== 'string') return null;

  const words = input.trim().split(/\s+/);
  const wordCount = words.length;

  // Detect tense from English
  let detectedTense = 'present';
  let tenseEvidence = null;

  if (/\b(will|shall|going to|gonna)\b/i.test(input)) {
    detectedTense = 'future';
    tenseEvidence = input.match(/\b(will|shall|going to|gonna)\b/i)?.[0];
  } else if (/\b(was|were|had|did|went|came|said|ate|drank|ran|walked)\b/i.test(input)) {
    detectedTense = 'past';
    tenseEvidence = input.match(/\b(was|were|had|did|went|came|said|ate|drank|ran|walked)\b/i)?.[0];
  } else if (/\b(please|do it|now|immediately)\b/i.test(input) && wordCount <= 4) {
    detectedTense = 'command';
    tenseEvidence = 'imperative mood detected';
  }

  // Detect sentence structure
  let structure = 'unknown';
  let subject = null, verb = null, object = null;

  // Simple SVO detection for short sentences
  if (wordCount >= 2 && wordCount <= 8) {
    const pronounMap = {
      'i': 'Anga', 'me': 'Anga',
      'you': 'Na·a',
      'he': 'Ua', 'she': 'Ua', 'it': 'Ua',
      'we': 'An·ching', 'us': 'An·ching',
      'they': 'Bisong', 'them': 'Bisong',
    };

    const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, '');
    if (pronounMap[firstWord]) {
      subject = { english: words[0], garo: pronounMap[firstWord] };
      structure = 'SVO → SOV (Garo)';
    }

    // Identify likely verb (second word if subject found, or any known verb)
    if (subject && wordCount >= 2) {
      const potentialVerb = words[1].toLowerCase().replace(/[^a-z]/g, '');
      const verbGaro = lookupGaro(potentialVerb);
      if (verbGaro) {
        verb = {
          english: words[1],
          garo: verbGaro,
          tense: detectedTense,
          garoWithTense: applyTense(verbGaro, detectedTense),
        };
      }
    }

    // Object = remaining words after subject + verb
    if (subject && verb && wordCount > 2) {
      const objWords = words.slice(2).join(' ');
      const objGaro = lookupGaro(objWords);
      object = {
        english: objWords,
        garo: objGaro || '[UNKNOWN]',
      };
    }
  }

  // Classifier detection
  const classifierHints = [];
  const lowerInput = input.toLowerCase();
  if (/\b(dog|cat|cow|goat|pig|bird|fish|animal|insect|bee|ant|snake)\b/.test(lowerInput))
    classifierHints.push({ classifier: 'mang', reason: 'animal noun detected' });
  if (/\b(person|man|woman|boy|girl|child|teacher|student|pastor|farmer)\b/.test(lowerInput))
    classifierHints.push({ classifier: 'sak', reason: 'person noun detected' });
  if (/\b(money|rupee|coin|paisa|taka)\b/.test(lowerInput))
    classifierHints.push({ classifier: 'gong', reason: 'money noun detected' });
  if (/\b(book|paper|letter|leaf|card|page|cloth|mat|board)\b/.test(lowerInput))
    classifierHints.push({ classifier: 'king', reason: 'flat object detected' });
  if (/\b(stick|pole|rod|bamboo|tree|branch|pipe|tube|pen|pencil)\b/.test(lowerInput))
    classifierHints.push({ classifier: 'brong', reason: 'long object detected' });

  // Number detection
  const numberMatch = input.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/i);

  return {
    wordCount,
    detectedTense,
    tenseEvidence,
    garoTenseSuffix: VERB_SUFFIXES[detectedTense] || null,
    structure,
    subject,
    verb,
    object,
    classifierHints,
    numberDetected: numberMatch ? numberMatch[0] : null,
    garoWordOrder: 'SOV (Subject → Object → Verb)',
    notes: wordCount === 1
      ? 'Single word — direct lookup'
      : wordCount <= 3
      ? 'Short phrase — direct lookup + SOV assembly'
      : 'Complex sentence — SOV assembly with morphology',
  };
}

// ─── SOV assembly ─────────────────────────────────────────────────────────────

function assembleSentenceSOV(words) {
  // Filter stop words, keep content words
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  if (content.length === 0) return null;

  const translated = content.map(w => lookupGaro(w) || w);
  if (translated.every(t => content.includes(t))) return null; // nothing translated

  // SOV: put verbs at end
  const verbs = [];
  const nonVerbs = [];
  translated.forEach((t, i) => {
    const original = content[i].toLowerCase();
    const entry = lookup(original);
    if (entry?.pos === 'verb' || /enga$|aha$|gen$|bo$/.test(t)) {
      verbs.push(t);
    } else {
      nonVerbs.push(t);
    }
  });

  return [...nonVerbs, ...verbs].join(' ');
}

// ─── Levenshtein fuzzy match ──────────────────────────────────────────────────

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(input) {
  const lower = input.toLowerCase();
  let best = null, bestDist = Infinity;
  for (const key of Object.keys(EN_INDEX)) {
    const dist = levenshtein(lower, key);
    const threshold = Math.max(2, Math.floor(key.length * 0.25));
    if (dist < bestDist && dist <= threshold) {
      bestDist = dist;
      best = key;
    }
  }
  return best ? { key: best, distance: bestDist } : null;
}

// ─── Main translate() ─────────────────────────────────────────────────────────

export async function translate(input) {
  if (!input || typeof input !== 'string') {
    return { garo: '', method: 'empty', confidence: 0 };
  }

  const cleaned = input.trim();
  const lower = cleaned.toLowerCase();
  const words = lower.split(/\s+/);

  // 1. Corrections override
  const correction = corrections[lower] || corrections[cleaned];
  if (correction) {
    return { garo: correction, method: 'correction', confidence: 1.0 };
  }

  // 1.5 Verified phrase map (curated, higher confidence than compiled dict)
  const phraseMapResult = lookupPhrase(lower);
  if (phraseMapResult) {
    return { garo: phraseMapResult, method: 'phrase-map', confidence: 0.99 };
  }

  // 2. Exact phrase match
  const exactPhrase = lookupGaro(lower);
  if (exactPhrase) {
    return { garo: exactPhrase, method: 'exact-phrase', confidence: 0.98 };
  }

  // 3. Exact single word
  if (words.length === 1) {
    const wordMatch = lookupGaro(words[0]);
    if (wordMatch) {
      return { garo: wordMatch, method: 'exact-word', confidence: 0.95 };
    }
  }

  // 4. Stop-word strip + retry
  const stripped = words.filter(w => !STOP_WORDS.has(w)).join(' ');
  if (stripped && stripped !== lower) {
    const strippedMatch = lookupGaro(stripped);
    if (strippedMatch) {
      return { garo: strippedMatch, method: 'stopword-stripped', confidence: 0.88 };
    }
  }

  // 5. Number + classifier engine
  const numberResult = translateNumber(cleaned);
  if (numberResult) {
    return { garo: numberResult, method: 'number-engine', confidence: 0.96 };
  }

  // 6. SOV sentence assembly
  const sovResult = assembleSentenceSOV(words);
  if (sovResult) {
    return { garo: sovResult, method: 'sov-assembly', confidence: 0.75 };
  }

  // 7. Morphology — try word-by-word with suffix detection
  const morphResult = words
    .map(w => lookupGaro(w) || lookupGaro(w.replace(/ing$|ed$|s$|ly$/, '')) || null)
    .filter(Boolean);
  if (morphResult.length > 0 && morphResult.length >= Math.ceil(words.length * 0.5)) {
    return { garo: morphResult.join(' '), method: 'morphology', confidence: 0.65 };
  }

  // 8. Compound split — try breaking hyphenated or compound words
  const compound = words.flatMap(w => w.split('-')).map(w => lookupGaro(w)).filter(Boolean);
  if (compound.length > 0) {
    return { garo: compound.join(' '), method: 'compound-split', confidence: 0.60 };
  }

  // 9. Fuzzy match
  const fuzzy = fuzzyMatch(lower);
  if (fuzzy) {
    const fuzzyGaro = lookupGaro(fuzzy.key);
    if (fuzzyGaro) {
      return {
        garo: fuzzyGaro,
        method: `fuzzy(${fuzzy.key}, d=${fuzzy.distance})`,
        confidence: Math.max(0.40, 0.75 - fuzzy.distance * 0.1),
      };
    }
  }

  // 10. Gemini fallback
  try {
    const geminiResult = await callGemini(cleaned);
    if (geminiResult) {
      return { garo: geminiResult, method: 'gemini', confidence: 0.60 };
    }
  } catch (_) {
    // Gemini unavailable — fall through
  }

  // 11. Passthrough
  return {
    garo: `${cleaned} [UNKNOWN]`,
    method: 'passthrough',
    confidence: 0,
  };
}

// ─── Vocabulary access ────────────────────────────────────────────────────────

export function getAllVocabulary() {
  const entries = [];
  for (const [english, val] of Object.entries(EN_INDEX)) {
    const arr = Array.isArray(val) ? val : [normalizeEntry(val)];
    for (const e of arr) {
      if (e?.garo) {
        entries.push({
          english,
          garo: e.garo,
          pos: e.pos || null,
          category: e.category || 'uncategorized',
          classifier: e.classifier || null,
        });
      }
    }
  }
  return entries;
}

export function getByCategory(category) {
  return getAllVocabulary().filter(e => e.category === category);
}

export function getCategories() {
  const cats = new Set(getAllVocabulary().map(e => e.category));
  return [...cats].sort();
}
