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
 * 10. Passthrough
 *
 * (Gemini fallback formerly step 10, removed 2026-07-05 — see docs/ARCHITECTURE.md §9)
 */

import ALTERNATES_RAW from './compiled_dict_alternates.json' with { type: 'json' };
import CATEGORY_INDEX from './data/category_index.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import { countNoun, parseCountingPhrase } from './garo_classifier.js';
import { corrections, normalizeEntry, EN_INDEX, lookupGaro } from './lookupEngine.js';
import { applyNegation } from './morphologyEngine.js';
import { STOP_WORDS, fuzzyMatch, normalizeInput } from './normalizationEngine.js';
// analyzeGrammar, tryWithoutGijaConstruction extracted to
// src/grammarEngine.js (2026-07-29, BACKLOG-003 Phase 5). Verified zero
// logic change via byte-identical 237-sentence stress benchmark diff.
import { analyzeGrammar, tryWithoutGijaConstruction } from './grammarEngine.js';
export { analyzeGrammar };
// assembleSentenceSOV, assembleGrammar, translateIfClause,
// translateMultiClause extracted to src/sentenceBuilder.js
// (2026-07-29, BACKLOG-003 Phase 6). Verified zero logic change via
// byte-identical 237-sentence stress benchmark diff. Circular import
// (sentenceBuilder.js imports `translate` back from this file) — see
// sentenceBuilder.js's header comment for why this is safe.
import { assembleSentenceSOV, assembleGrammar, translateIfClause, translateMultiClause } from './sentenceBuilder.js';
// Gemini import removed 2026-07-05 (dead fallback, see step 10 below)

// STOP_WORDS, AUXILIARY_SKIP extracted to src/normalizationEngine.js
// (2026-07-26, BACKLOG-003 Phase 7). Verified zero logic change.

// VERB_SUFFIXES removed 2026-07-05 — dead table, contradicted applyTense's
// real suffix map (claimed past='·a' vs applyTense's actual 'ha'; claimed
// present='enga' which is actually the progressive suffix). Only consumer
// was the informational garoTenseSuffix field below, confirmed unused by
// any UI component — removed rather than fixed-in-place to avoid keeping
// two suffix tables that could drift apart again.

// PRONOUN_MAP extracted to src/data/pronoun_map.json (2026-07-09,
// BACKLOG-001, same pattern as BACKLOG-002/irregular_verbs.json). Data
// verified byte-for-byte identical before the swap.

// Shared negation suffix logic (was duplicated 3x — main verb loop,
// assembleSentenceSOV fallback, stopword-stripped step — with drift risk
// each time one copy got fixed and the others didn't, as happened with the
// gija->ja migration on 2026-07-04).
// Rule 18 (corrected 2026-07-04): 'ja' (Rule 1, present negation) is used
// for negation generally — 'gija' is a verbal adjective requiring a
// governing main verb, not a negation marker.
// Rule 27 (confirmed 2026-07-05): '-ja' naturally covers past-referring
// negation too ('Re·angja' = "did not go", confirmed native reply to a
// past-tense question) — Garo has no dedicated simple-past suffix, so this
// same form is correct regardless of the input's English tense.
// applyNegation, applyTense, findVerbForm, stripToStem extracted to
// src/morphologyEngine.js (2026-07-25, BACKLOG-003 Phase 3). Verified
// zero logic change.

// IRREGULAR_VERBS extracted to src/data/irregular_verbs.json (2026-07-08,
// BACKLOG-002 first increment — see docs/ARCHITECTURE.md §12). Data is
// byte-for-byte identical to the previous inline object (verified via
// diff before the swap); only the storage location changed. Historical
// note preserved: searched/searching/gossiped/gossiping/conquered/began/
// begun/spoke/answered/discovered were deliberately excluded on
// 2026-07-05 — those used purpose-clause -na endings (infinitive/purpose
// marker) instead of actual past-tense forms, so they fall through to
// the general dictionary-lookup + applyTense('past') pipeline instead of
// hardcoding unverified forms.

// POSSESSIVES extracted to src/data/possessives.json (2026-07-09,
// BACKLOG-001). Data verified byte-for-byte identical before the swap.

// PURPOSE_VERBS removed 2026-07-05 — was a duplicate of PURPOSE_MAP (below)
// with only 15 of its 37 entries and one real conflict ('see': 'nik·a·na'
// vs PURPOSE_MAP's 'nina' — 'nina' kept, matches the dictionary's present-
// tense root 'ni' in 'nia', see PURPOSE_MAP for details). Two maps for the
// same grammatical concept is exactly the kind of duplicated/contradictory
// logic flagged in the 2026-07-05 audit — consolidated into one.

