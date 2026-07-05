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
import ALTERNATES_RAW from './compiled_dict_alternates.json' with { type: 'json' };
import CATEGORY_INDEX from './data/category_index.json' with { type: 'json' };
import correctionsRaw from './data/corrections.json' with { type: 'json' };
// Shadow index: apostrophe-stripped keys for typo tolerance (lets go -> let's go)
const corrections = { ...correctionsRaw };
for (const [k, v] of Object.entries(correctionsRaw)) {
  const stripped = k.toLowerCase().replace(/['’]/g, '');
  if (stripped !== k.toLowerCase() && !corrections[stripped]) corrections[stripped] = v;
}
import { lookupPhrase } from './data/phrase_maps.js';
import { getClassifier, countNoun, parseCountingPhrase } from './garo_classifier.js';
import { toGaroNumber } from './number_engine.js';
// Gemini import removed 2026-07-05 (dead fallback, see step 10 below)

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
  // Check corrections.json first — single-word keys were previously
  // bypassed here since EN_INDEX is built only from compiled_dict.json.
  // This meant confirmed corrections only took effect in the top-level
  // translate() fast-path, not in findVerbForm/grammar-assembly which
  // call lookupGaro() directly.
  const k = key.toLowerCase().trim();
  if (corrections[k]) return corrections[k];
  const e = lookup(k);
  return e ? e.garo : null;
}

const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being',
  'do','does','did','would','could',
  'should','may','might','shall','can','to','of','in','on',
  'at','by','for','with','about','from',
  'am','its',
  'this','that','these','those','it','and','but','or',
  'so','as','if','when','then',
  "don't","doesn't","didn't","won't","can't","isn't","aren't","wasn't","weren't",
  // Apostrophe-free duplicates of the above — two of the four STOP_WORDS
  // check sites (verb-finding loop, object-extraction loop) strip all
  // non-letter characters via /[^a-z]/g before checking, which turns
  // "didn't" into "didnt" — meaning the apostrophe forms above never
  // actually matched at those sites. This is why "he didn't eat" was
  // still picking up "didn't" as a stray object word ([UNKNOWN]·ko)
  // even after the apostrophe forms were added.
  "dont","doesnt","didnt","wont","cant","isnt","arent","wasnt","werent",
]);
// possessive pronouns (my/your/his/her/our/their) removed from STOP_WORDS
// negation contractions added — negation is handled via isNegative/-gija
// suffix, so these auxiliary+not words are meaningless once extracted and
// were previously falling through into object detection as [UNKNOWN]
// (e.g. "i didn't eat" -> object: "didn't" -> "[UNKNOWN]·ko").

const VERB_SUFFIXES = {
  present: 'enga', past: '·a', past_alt: 'aha',
  future: 'gen', command: 'bo',
};

const PRONOUN_MAP = {
  'i':'Anga','me':'angko','you':'Na·a','he':'Ua','she':'Ua',
  'it':'Ua','we':'An·ching','us':'An·ching·ko','they':'Uamang','them':'Uamang·ko',
};

function applyTense(verbRoot, tense) {
  // NOTE: 'jaha' is NOT past negation — it's discontinuation ("stopped X-ing").
  // See docs/THANGSENG_RULES_LOOKUP.md Rule 17 (corrected 2026-07-04).
  // True simple past negation has no confirmed suffix yet — do not add one here
  // without native-speaker confirmation.
  const suffixes = { present: 'a', past: 'ha', future: 'gen', command: 'bo', negative_future: 'jawa', negative_command: 'nabe', discontinued: 'jaha', completed: 'manaha', chim: 'chim', pastcont: 'engachim' };
  const suffix = suffixes[tense] || suffixes.present;
  // THANGSENG EXCEPTION (2026-07-03): 'ha' is added WITHOUT stripping the root letter.
  // ringa + ha = ringaha (NOT ring + aha)
  // cha·a + ha = cha·aha (NOT cha· + aha)
  // This is an exception to the stem rule — ha appends to the FULL root form.
  // All other suffixes (gen/bo/na/ja/jawa/nabe) still strip the trailing 'a' first.
  if (tense === 'past') return verbRoot + 'ha';
  // 'chim' exception (2026-07-04 fix): same family as 'ha' — appends to the
  // FULL root, not stripped. Was 'cha·a'->'cha·chim' (wrong), now
  // 'cha·a'->'cha·achim' (correct).
  if (tense === 'chim') return verbRoot + 'chim';
  // pastcont: NOT a fused suffix. Native-confirmed form is
  // [progressive-form] + ' chim' (two words) — e.g. 'Anga poraienga chim'.
  // Must run BEFORE the "already inflected" guard below: a pre-inflected
  // progressive irregular (e.g. 'asongenga') would otherwise match that
  // guard and return unchanged, silently dropping ' chim' (2026-07-04 fix).
  if (tense === 'pastcont') {
    if (/enga$|enge$/.test(verbRoot)) return verbRoot + ' chim';
    const prog = /·a$/.test(verbRoot) ? verbRoot.slice(0, -1) + 'enga'
      : /[^·]a$/.test(verbRoot) ? verbRoot.slice(0, -1) + 'enga'
      : verbRoot + 'enga';
    return prog + ' chim';
  }
  // If already inflected, return as-is
  if (/·a$/.test(verbRoot)) return verbRoot.slice(0, -1) + suffix;  // raka: cha·a -> cha·gen
  if (/[^·]a$/.test(verbRoot)) return verbRoot.slice(0, -1) + suffix; // plain: Tusia -> Tusigen
  return verbRoot + suffix;
}

