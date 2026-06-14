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
import CATEGORY_INDEX from './data/category_index.json' with { type: 'json' };
import corrections from './data/corrections.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import { getClassifier, countNoun, parseCountingPhrase } from './garo_classifier.js';
import { toGaroNumber } from './number_engine.js';
import { analyzeSentence } from './gemini.js';

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
  'am','my','your','his','her','its','our','their',
  'this','that','these','those','it','and','but','or',
  'so','as','if','when','then',
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

const IRREGULAR_VERBS = {
  'went':'re·anga','gone':'re·anga','going':'re·angenga',
  'ate':'cha·aha','eaten':'cha·man·aha','eating':'cha·oenga',
  'saw':'nik-aha','seen':'nik-aha','seeing':'nikenga',
  'told':'agan-aha','said':'aganaha','saying':'aganenga',
  'came':'re·ba-aha','coming':'re·baenga','want':'sikenga','wants':'sikenga','need':'sikenga',
  'drank':'ring-aha','drinking':'ringenga',
  'gave':'on·aha','giving':'onenga',
  'ran':'kat-aha','running':'katenga',
  'slept':'tus-aha','sleeping':'tusenga',
  'worked':'dak-aha','working':'dakenga',
  'laughed':'ka·ding-aha','laughing':'ka·dingeng',
  'washed':'su·gala','washing':'su·galenga',
  'bought':'brea-aha','buying':'breaenga',
  'sold':'pala-aha','selling':'palaenga',
  'heard':'knachik-aha','hearing':'knachik-enga',
  'thought':'gisik-aha','thinking':'gisik-o nanga',
  'forgot':'guala','forgetting':'gualenga',
  'cried':'grap-aha','crying':'grapenga',
  'walked':'re·aha','walking':'re·enga',
  'stood':'chadenga','standing':'chadenga',
  'sat':'asong-aha','sitting':'asong-enga',
  'searched':'am-e-nik-na',
  'searching':'am-e-nik-na',
  'gossiped':'a-gan-jo-jo-na',
  'gossiping':'a-gan-jo-jo-na',
  'conquered':'am-na',
  'began':'a-ba-cheng-na',
  'begun':'a-ba-cheng-na',
  'spoke':'a-gan-na',
  'answered':'a-gan-chak-na',
  'discovered':'am-e-nik-na',
};

const POSSESSIVES = {
  'my':'Angni','your':'Nang·ni','his':'Uni','her':'Uni',
  'our':'An·chingni','their':'Uamangni','its':'Uni',
};