export async function translate(input) {
  if (!input || typeof input !== 'string') return { garo: '', method: 'empty', confidence: 0 };


  const cleaned = normalizeInput(input.trim().replace(/’/g, "'"));
  // Normalize: strip apostrophes for lookup consistency
  const lower = cleaned.toLowerCase().replace(/[''\u2019]/g, '');
  const words = lower.split(/\s+/);

  // 1. Corrections — case-insensitive, apostrophe-tolerant lookup.
  // Tries 4 forms in order:
  // (a) lowercase with apostrophes preserved ("let's go") — exact canonical match
  // (b) original cleaned form (handles mixed case)
  // (c) apostrophe-stripped lowercase ("lets go", "dont eat") — typo tolerance
  // (d) RC-CANDIDATE-030 fix (2026-07-29, Claude B, diagnosed by Claude A
  // in AUDIT_NATIVE_VALIDATION_PROPAGATION_20260729.md): trailing
  // "?"-stripped lowercase. corrections.json stores question keys
  // WITHOUT "?" ("will you eat"), while some compiled_dict.json phrase
  // keys store it WITH "?" ("did you eat?") — two conventions for the
  // same kind of fact, and normalizeInput() never stripped it, so
  // "will you eat?" (with the punctuation a real user actually types)
  // silently missed the confirmed correction and fell all the way
  // through to sov-assembly's word-salad output. Tried LAST, after the
  // three exact-match forms above, so a corrections.json key that
  // deliberately includes "?" is still matched first and this fallback
  // never shadows it. Scoped to "?" only, matching the diagnosis exactly
  // — an earlier draft also stripped "!"/"." and broke "eat!" (which has
  // its own deliberate exclamatory-imperative entry, "Cha·bo!", distinct
  // from plain "eat"'s "Cha·a") by shadowing it with the wrong form.
  // "?" doesn't have this risk: Garo questions use a dedicated "ma"
  // interrogative suffix, so no corrections.json entry would ever
  // deliberately differ between a "?" and non-"?" key the way an
  // imperative "!" legitimately can.
  const lowerWithApos = cleaned.toLowerCase();
  const lowerNoPunct = lower.replace(/\?+$/, '');
  const correction = corrections?.[lowerWithApos] || corrections?.[cleaned] || corrections?.[lower] || corrections?.[lowerNoPunct];
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
      if (isNegativeShortcut && /a$/i.test(sm)) {
        sm = applyNegation(sm);
      }
      return { garo: sm, method: 'stopword-stripped', confidence: 0.88 };
    }
  }

  // Step 5 (number engine) removed 2026-07-05 — was `const numResult = null`
  // followed by `if (numResult)`, permanently dead code. Number/classifier
  // handling happens earlier in the pipeline (step 1).
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
  // Reuses grammar.isNegative and grammar.detectedTense (already computed
  // above by analyzeGrammar) rather than re-detecting — fixes the gap
  // where this fallback path had zero negation awareness (fixed earlier)
  // and, as of RC-CANDIDATE-018, zero future-tense awareness either.
  const sov = assembleSentenceSOV(words, grammar?.isNegative || false, grammar?.detectedTense || 'present');
  if (sov) return { garo: sov, method: 'sov-assembly', confidence: 0.75 };

  // 7. Morphology
  // RC-CANDIDATE-034 fix (2026-07-31): resolved/unresolved words were both
  // reduced to the same `.filter(Boolean)` step, so an unresolvable word
  // (e.g. "xyzzy") silently vanished from the joined output with no signal —
  // translate("is on at") and translate("is on xyzzy at") produced identical
  // text. The >=50% threshold below is unchanged (this step is deliberately
  // tolerant of partial resolution, unlike grammar-assembly in RC-029) —
  // only the silent drop is fixed, by carrying an '[UNKNOWN]' marker through
  // in place of a dropped word, same signal convention already used by the
  // step 10 passthrough fallback below.
  const morphWords = words.map(w => lookupGaro(w) || lookupGaro(w.replace(/ing$|ed$|s$|ly$/,'')) || '[UNKNOWN]');
  const morph = morphWords.filter(w => w !== '[UNKNOWN]');
  if (morph.length >= Math.ceil(words.length * 0.5)) {
    const garo = morphWords.includes('[UNKNOWN]') ? morphWords.join(' ') : morph.join(' ');
    return { garo, method: 'morphology', confidence: 0.65 };
  }

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
  // outputLang is part of the real call contract (Translator.jsx passes
  // it); body doesn't consume it yet, but removing the parameter would
  // change the public interface.
  // eslint-disable-next-line no-unused-vars
  async translateSentence(text, inputLang = 'en', outputLang = 'garo') {
    if (!text || !text.trim()) return null;
    const r = await translate(text);
    const g = analyzeGrammar(text);
    const breakdown = [];
    if (g?.subject) breakdown.push({ english: g.subject.english, garo: g.subject.garo, category: 'subject' });
    if (g?.verb) breakdown.push({ english: g.verb.english, garo: g.verb.garoWithTense || g.verb.garo, category: 'verb' });
    if (g?.object) breakdown.push({ english: g.object.english, garo: g.object.garo, category: 'object' });
    return { translated: r.garo, original: text, breakdown, direction: inputLang === 'garo' ? 'garo_to_en' : 'en_to_garo', method: r.method };
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