const IRREGULAR_VERBS = {
  'went':'re·anga','gone':'re·anga','going':'re·angenga',
  'ate':'cha·aha','eaten':'cha·manaha','eating':'cha·enga',
  'saw':'nikaha','seen':'nikaha','seeing':'nikenga',
  'told':'agan·aha','said':'aganaha','saying':'aganenga',
  'came':'re·ba·aha','coming':'re·baenga','want':'sikenga','wants':'sikenga','need':'sikenga',
  'drank':'ring·aha','drinking':'ringenga',
  'gave':'on·aha','giving':'onenga',
  'ran':'kataha','running':'katenga',
  'slept':'tus·aha','sleeping':'tusenga',
  'worked':'dakaha','working':'dakenga',
  'laughed':'ka·ding·aha','laughing':'ka·dingeng',
  'washed':'su·gala','washing':'su·galenga',
  'bought':'brea·aha','buying':'breaenga',
  'sold':'pala·aha','selling':'palaenga',
  'heard':'knachik·aha','hearing':'knachik·enga',
  'thought':'gisik·aha','thinking':'gisik·o nanga',
  'forgot':'guala','forgetting':'gualenga',
  'cried':'grap·aha','crying':'grapenga',
  'walked':'re·aha','walking':'re·enga',
  'stood':'chadenga','standing':'chadenga',
  'sat':'asong·aha','sitting':'asong·enga',
  'searched':'am·e·nik·na',
  'searching':'am·e·nik·na',
  'gossiped':'a·gan·jo·jo·na',
  'gossiping':'a·gan·jo·jo·na',
  'conquered':'am·na',
  'began':'a·ba·cheng·na',
  'begun':'a·ba·cheng·na',
  'spoke':'a·gan·na',
  'answered':'a·gan·chak·na',
  'discovered':'am·e·nik·na',
};

const POSSESSIVES = {
  'my':'Angni','your':'Nang·ni','his':'Uni','her':'Uni',
  'our':'An·chingni','their':'Uamangni','its':'Uni',
};

const PURPOSE_VERBS = {
  'see':'nik·a·na','eat':'cha·na','drink':'ring·na',
  'meet':'chap·na','buy':'brea·na','sell':'pala·na',
  'go':'re·ang·na','come':'re·ba·na','work':'dakna',
  'study':'pora·na','pray':'bi·a·na','help':'betoi·na',
  'find':'mia·na','give':'on·a·na','take':'ra·a·na',
};

function findVerbForm(w) {
  if (IRREGULAR_VERBS[w]) return IRREGULAR_VERBS[w];
  if (lookupGaro(w)) return lookupGaro(w);
  const stripped = w.replace(/ing$|ed$|es$|s$/, '');
  if (stripped !== w) {
    if (IRREGULAR_VERBS[stripped]) return IRREGULAR_VERBS[stripped];
    if (lookupGaro(stripped)) return lookupGaro(stripped);
  }
  return null;
}