const PURPOSE_VERBS = {
  'see':'nik-a-na','eat':'cha·na','drink':'ring·na',
  'meet':'chap·na','buy':'brea·na','sell':'pala·na',
  'go':'re·ang·na','come':'re·ba·na','work':'dak·na',
  'study':'pora·na','pray':'bi·a·na','help':'betoi·na',
  'find':'mia·na','give':'on·a·na','take':'ra·a·na',
};

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
  const classifierHints = [];
  const li = input.toLowerCase();
  if (/\b(dog|cat|cow|bird|fish|animal|insect)\b/.test(li)) classifierHints.push({ classifier: 'mang', reason: 'animal noun' });
  if (/\b(person|man|woman|teacher|student)\b/.test(li)) classifierHints.push({ classifier: 'sak', reason: 'person noun' });
  if (/\b(money|rupee|coin)\b/.test(li)) classifierHints.push({ classifier: 'gong', reason: 'money noun' });
  if (/\b(book|paper|leaf)\b/.test(li)) classifierHints.push({ classifier: 'king', reason: 'flat object' });

  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g,'');
  if (pronounMap[firstWord]) {
    subject = { english: words[0], garo: pronounMap[firstWord] };

    // Find verb — skip stop words and possessives, check irregular first
    let verbIndex = -1;
    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
      if (STOP_WORDS.has(w) || POSSESSIVES[w]) continue;
      const irregGaro = IRREGULAR_VERBS[w];
      const dictGaro = lookupGaro(w);
      if (irregGaro || dictGaro) {
        const garoVerb = irregGaro || dictGaro;
        verb = { english: words[i], garo: garoVerb, tense: detectedTense, garoWithTense: garoVerb, index: i };
        verbIndex = i;
        break;
      }
    }

    // Extract possessive
    let possessive = null;
    for (const w of words) {
      const p = POSSESSIVES[w.toLowerCase()];
      if (p) { possessive = { english: w, garo: p }; break; }
    }

    // Extract object — noun after possessive or after 'to'
    let objectWords = [];
    let purposeAction = null;

    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
      if (w === 'to' && i + 1 < words.length) {
        const nextW = words[i+1].toLowerCase().replace(/[^a-z]/g,'');
        if (PURPOSE_VERBS[nextW]) {
          purposeAction = { english: words[i+1], garo: PURPOSE_VERBS[nextW] };
          i++; continue;
        }
      }
      if (POSSESSIVES[w] || STOP_WORDS.has(w) || w === words[0].toLowerCase()) continue;
      if (verb && words[i] === verb.english) continue;
      if (IRREGULAR_VERBS[w]) continue;
      objectWords.push(words[i]);
    }

    if (objectWords.length > 0) {
      const objEng = objectWords.join(' ');
      const lastWord = objectWords[objectWords.length-1];
      const objGaro = lookupPhrase(objEng) || lookupGaro(objEng) || lookupPhrase(lastWord) || lookupGaro(lastWord) || '[UNKNOWN]';
      object = { english: objEng, garo: objGaro, withMarker: objGaro + '-ko' };
    }

    return {
      wordCount, detectedTense, tenseEvidence,
      garoTenseSuffix: VERB_SUFFIXES[detectedTense] || null,
      structure: subject ? 'SVO → SOV (Garo)' : 'unknown',
      subject, verb, object, possessive, purposeAction, classifierHints,
      garoWordOrder: 'SOV (Subject → Object → Verb)',
      notes: wordCount === 1 ? 'Single word — direct lookup' : wordCount <= 3 ? 'Short phrase' : 'Complex sentence — SOV assembly',
    };
  }



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
  const corrections = EN_INDEX['__corrections__'] || {};
  const translated = content.map(w => {
    const lw = w.toLowerCase().replace(/[^a-z'·]/g,'');
    return lookupPhrase(lw) || lookupGaro(lw)
      || IRREGULAR_VERBS[lw]
      || lookupGaro(lw.replace(/ing$/,'')) || lookupGaro(lw.replace(/ed$/,''))
      || lookupGaro(lw.replace(/s$/,'')) || null;
  });
  const validTranslations = translated.filter(Boolean);
  if (!validTranslations.length) return null;
  // Build result using only words that have translations
  const pairs = content.map((w, i) => ({ eng: w, garo: translated[i] })).filter(p => p.garo);
  if (pairs.every(p => p.garo === p.eng)) return null;
  const verbs = [], nonVerbs = [];
  pairs.forEach(({ eng, garo: t }) => {
    const e = lookup(eng.toLowerCase());
    if (e?.pos === 'verb' || /enga$|aha$|gen$|bo$|na$/.test(t)) verbs.push(t);
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


// ── PURPOSE VERB MAP ─────────────────────────────────────────────────────────
const PURPOSE_MAP = {
  'see':'nina','meet':'chap-na','buy':'brea-na','sell':'pala-na',
  'eat':'cha-na','drink':'ring-na','study':'pora-na','read':'pora-na',
  'work':'dak-na','pray':'bi·a-na','go':'re·ang-na','come':'re·ba-na',
  'help':'betoi-na','find':'mia-na','give':'on·a-na','take':'ra·a-na',
  'speak':'a-gan-na','talk':'a-gan-na','learn':'skia-na','teach':'skia on-na',
  'cook':'song·a·na','wash':'su·gala·na','sleep':'tusia·na','play':'kal·a-na',
  'run':'kat·na','walk':'re·a·na','write':'sea·na','ask':'sing·a·na',
  'answer':'a-gan-chak-na','begin':"a'ba-cheng-na",'start':"a'ba-cheng-na",
  'search':'am-e-nik-na','look':'ni-na','listen':'knachik-na',
  'visit':'nina re·ang-na','sing':'bit-na','dance':'ruru-na',
};

function assembleGrammar(grammar) {
  if (!grammar || !grammar.subject) return null;
  const parts = [];
  parts.push(grammar.subject.garo);

  // Possessive + Object + -ko marker
  if (grammar.possessive && grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '-ko');
  } else if (grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.object.garo.toLowerCase() + '-ko');
  }

  // Purpose clause
  if (grammar.purposeAction) {
    const eng = grammar.purposeAction.english.toLowerCase();
    const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '-na');
    parts.push(purposeGaro);
  }

  // Main verb
  if (grammar.verb) {
    parts.push(grammar.verb.garoWithTense || grammar.verb.garo);
  }

  if (parts.length < 2) return null;
  const result = parts.join(' ');
  if (result.includes('[UNKNOWN]')) return null;
  return result;
}

export async function translate(input) {
  if (!input || typeof input !== 'string') return { garo: '', method: 'empty', confidence: 0 };

  const cleaned = input.trim().replace(/’/g, "'");
  // Normalize: strip apostrophes for lookup consistency
  const normalizedForLookup = cleaned.toLowerCase().replace(/['']/g, '');
  const lower = cleaned.toLowerCase().replace(/[''\u2019]/g, '');
  const words = lower.split(/\s+/);

  // 1. Corrections
  const correction = corrections?.[lower] || corrections?.[cleaned];
  if (correction) return { garo: correction, method: 'correction', confidence: 1.0 };

  // 1.5 Phrase map
  const phraseMap = lookupPhrase(lower);
  if (phraseMap) return { garo: phraseMap, method: 'phrase-map', confidence: 0.99 };

  // 1.6 Classifier counting — "2 dogs", "one teacher", "5 birds"
  const countPhrase = parseCountingPhrase(cleaned);
  if (countPhrase) {
    const singular = countPhrase.englishNoun.replace(/s$/, '');
    const garoNoun = lookupPhrase(countPhrase.englishNoun)
      || lookupGaro(countPhrase.englishNoun)
      || lookupPhrase(singular)
      || lookupGaro(singular);
    if (garoNoun) {
      return {
        garo: countNoun(garoNoun, countPhrase.count, countPhrase.englishNoun),
        method: 'classifier',
        confidence: 0.96,
      };
    }
  }

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
  const numResult = null; // number_engine handles via classifier
  if (numResult) return { garo: numResult, method: 'number-engine', confidence: 0.96 };

  // 6. Grammar assembly — SOV with -ko object marker and -na purpose clause
  const grammar = analyzeGrammar(cleaned);
  const grammarResult = assembleGrammar(grammar);
  if (grammarResult) {
    return { garo: grammarResult, method: 'grammar-assembly', confidence: 0.82 };
  }

  // 6.5 Fallback SOV assembly
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
    const geminiResult = await analyzeSentence(cleaned);
    const g = geminiResult?.correctedInput !== cleaned ? geminiResult?.correctedInput : null;
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

// ── DEFAULT EXPORT — platform adapter layer (Claude B) ────────────────────────
const translationEngine = {
  async translateSentence(text, inputLang = 'en', outputLang = 'garo') {
    if (!text || !text.trim()) return null;
    const r = await translate(text);
    return { translated: r.garo, original: text, breakdown: [], direction: inputLang === 'garo' ? 'garo_to_en' : 'en_to_garo', method: r.method };
  },
  translate(text) {
    return translate(text).then(r => r.garo);
  },
  analyzeGrammar,
  getAllCategories() {
    const fromIndex = [...new Set(Object.values(CATEGORY_INDEX))].sort();
    const fromEngine = getCategories();
    const merged = [...new Set([...fromIndex, ...fromEngine])].filter(Boolean).sort();
    return merged.length > 1 ? merged : fromIndex.length ? fromIndex : ['uncategorized'];
  },
  searchVocabulary(query, lang = 'all', limit = 50) {
    if (!query) return [];
    const q = query.toLowerCase();
    return getAllVocabulary().filter(e => lang === 'garo' ? e.garo.toLowerCase().includes(q) : e.english.toLowerCase().includes(q)).slice(0, limit);
  },
  getCategoryVocabulary(category) {
    const fromEngine = getByCategory(category);
    if (fromEngine.length > 0) return fromEngine;
    // Fallback: use CATEGORY_INDEX to find entries
    const vocab = getAllVocabulary();
    return vocab.filter(e => (CATEGORY_INDEX[e.english.toLowerCase()] || 'uncategorized') === category)
      .map(e => ({ ...e, category }));
  },
  getDictionarySize() { return getAllVocabulary().length; },
  getPhraseSuggestions(query, limit = 10) {
    if (!query) return [];
    return translationEngine.searchVocabulary(query, 'en', limit);
  },
};

export default translationEngine;
