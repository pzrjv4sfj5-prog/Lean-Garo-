/**
 * normalizationEngine.js
 * Claude B — Repository Steward / Engineering Architect
 *
 * Phase 7 of the translationEngine.js modularization roadmap
 * (docs/ARCHITECTURE.md BACKLOG-003). Input normalization, stop-word/
 * auxiliary tables, connective splitting, and fuzzy-match fallback —
 * extracted verbatim, zero logic change. Behavior verified byte-
 * identical via the full 237-sentence stress benchmark diff before/after.
 */

import { levenshtein } from './utils.js';
import { EN_INDEX } from './lookupEngine.js';

export const STOP_WORDS = new Set([
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

// RC-CANDIDATE-018 fix (2026-07-18, Claude A confirmed engineering-only):
// hoisted from a local declaration inside analyzeGrammar's NP-subject
// block to module level so it's one shared table instead of two that
// could drift apart, and so assembleSentenceSOV (the sov-assembly
// fallback) can also use it. Note most modals (would/could/should/may/
// might/shall/can) are ALSO already in STOP_WORDS above and were
// already correctly excluded from lexical translation everywhere -
// "will" specifically was the gap: not in STOP_WORDS, so it has its own
// master_dictionary.json entry ("will":"·gen") and was being treated as
// an ordinary lexical word instead of a tense auxiliary (root cause 1).
// "shall"/"going"/"used"/"stopped"/"quit"/"finished"/"completed"/
// "longer" have the same shape (auxiliary/discontinuation markers with
// their own standalone dictionary entries) and get the same treatment.
export const AUXILIARY_SKIP = new Set(['will','shall','going','would','could','should','may','might','can','used','to','stopped','quit','finished','completed','longer']);

export function fuzzyMatch(input) {
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

export function normalizeInput(text) {
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
export const MID_JOIN_CONNECTIVES = {
  'and': 'Aro',
  'but': 'Indiba',
  'or': 'ba',
  'so': 'Uni gimin',
};