export function analyzeGrammar(input) {
  if (!input || typeof input !== 'string') return null;
  const words = input.trim().split(/\s+/);
  const wordCount = words.length;

  const isNegative = /n't|\b(not|never)\b/i.test(input);

  let detectedTense = 'present';
  let tenseEvidence = null;

  // Task 3 (chim/engachim assembly-path detection): checked BEFORE the
  // generic future/past checks below since "used to" and "was/were VERBing"
  // would otherwise be swallowed by the broader will/was/were matches.
  if (/\bused to\b/i.test(input)) {
    detectedTense = 'chim';
    tenseEvidence = 'used to';
  } else if (/\b(was|were)\b\s+\w+ing\b/i.test(input)) {
    detectedTense = 'pastcont';
    tenseEvidence = input.match(/\b(was|were)\b\s+\w+ing\b/i)?.[0];
  } else if (/\b(stopped|quit)\b|\bno longer\b/i.test(input)) {
    // Task 0: discontinuation ("stopped X-ing") -> jaha, per corrected Rule 17.
    detectedTense = 'discontinued';
    tenseEvidence = input.match(/\b(stopped|quit|no longer)\b/i)?.[0];
  } else if (/\b(finished|completed)\b/i.test(input)) {
    // Task 0: completed action ("finished/completed X-ing") -> manaha, Rule 25.
    detectedTense = 'completed';
    tenseEvidence = input.match(/\b(finished|completed)\b/i)?.[0];
  } else if (/\b(will|shall|going to)\b/i.test(input)) {
    detectedTense = 'future';
    tenseEvidence = input.match(/\b(will|shall|going to)\b/i)?.[0];
  } else if (/\b(was|were|had|did|went|came|ate|drank)\b/i.test(input)) {
    detectedTense = 'past';
    tenseEvidence = input.match(/\b(was|were|had|did|went|came|ate|drank)\b/i)?.[0];
  } else if (/\b(please)\b/i.test(input) && wordCount <= 4) {
    detectedTense = 'command';
  }

  let subject = null, verb = null, object = null;
  const classifierHints = [];
  const li = input.toLowerCase();
  if (/\b(dog|cat|cow|bird|fish|animal|insect)\b/.test(li)) classifierHints.push({ classifier: 'mang', reason: 'animal noun' });
  if (/\b(person|man|woman|teacher|student)\b/.test(li)) classifierHints.push({ classifier: 'sak', reason: 'person noun' });
  if (/\b(money|rupee|coin)\b/.test(li)) classifierHints.push({ classifier: 'gong', reason: 'money noun' });
  if (/\b(book|paper|leaf)\b/.test(li)) classifierHints.push({ classifier: 'king', reason: 'flat object' });

  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g,'');
  if (PRONOUN_MAP[firstWord]) {
    subject = { english: words[0], garo: PRONOUN_MAP[firstWord] };

    // Find verb — skip stop words, possessives, and auxiliary tense markers
    const AUXILIARY_SKIP = new Set(['will','shall','going','would','could','should','may','might','can','used','to','stopped','quit','finished','completed','longer']);
    let verbIndex = -1;
    const SPECIAL_TENSES = ['discontinued','completed','chim','pastcont'];
    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
      if (STOP_WORDS.has(w) || POSSESSIVES[w] || AUXILIARY_SKIP.has(w)) continue;
      let isIrregular = !!IRREGULAR_VERBS[w] || !!IRREGULAR_VERBS[w.replace(/ing$|ed$|es$|s$/, '')];
      let garoVerb;
      if (SPECIAL_TENSES.includes(detectedTense)) {
        // Pre-inflected IRREGULAR_VERBS forms (e.g. "eating"->"cha·enga")
        // can't be safely re-suffixed with jaha/manaha/chim/engachim — go
        // straight to the dictionary root (present-tense) form instead.
        const rootWord = w.replace(/ing$|ed$|es$|s$/, '');
        garoVerb = lookupGaro(rootWord) || lookupGaro(w);
        if (garoVerb) isIrregular = false;
        else garoVerb = findVerbForm(w);
      } else {
        garoVerb = findVerbForm(w);
      }
      if (garoVerb) {
        let garoWithTense = garoVerb;
        // Rule 5 (confirmed): future negative is stem+jawa directly, e.g.
        // 'cha·jawa' = will not eat, 'ringjawa' = will not drink — NOT
        // future(gen) with negative(ja) stacked on top, which produced
        // malformed forms like 'Cha·genja' (bug found 2026-07-05).
        if (isNegative && detectedTense === 'future' && !isIrregular) {
          garoWithTense = applyTense(garoVerb, 'negative_future');
          verb = { english: words[i], garo: garoVerb, tense: 'negative_future', garoWithTense, isNegative, index: i };
          verbIndex = i;
          break;
        }
        if (!isIrregular && ['future', ...SPECIAL_TENSES].includes(detectedTense)) {
          garoWithTense = applyTense(garoVerb, detectedTense);
        }
        if (isNegative) {
          // Rule 18 (corrected 2026-07-04): gija is a verbal adjective, not a
          // negation marker — it needs a governing main verb ("dakgija
          // dongaha" = stayed without doing), which general negated input
          // doesn't supply. No confirmed suffix exists for true simple past
          // negation (Rule 25 outstanding item), so 'ja' (Rule 1, confirmed
          // present negation) is used as the safe fallback instead of the
          // previously-misused 'gija'.
          const base = garoWithTense.replace(/·a$/, '·').replace(/a$/, '');
          garoWithTense = base.includes('·') ? base + 'ja' : garoWithTense.replace(/a$/, '') + 'ja';
        }
        verb = { english: words[i], garo: garoVerb, tense: detectedTense, garoWithTense, isNegative, index: i };
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
      const prevW = i > 0 ? words[i-1].toLowerCase().replace(/[^a-z]/g,'') : '';
      if (w === 'to' && i + 1 < words.length && prevW !== 'used') {
        const nextW = words[i+1].toLowerCase().replace(/[^a-z]/g,'');
        if (PURPOSE_VERBS[nextW]) {
          purposeAction = { english: words[i+1], garo: PURPOSE_VERBS[nextW] };
          i++; continue;
        }
      }
      if (POSSESSIVES[w] || STOP_WORDS.has(w) || AUXILIARY_SKIP.has(w) || w === words[0].toLowerCase()) continue;
      if (verb && words[i] === verb.english) continue;
      if (IRREGULAR_VERBS[w] || IRREGULAR_VERBS[w.replace(/ing$|ed$|es$|s$/, '')]) continue;
      objectWords.push(words[i]);
    }

    if (objectWords.length > 0) {
      const objEng = objectWords.join(' ');
      const lastWord = objectWords[objectWords.length-1];
      const objGaro = lookupPhrase(objEng) || lookupGaro(objEng) || lookupPhrase(lastWord) || lookupGaro(lastWord) || '[UNKNOWN]';
      object = { english: objEng, garo: objGaro, withMarker: objGaro + '·ko' };
    }

    return {
      wordCount, detectedTense, tenseEvidence, isNegative,
      garoTenseSuffix: VERB_SUFFIXES[detectedTense] || null,
      structure: subject ? 'SVO → SOV (Garo)' : 'unknown',
      subject, verb, object, possessive, purposeAction, classifierHints,
      garoWordOrder: 'SOV (Subject → Object → Verb)',
      notes: wordCount === 1 ? 'Single word — direct lookup' : wordCount <= 3 ? 'Short phrase' : 'Complex sentence — SOV assembly',
    };
  }



  return {
    wordCount, detectedTense, tenseEvidence, isNegative,
    garoTenseSuffix: VERB_SUFFIXES[detectedTense] || null,
    structure: subject ? 'SVO → SOV (Garo)' : 'unknown',
    subject, verb, object, classifierHints,
    garoWordOrder: 'SOV (Subject → Object → Verb)',
    notes: wordCount === 1 ? 'Single word — direct lookup' : wordCount <= 3 ? 'Short phrase' : 'Complex sentence — SOV assembly',
  };
}

