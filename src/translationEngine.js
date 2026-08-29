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
import PRONOUN_MAP from './data/pronoun_map.json' with { type: 'json' };
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
  // RUNTIME BUG FIX (2026-08-20, Claude A): was calling lookupPhrase(lower)
  // with the apostrophe-stripped form only. 13 PHRASE_MAPS keys contain
  // apostrophes (contractions like "i don't know", "don't give up") and
  // were therefore never reachable — silently falling through to weaker
  // methods (stopword-stripped/grammar-assembly/sov-assembly). Worst case:
  // "i don't know" shipped as "Anga uia." (= "I know", polarity reversed)
  // instead of the confirmed "Anga uija" (= "I don't know"). Mirrors the
  // corrections lookup pattern above: try apostrophe-preserved forms first.
  const phraseMap = lookupPhrase(lowerWithApos) || lookupPhrase(cleaned) || lookupPhrase(lower);
  if (phraseMap) return { garo: phraseMap, method: 'phrase-map', confidence: 0.99 };

  // 2. Exact phrase (compiled dict) — runs BEFORE classifier composition.
  // RUNTIME-PROPAGATION FIX (2026-08-14, Claude B, per Claude C's audit
  // §3.5): this block used to sit AFTER "1.6 Classifier counting" below,
  // even though this file's own header docstring has always documented
  // "2. Exact phrase match (compiled dict)" as outranking "5. Number +
  // classifier engine". That inversion meant a phrase-level fix landed
  // in compiled_dict.json (e.g. NV-073's "twenty student" ->
  // "Chattro sak·Kolgrik", via master_dictionary.json/prepare-data.js)
  // was silently shadowed at runtime: translate("twenty student") kept
  // mechanically recomposing from the *bare*-noun dictionary entry
  // ("student" -> stale "Porai·gipa") every time, because classifier
  // composition ran first and returned before this exact-phrase lookup
  // ever got a turn. A confirmed, native-reviewed phrase-level entry is
  // a stronger signal than mechanical bare-noun composition, so it must
  // win the race. Moving this block ahead of classifier composition
  // restores the documented precedence and lets phrase-level fixes
  // actually reach users without requiring a matching bare-noun update
  // in lockstep. Composition remains the correct fallback for every
  // counted-noun phrase that has no dedicated compiled_dict.json entry
  // (the vast majority) — this only changes behavior for phrases that
  // DO have one.
  const exactPhrase = lookupGaro(lower);
  if (exactPhrase) return { garo: exactPhrase, method: 'exact-phrase', confidence: 0.98 };

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
    let resolvedNoun = countPhrase.englishNoun;
    let garoNoun = corrections?.[countPhrase.englishNoun]
      || corrections?.[singular]
      || lookupPhrase(countPhrase.englishNoun)
      || lookupGaro(countPhrase.englishNoun)
      || lookupPhrase(singular)
      || lookupGaro(singular);
    // Item 2 fix (2026-08-23, Claude B, session migration): the above
    // chain only ever tried the full remainder after the count
    // ("long stick" for "three long sticks") — a genuine dictionary
    // entry for the bare noun ("stick") was unreachable whenever an
    // adjective sat between the number and the noun, so the whole
    // phrase fell through to the weaker sov-assembly fallback (0.75)
    // instead of classifier composition (0.96). Fall back to
    // parseCountingPhrase()'s nounOnly (the last word alone) only when
    // the full-phrase attempt above fails and an adjective is actually
    // present (nounOnly !== singular) — genuine multi-word nouns
    // ("sugar cane") are unaffected since they resolve on the first
    // attempt and never reach this branch.
    if (!garoNoun && countPhrase.nounOnly !== singular) {
      garoNoun = corrections?.[countPhrase.nounOnly]
        || lookupPhrase(countPhrase.nounOnly)
        || lookupGaro(countPhrase.nounOnly);
      if (garoNoun) resolvedNoun = countPhrase.nounOnly;
    }
    if (garoNoun) {
      const classifierResult = countNoun(garoNoun, countPhrase.count, resolvedNoun);
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
  // Pronoun-collision guard (2026-08-29, Claude B, session migration,
  // surfaced by the OOV/proper-noun sov-assembly fix above): this step's
  // own ing$/ed$/s$/ly$ stripping is a third, independent copy of the
  // exact RC-CANDIDATE-035 collision class already guarded in
  // sentenceBuilder.js's own stripping and in morphologyEngine.js's
  // findVerbForm — "using" strips to "us", a real pronoun_map.json key,
  // so the unguarded bare lookupGaro(stripped) below returned the
  // pronoun's Garo form ("Chingna") as if it were "using"'s translation.
  // This copy was never actually reached for that sentence before today
  // (sov-assembly's own silent-drop bug always intercepted "she is using
  // her phone" one cascade step earlier — see sentenceBuilder.js), so the
  // gap here was latent, not exercised. Now that sov-assembly correctly
  // bails instead of silently dropping, this step is reachable for that
  // input and needs the same guard its two sibling copies already carry.
  // Reuses PRONOUN_MAP exactly as the existing precedent does — no new
  // vocabulary or heuristic invented.
  const morphWords = words.map(w => {
    // Non-letter stripping (2026-08-29, Claude B, session migration):
    // mirrors the same `[^a-z'·]` strip assembleSentenceSOV's own
    // per-word lookup already applies (sentenceBuilder.js) before it
    // does any lookupGaro call. Without it, a bare non-alphabetic token
    // (confirmed live via "0 dogs", surfaced once sov-assembly's silent-
    // drop fix above stopped masking it) queries the dictionary with the
    // raw, unstripped token — and master_dictionary.json happens to carry
    // a single stray `"0"` entry (`confidence: "unverified"`, garo value
    // "don't do") that is self-evidently a data-entry error, not a real
    // translation for the digit zero. This block cannot fix that entry
    // (linguistic-data judgment, out of engineering scope per this
    // repo's own governance §6 bright line — an 'unverified' value has no
    // citation to defer to) — it only restores the same defensive
    // normalization every other per-word lookup site in this codebase
    // already applies, so a non-word token fails to resolve cleanly
    // (-> '[UNKNOWN]', consistent with genuinely OOV input) instead of
    // accidentally matching whatever garbage happens to sit under its
    // literal raw-character dictionary key. Confirmed safe for genuine
    // standalone digit words ("3" -> "gittam", etc.): those are handled
    // earlier in the cascade (step 3 exact-word, or classifier
    // composition for count >= 1) and never reach this step at all.
    const lw = w.replace(/[^a-z'·]/g, '');
    const stripped = lw.replace(/ing$|ed$|s$|ly$/,'');
    const strippedLookup = (stripped !== lw && !(stripped in PRONOUN_MAP)) ? lookupGaro(stripped) : null;
    return lookupGaro(lw) || strippedLookup || '[UNKNOWN]';
  });
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
        // BUGFIX (2026-08-09, "getCategories()/getByCategory() dormant"
        // — flagged docs/CLAUDE_B_MIGRATION_20260808.md P1 #2): compiled_
        // dict.json's values are plain Garo strings (no category field at
        // all — see prepare-data.js's `finalized[key] = primary`), so
        // normalizeEntry() always produced category: null here, and every
        // entry fell through to the 'uncategorized' default below. The
        // real per-word category data has existed all along in
        // category_index.json (built separately by prepare-data.js from
        // master_dictionary.json), and was already being used as a
        // fallback by the default-export wrapper's getAllCategories()/
        // getCategoryVocabulary() — but never by these two raw named
        // exports themselves, since both are pure derivations of
        // getAllVocabulary(). Looking CATEGORY_INDEX up here fixes both
        // at the source, consistent with what the wrapper already does.
        const category = e.category || CATEGORY_INDEX[english] || 'uncategorized';
        entries.push({ english, garo: correctedGaro, pos: e.pos||null, category, classifier: e.classifier||null });
      }
    }
    seenEnglish.add(english);
  }
  for (const [english, garo] of Object.entries(corrections)) {
    if (seenEnglish.has(english)) continue;
    if (english.includes(' ')) continue;
    entries.push({ english, garo, pos: null, category: CATEGORY_INDEX[english] || 'uncategorized', classifier: null });
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
