/**
 * lookupEngine.js
 * Claude B — Repository Steward / Engineering Architect
 *
 * Phase 2 of the translationEngine.js modularization roadmap (see
 * docs/ARCHITECTURE.md's engine-audit entry, 2026-07-25). Lexical
 * lookup + corrections precedence — extracted verbatim from
 * translationEngine.js with zero logic changes. Behavior verified
 * byte-identical via the full 237-sentence stress benchmark diff
 * before/after.
 *
 * This is the exact module flagged in the 2026-07-25 "he works"
 * incident (SESSION_BOOTSTRAP.md) — findVerbForm's dependency on
 * lookupGaro()'s corrections-precedence order wasn't visible from
 * reading findVerbForm alone. Isolating it here, with its own export
 * surface, is meant to make that coupling visible going forward.
 */

import compiledDictRaw from './compiled_dict.json' with { type: 'json' };
import correctionsRaw from './data/corrections.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import confirmedLoanwordsRaw from './data/confirmed_loanwords.json' with { type: 'json' };

// NV-118 (2026-09-03, Claude B). Single-word-only subset of the confirmed
// loanword list (translationEngine.js's own step 1.75 already handles the
// multi-word phrases like "paneer butter masala" at the top-level input
// string; lookupGaro only ever receives one word at a time, so multi-word
// entries can never match here and are filtered out rather than left in
// as dead weight).
const SINGLE_WORD_LOANWORDS = new Set(
  confirmedLoanwordsRaw.words.filter(w => !w.includes(' ')).map(w => w.toLowerCase())
);

// Shadow index: apostrophe-stripped keys for typo tolerance (lets go -> let's go)
export const corrections = { ...correctionsRaw };
for (const [k, v] of Object.entries(correctionsRaw)) {
  const stripped = k.toLowerCase().replace(/['’]/g, '');
  if (stripped !== k.toLowerCase() && !corrections[stripped]) corrections[stripped] = v;
}

// Index build — support both string and array format
export function normalizeEntry(val) {
  if (!val) return null;
  if (typeof val === 'string') return { garo: val, pos: null, category: null };
  if (Array.isArray(val)) return val[0];
  return val;
}

export const EN_INDEX = {};
for (const [key, val] of Object.entries(compiledDictRaw)) {
  EN_INDEX[key.toLowerCase().trim()] = val;
}

// Item 5 fix (2026-08-23, Claude B, session migration): a mechanically-
// derived set of English verb lemmas, built from the dictionary's own
// "to X" headwords (939 of them, per prepare-data.js's bare-infinitive
// aliasing pass). This is NOT a hand-picked or guessed verb list — every
// entry here already exists in the source data specifically because
// Claude A/D's own data-entry convention marks it as an infinitive
// ("to see", "to fall (from height)"). Using it as a verb signal in
// sentenceBuilder.js's sov-assembly fallback is a structural fix, not a
// linguistic decision: it reuses a classification the dictionary source
// already made, rather than inventing a new one (the RC-CANDIDATE-003/
// 010 boundary is specifically about NOT inventing POS data — this
// isn't that, since no new fact is being asserted here).
export const VERB_LEMMAS = new Set();
for (const key of Object.keys(compiledDictRaw)) {
  if (key.startsWith('to ')) {
    const lemma = key.slice(3).split('(')[0].trim().toLowerCase();
    if (lemma) VERB_LEMMAS.add(lemma);
  }
}

export function lookup(key) {
  const entry = EN_INDEX[key.toLowerCase().trim()];
  return entry ? normalizeEntry(entry) : null;
}

export function lookupGaro(key) {
  // Check corrections.json first — single-word keys were previously
  // bypassed here since EN_INDEX is built only from compiled_dict.json.
  // This meant confirmed corrections only took effect in the top-level
  // translate() fast-path, not in findVerbForm/grammar-assembly which
  // call lookupGaro() directly.
  const k = key.toLowerCase().trim();
  if (corrections[k]) return corrections[k];
  // RC-CANDIDATE (2026-08-03, Claude B, Runtime Engineering Audit):
  // phrase_maps.js was never checked here either — only reachable via
  // translate()'s own top-level step 1.5 exact-string match. Any word
  // whose ONLY override lives in phrase_maps.js (not corrections.json)
  // silently fell through to compiled_dict.json's value the moment
  // lookupGaro() was called on a substring instead of the full input —
  // i.e. every fallback path that calls lookupGaro() per-word
  // (stopword-stripped, morphology, compound-split) or on a stripped
  // stem (findVerbForm). Confirmed live: translate("so food") returned
  // compiled_dict's "al·a" instead of phrase_maps.js's "Mi", which bare
  // "food" correctly returns via the top-level path. Checked here,
  // between corrections and compiled_dict, matching translate()'s own
  // documented step order (1 corrections, 1.5 phrase-map, 2 compiled
  // dict) so every caller of lookupGaro() gets the same precedence the
  // top-level cascade already promises.
  const phraseMapValue = lookupPhrase(k);
  if (phraseMapValue) return phraseMapValue;
  const e = lookup(k);
  if (e) return e.garo;
  // NV-118 (2026-09-03, Claude B): momo/chow/maggie/paneer/panner/roll
  // (confirmed no Garo equivalent, see confirmed_loanwords.json) were
  // resolving to a hard '[UNKNOWN]' at every one of the dozen-plus call
  // sites across grammarEngine.js/sentenceBuilder.js/translationEngine.js
  // that do `lookupGaro(word) || '[UNKNOWN]'` — e.g. translate("i want to
  // eat momo") shipped "Anga ska ·na Cha·a [UNKNOWN]" instead of resolving
  // "momo" at all, even though translate("momo") alone worked correctly
  // via NV-115/116's top-level exact-match step. Fixed at this single
  // shared choke point (every one of those call sites already routes
  // through lookupGaro) rather than patching each site individually —
  // same rationale as this function's existing corrections/phrase-map
  // checks above, which exist precisely because callers other than
  // translate()'s own top-level cascade need the same precedence.
  if (SINGLE_WORD_LOANWORDS.has(k)) return k.charAt(0).toUpperCase() + k.slice(1);
  return null;
}