// Rule 18 positive construction: "without VERB-ing" -> stem+gija (verbal
// adjective), paired with the sentence's main finite verb. a38749b only
// fixed the negation-misuse half of gija (stopped mistranslating "not X" as
// gija); this is the actual positive construction gija exists for.
// Confirmed pattern: "Ua an·tangni kamko dakgija dongaha" =
// "She stayed without doing her work" (dakgija = without doing, dongaha =
// stayed/the main verb).
function tryWithoutGijaConstruction(input) {
  const m = input.match(/\bwithout\s+([a-z]+)ing\b(?:\s+(?:his|her|their|its|my|your)\s+([a-z]+))?/i);
  if (!m) return null;
  const clauseVerbWord = m[1].toLowerCase();
  const clauseObjectWord = m[2] ? m[2].toLowerCase() : null;

  const clauseVerbGaro = lookupGaro(clauseVerbWord) || lookupGaro(clauseVerbWord + 'e');
  if (!clauseVerbGaro) return null;
  const stem = clauseVerbGaro.replace(/·a$/, '·').replace(/a$/, '');
  const gijaForm = stem + 'gija';

  const words = input.replace(/[.,!?]/g, '').split(/\s+/);
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, '');
  const subjectGaro = PRONOUN_MAP[firstWord] || null;

  const remainder = input.replace(m[0], '').trim();
  const remWords = remainder.split(/\s+/).filter(Boolean);
  let mainVerbGaro = null;
  for (let i = remWords.length - 1; i >= 0; i--) {
    const w = remWords[i].toLowerCase().replace(/[^a-z]/g, '');
    if (!w || STOP_WORDS.has(w) || w === firstWord) continue;
    const g = findVerbForm(w);
    if (g) { mainVerbGaro = applyTense(g, 'past'); break; }
  }
  if (!mainVerbGaro) return null;

  const objGaro = clauseObjectWord && lookupGaro(clauseObjectWord)
    ? lookupGaro(clauseObjectWord) + 'ko' : null;

  const parts = [subjectGaro, objGaro, gijaForm, mainVerbGaro].filter(Boolean);
  return parts.length >= 2 ? parts.join(' ') : null;
}

function assembleSentenceSOV(words, isNegative = false) {
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
    // Original regex only caught enga/aha/gen/bo/na endings and missed the
    // common present-tense pattern (root+raka+a, e.g. "Cha·a", "Re·a") —
    // meaning words like "eat"/"go" were classified as nonVerbs here and
    // never received tense/negation suffixes at all. Added ·a as a verb
    // signal (raka immediately before a trailing 'a').
    if (e?.pos === 'verb' || /enga$|aha$|gen$|bo$|na$|·a$/.test(t)) verbs.push(t);
    else nonVerbs.push(t);
  });
  // Apply negation suffix to the verb, same convention as analyzeGrammar's
  // main path (fixes the gap Claude B found: this fallback function had
  // zero negation awareness, so "didn't eat" / "doesn't understand" lost
  // their negation entirely once 8ead984 added the contractions to
  // STOP_WORDS — they were stripped here with nothing left to signal them).
  // Rule 18 (corrected 2026-07-04): 'ja' replaces 'gija' here for the same
  // reason as the main analyzeGrammar path — gija is a verbal adjective
  // needing a governing main verb, not a general negation marker. Also
  // fixes a latent stripping bug: this fallback previously appended
  // '·gija' without first stripping the trailing vowel (Rule 15 stem
  // rule), producing malformed double-raka forms like "Cha·a·gija".
  if (isNegative && verbs.length) {
    const v = verbs[verbs.length - 1];
    const base = v.replace(/·a$/, '·').replace(/a$/, '');
    verbs[verbs.length - 1] = base.includes('·') ? base + 'ja' : v.replace(/a$/, '') + 'ja';
  } else if (isNegative && !verbs.length && nonVerbs.length) {
    // Bare-noun negation fallback: "not water"/"not rice" have no verb or
    // ·a-suffixed adjective to attach ·gija to, and "not" itself has no
    // dictionary entry, so it was being silently dropped entirely (unlike
    // "no water", which works only because "no" happens to be a real
    // dictionary word -> "Ong·ja"). Reuse that same already-verified word
    // rather than inventing new grammar — "not" and "no" are functionally
    // synonymous in this construction.
    const ongja = lookupGaro('no');
    if (ongja) nonVerbs.unshift(ongja);
  }
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
    // Short words need tighter threshold to avoid false matches (rnu->rat not run)
    const threshold = key.length <= 4 ? 1 : Math.max(2, Math.floor(key.length * 0.25));
    if (dist < bestDist && dist <= threshold) { bestDist = dist; best = key; }
  }
  return best ? { key: best, distance: bestDist } : null;
}


// ── PURPOSE VERB MAP ─────────────────────────────────────────────────────────
const PURPOSE_MAP = {
  'see':'nina','meet':'chap·na','buy':'brea·na','sell':'pala·na',
  'eat':'cha·na','drink':'ring·na','study':'pora·na','read':'pora·na',
  'work':'dakna','pray':'bi·a·na','go':'re·ang·na','come':'re·ba·na',
  'help':'betoi·na','find':'mia·na','give':'on·a·na','take':'ra·a·na',
  'speak':'a·gan·na','talk':'a·gan·na','learn':'skia·na','teach':'skia on·na',
  'cook':'song·a·na','wash':'su·gala·na','sleep':'tusia·na','play':'kal·a·na',
  'run':'kat·na','walk':'re·a·na','write':'sea·na','ask':'sing·a·na',
  'answer':'a·gan·chak·na','begin':"a'ba·cheng·na",'start':"a'ba·cheng·na",
  'search':'am·e·nik·na','look':'ni·na','listen':'knachik·na',
  'visit':'nina re·ang·na','sing':'bit·na','dance':'ruru·na',
};

function assembleGrammar(grammar) {
  if (!grammar || !grammar.subject) return null;
  const parts = [];
  parts.push(grammar.subject.garo);

  // Possessive + Object + -ko marker
  if (grammar.possessive && grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + '·ko');
  } else if (grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.object.garo.toLowerCase() + '·ko');
  }

  // Purpose clause
  if (grammar.purposeAction) {
    const eng = grammar.purposeAction.english.toLowerCase();
    const purposeGaro = PURPOSE_MAP[eng] || grammar.purposeAction.garo || (eng + '·na');
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


// Input normalization — apostrophe contraction expansion
function normalizeInput(text) {
  // Case-preserving contraction expansion (e.g. "didnt" -> "didn't").
  // Previously this function forced lowercase, which meant it could never
  // be safely called from translate() without breaking exact-case
  // correction lookups and analyzeGrammar's capitalization-sensitive
  // parsing — that's why it was left unwired as dead code. Using
  // case-insensitive regex flags instead of .toLowerCase() keeps the
  // original casing intact while still expanding contractions.
  return text
    .replace(/\blets\b/gi, "let's")
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bdoesnt\b/gi, "doesn't")
    .replace(/\bdidnt\b/gi, "didn't")
    .replace(/\bcant\b/gi, "can't")
    .replace(/\bwont\b/gi, "won't")
    .replace(/\bisnt\b/gi, "isn't")
    .replace(/\barent\b/gi, "aren't")
    .replace(/\bwasnt\b/gi, "wasn't")
    .replace(/\bwerent\b/gi, "weren't")
    .replace(/\bim\b(?=\s)/gi, "i'm")
    .trim();
}


// ── Algorithmic past tense (Burling GOLD: root + -aha) ───────────────────────
const PAST_TO_ROOT = {
  'ate':'cha·','went':'re·ang','ran':'kat','came':'reba',
  'saw':'nik·','gave':'on·','said':'agan','drank':'ring·',
  'bit':'chika','slept':'tusi','bought':'brea','fell':'ga·ak',
  'wore':'gim·','spoke':'agan','told':'agan','heard':'knachik·',
  'thought':'gisik·','forgot':'gua','cried':'grap·','washed':'su·gal',
  'sold':'pal·','taught':'ski·','learned':'ski·','prayed':'bi·a',
  'sang':'bit·','danced':'ruru','sat':'asong·','stood':'chadat',
};

// ── Algorithmic progressive (Burling GOLD: root + -enga for A'chik) ───────────
const PROGRESSIVE_MAP = {
  'eating':'cha·enga','going':'re·angenga','running':'katenga',
  'sleeping':'tusienga','coming':'rebaenga','drinking':'ringenga',
  'working':'dakenga','studying':'poraenga','praying':'bi·aenga',
  'speaking':'aganenga','listening':'knachik·enga','looking':'ni·enga',
  'cooking':'song·enga','washing':'su·galaenga','buying':'breaenga',
  'selling':'palaenga','teaching':'skiaenga','learning':'skiaenga',
  'playing':'kal·enga','sitting':'asongenga','standing':'chadatenga',
  'waiting':'sengenga','laughing':'ka·dingenga','crying':'grapenga',
  'walking':'re·enga','writing':'seaenga','reading':'poraenga',
  'singing':'bitenga','dancing':'ruruaenga','helping':'betoienga',
};

// Connective words this function knows how to split on, with their
// Garo translations (sourced from corrections.json — these are the
// same native-speaker-verified words already used as bare-word
// translations: and=Aro, but=Indiba, or=ba, so=Uni gimin).
//
// "if" is handled separately by translateIfClause() below — it is NOT
// a leading connective word like the others. Native speaker confirmed
// 2026-06-28/29: "-ode" is a SUFFIX attached to the condition clause's
// verb stem (cha· + ode = cha·ode = "if eat"), not a standalone word
// placed at the front of the sentence. It can also attach to an object
// noun's existing accusative suffix (mi+ko+ode = mikode, "if [object]
// rice"). This was previously modeled as LEADING_CONNECTIVES: {if:'Ode'}
// — confirmed structurally wrong, not just buggy; removed entirely.
const MID_JOIN_CONNECTIVES = {
  'and': 'Aro',
  'but': 'Indiba',
  'or': 'ba',
  'so': 'Uni gimin',
};

// Strips a verb's bare root-form final "a" to get its stem for suffix
// attachment, per the confirmed pattern: Cha·a (eat) -> stem Cha· ->
// Cha·ode (if eat). Kata (run, no raka) -> stem Kat -> Katode. Only
// strips a single trailing "a" — does not touch the raka mark itself,
// consistent with "raka is part of the root, suffixes never carry it."
function stripToStem(garoWord) {
  if (!garoWord) return garoWord;
  return garoWord.replace(/a$/i, '');
}

// Implements the confirmed -ode if-clause pattern. Only activates when
// the input starts with "if" (English-side trigger), otherwise returns
// null and the normal cascade continues. Translates the condition
// clause's final word via the existing pipeline, strips it to its stem,
// and appends "ode" — does NOT invent any new Garo vocabulary, only
// reshapes an already-correctly-translated word per a confirmed suffix
// rule. The consequence clause is translated entirely normally.
async function translateIfClause(input) {
  const words = input.trim().split(/\s+/);
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, ''));
  if (lowerWords[0] !== 'if') return null;

  const rest = words.slice(1);
  const pronouns = ['i', 'you', 'he', 'she', 'we', 'they', 'it'];
  let splitIdx = -1;
  for (let i = 1; i < rest.length; i++) {
    if (pronouns.includes(rest[i].toLowerCase().replace(/[^a-z']/g, ''))) { splitIdx = i; break; }
  }

  // Native speaker confirmed 2026-06-28/29, full rule across 3 examples
  // (Na·a cha·ode bilakgen / Mikode cha·ode bilakgen / Mikka waode noko
  // donggen): -ode attaches to the VERB stem always (last word, per
  // Garo's confirmed SOV order), AND additionally to an OBJECT noun if
  // one is present (detected by its existing "·ko" accusative suffix —
  // e.g. "mi·ko" -> "mikode"). The subject noun does NOT take -ode.
  const trySplit = async (idx) => {
    const conditionWords = rest.slice(0, idx);
    const consequenceWords = rest.slice(idx);
    if (!conditionWords.length || !consequenceWords.length) return null;
    const condition = conditionWords.join(' ');
    const consequence = consequenceWords.join(' ');
    const [condResult, consResult] = await Promise.all([translate(condition), translate(consequence)]);
    if (condResult.garo.includes('[UNKNOWN]') || consResult.garo.includes('[UNKNOWN]')) return null;

    const condWords = condResult.garo.split(/\s+/);
    // Verb is the last word (SOV) — always gets -ode.
    const verbIdx = condWords.length - 1;
    condWords[verbIdx] = stripToStem(condWords[verbIdx]) + 'ode';
    // Object, if present, is marked with a trailing "·ko" — also gets
    // -ode appended directly after its existing -ko suffix (mi·ko ->
    // mikode — the raka before "ko" drops, matching the confirmed
    // "Mikode" example exactly; this is the suffix-juncture, not the
    // verb-stem rule, so stripToStem is NOT used here).
    for (let i = 0; i < verbIdx; i++) {
      if (/·ko$/i.test(condWords[i])) {
        condWords[i] = condWords[i].replace(/·ko$/i, 'ko') + 'de';
      }
    }
    const conditionWithOde = condWords.join(' ');
    return { garo: `${conditionWithOde}, ${consResult.garo}`, confidence: (condResult.confidence + consResult.confidence) / 2 };
  };

  if (splitIdx !== -1) {
    const result = await trySplit(splitIdx);
    if (result) return { garo: result.garo, method: 'if-clause-ode', confidence: 0.7 };
  }

  let best = null;
  for (let i = 1; i < rest.length; i++) {
    const result = await trySplit(i);
    if (result && (!best || result.confidence > best.confidence)) best = result;
  }
  if (!best) return null;
  return { garo: best.garo, method: 'if-clause-ode-fallback', confidence: 0.65 };
}

async function translateMultiClause(input) {
  const words = input.trim().split(/\s+/);
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, ''));

  for (const [word, garoWord] of Object.entries(MID_JOIN_CONNECTIVES)) {
    const idx = lowerWords.indexOf(word);
    if (idx > 0 && idx < words.length - 1) {
      const clause1 = words.slice(0, idx).join(' ');
      const clause2 = words.slice(idx + 1).join(' ');
      const [r1, r2] = await Promise.all([translate(clause1), translate(clause2)]);
      if (r1.garo.includes('[UNKNOWN]') || r2.garo.includes('[UNKNOWN]')) return null;
      return { garo: `${r1.garo} ${garoWord} ${r2.garo}`, method: 'multi-clause-join', confidence: 0.7 };
    }
  }

  return null;
}

export async function translate(input) {
  if (!input || typeof input !== 'string') return { garo: '', method: 'empty', confidence: 0 };

  const cleaned = normalizeInput(input.trim().replace(/’/g, "'"));
  // Normalize: strip apostrophes for lookup consistency
  const normalizedForLookup = cleaned.toLowerCase().replace(/['']/g, '');
  const lower = cleaned.toLowerCase().replace(/[''\u2019]/g, '');
  const words = lower.split(/\s+/);

  // 1. Corrections — case-insensitive, apostrophe-tolerant lookup.
  // Tries 3 forms in order:
  // (a) lowercase with apostrophes preserved ("let's go") — exact canonical match
  // (b) original cleaned form (handles mixed case)
  // (c) apostrophe-stripped lowercase ("lets go", "dont eat") — typo tolerance
  const lowerWithApos = cleaned.toLowerCase();
  const correction = corrections?.[lowerWithApos] || corrections?.[cleaned] || corrections?.[lower];
  if (correction) return { garo: correction, method: 'correction', confidence: 1.0 };

  // 1.5 Phrase map
  const phraseMap = lookupPhrase(lower);
  if (phraseMap) return { garo: phraseMap, method: 'phrase-map', confidence: 0.99 };

  // 1.6 Classifier counting — "2 dogs", "one teacher", "5 birds"
  const countPhrase = parseCountingPhrase(cleaned);
  if (countPhrase) {
    const singular = countPhrase.englishNoun.replace(/s$/, '');
    // Check corrections.json first — this branch previously skipped
    // straight to phrase_maps/dictionary lookup, meaning a corrections.json
    // fix to a countable noun (e.g. orange/monkey) was silently bypassed
    // whenever the noun was counted rather than looked up bare
    // ("two oranges" kept using the old wrong word even after "orange"
    // alone was fixed).
    const garoNoun = corrections?.[countPhrase.englishNoun]
      || corrections?.[singular]
      || lookupPhrase(countPhrase.englishNoun)
      || lookupGaro(countPhrase.englishNoun)
      || lookupPhrase(singular)
      || lookupGaro(singular);
    if (garoNoun) {
      const classifierResult = countNoun(garoNoun, countPhrase.count, countPhrase.englishNoun);
      // countNoun returns null for counts it can't confidently handle yet
      // (currently: 20+, pending native-speaker confirmation of how
      // classifiers compose with multi-word number forms — see
      // QUESTION_THANGSENG_20PLUS_COUNTING.md). Falling through to the
      // rest of the cascade instead of returning a fabricated/wrong answer.
      if (classifierResult !== null) {
        return {
          garo: classifierResult,
          method: 'classifier',
          confidence: 0.96,
        };
      }
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

  // 3.5 Multi-clause connective splitting ("X and Y", "if X Y", etc.)
  // Placed AFTER corrections/phrase-map/single-word checks so already-
  // verified sentences containing connective words are never hijacked —
  // they match as exact phrases above and never reach this step.
  const ifClauseResult = await translateIfClause(cleaned);
  if (ifClauseResult) return ifClauseResult;

  const multiClauseResult = await translateMultiClause(cleaned);
  if (multiClauseResult) return multiClauseResult;

  // 4. Stop-word strip
  // Negation-aware: this step previously had zero awareness of negation
  // (same bug class as assembleSentenceSOV, fixed earlier this session) —
  // "it isn't good" was stripping to "good" -> "nam·a" with the negation
  // silently dropped. NOTE: can't use a literal n't/not regex here since
  // `lower` has already had its apostrophe stripped by this point in the
  // pipeline — "isn't" is already "isnt". Check against the negation
  // contraction set directly instead.
  const NEGATION_WORDS = new Set(['not','never','dont','doesnt','didnt','wont','cant','isnt','arent','wasnt','werent']);
  const isNegativeShortcut = words.some(w => NEGATION_WORDS.has(w));
  const stripped = words.filter(w => !STOP_WORDS.has(w)).join(' ');
  if (stripped && stripped !== lower) {
    let sm = lookupGaro(stripped);
    if (sm) {
      if (isNegativeShortcut) {
        // Rule 18 (corrected 2026-07-04): 'ja' (Rule 1, confirmed present
        // negation) replaces 'gija' — gija is a verbal adjective requiring a
        // governing main verb, not a general negation marker. Also fixes a
        // latent bug: trailing vowel/raka wasn't stripped before appending,
        // producing malformed forms like "Nama·gija" instead of "Namja".
        if (/a$/i.test(sm)) {
          const base = sm.replace(/·a$/, '·').replace(/a$/, '');
          sm = base.includes('·') ? base + 'ja' : base + 'ja';
        }
      }
      return { garo: sm, method: 'stopword-stripped', confidence: 0.88 };
    }
  }

  // 5. Number engine
  const numResult = null; // number_engine handles via classifier
  if (numResult) return { garo: numResult, method: 'number-engine', confidence: 0.96 };

  // 5.5 Rule 18 positive gija construction ("without VERB-ing")
  const gijaConstruction = tryWithoutGijaConstruction(cleaned);
  if (gijaConstruction) return { garo: gijaConstruction, method: 'gija-construction', confidence: 0.85 };

  // 6. Grammar assembly — SOV with -ko object marker and -na purpose clause
  const grammar = analyzeGrammar(cleaned);
  const grammarResult = assembleGrammar(grammar);
  if (grammarResult) {
    return { garo: grammarResult, method: 'grammar-assembly', confidence: 0.82 };
  }

  // 6.5 Fallback SOV assembly
  // Reuses grammar.isNegative (already computed above by analyzeGrammar)
  // rather than re-detecting — fixes the gap where this fallback path had
  // zero negation awareness even though the value was sitting unused in scope.
  const sov = assembleSentenceSOV(words, grammar?.isNegative || false);
  if (sov) return { garo: sov, method: 'sov-assembly', confidence: 0.75 };

  // 7. Morphology
  const morph = words.map(w => lookupGaro(w) || lookupGaro(w.replace(/ing$|ed$|s$|ly$/,'')) || null).filter(Boolean);
  if (morph.length >= Math.ceil(words.length * 0.5)) return { garo: morph.join(' '), method: 'morphology', confidence: 0.65 };

  // 8. Compound split
  const compound = words.flatMap(w => w.split('-')).map(w => lookupGaro(w)).filter(Boolean);
  if (compound.length) return { garo: compound.join(' '), method: 'compound-split', confidence: 0.60 };

  // 9. Fuzzy — skip if input contains raka (·): that means user typed Garo, not English.
  // ro·a typed as English was fuzzy-matching to "road" → so·rok (wrong). Fixed.
  const fuzzy = input.includes('·') ? null : fuzzyMatch(lower);
  if (fuzzy) {
    const fg = lookupGaro(fuzzy.key);
    if (fg) return { garo: fg, method: `fuzzy(${fuzzy.key},d=${fuzzy.distance})`, confidence: Math.max(0.40, 0.75 - fuzzy.distance * 0.1) };
  }

  // 10. Gemini fallback — REMOVED (2026-07-05). Docs already documented this
  // as removed; code was left half-wired, still importing analyzeSentence
  // and calling an unconfigured API on every untranslated input (403
  // Forbidden every time, silently swallowed, just wasted latency/noise).

  // 11. Passthrough
  return { garo: `${cleaned} [UNKNOWN]`, method: 'passthrough', confidence: 0 };
}

export function getAllVocabulary() {
  const entries = [];
  const seenEnglish = new Set();
  for (const [english, val] of Object.entries(EN_INDEX)) {
    const arr = Array.isArray(val) ? val : [normalizeEntry(val)];
    for (const e of arr) {
      if (e?.garo) {
        const correctedGaro = corrections[english] || e.garo;
        entries.push({ english, garo: correctedGaro, pos: e.pos||null, category: e.category||'uncategorized', classifier: e.classifier||null });
      }
    }
    seenEnglish.add(english);
  }
  for (const [english, garo] of Object.entries(corrections)) {
    if (seenEnglish.has(english)) continue;
    if (english.includes(' ')) continue;
    entries.push({ english, garo, pos: null, category: 'uncategorized', classifier: null });
  }
  return entries;
}

export function getByCategory(category) { return getAllVocabulary().filter(e => e.category === category); }
export function getCategories() { return [...new Set(getAllVocabulary().map(e => e.category))].sort(); }

export function getAlternates(englishWord) {
  if (!englishWord || typeof englishWord !== 'string') return null;
  const key = englishWord.trim().toLowerCase();
  const variants = ALTERNATES_RAW[key];
  if (!variants || variants.length < 2) return null;
  return { primary: EN_INDEX[key] || variants[0], alternates: variants };
}

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
