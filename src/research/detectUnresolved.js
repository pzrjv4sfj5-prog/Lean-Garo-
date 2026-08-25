/**
 * detectUnresolved.js
 * Claude B — AI/Web Fallback Research Prototype, Phase 1
 *
 * WHY THIS FILE EXISTS (see docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md §1-3
 * for the full audit this is built on):
 *
 * translate()'s existing cascade has TWO independent silent-loss mechanisms,
 * neither of which reliably surfaces "this word was not resolved":
 *
 *   1. assembleSentenceSOV (sentenceBuilder.js:100, `.filter(p => p.garo)`)
 *      drops any unresolved content word from the joined output with NO
 *      marker at all. Confirmed live: translate("she is carrying a widget")
 *      -> "Ua gat·a" (widget vanishes, method=sov-assembly, confidence=0.75
 *      — indistinguishable from a fully correct translation).
 *
 *   2. assembleGrammar's object-extraction loop (grammarEngine.js:544-545)
 *      falls back to looking up only the LAST word of a multi-word object
 *      phrase when the full phrase doesn't resolve. If an earlier word in
 *      that phrase is the one that's actually unresolved but a later word
 *      in the same phrase happens to resolve on its own, the wrong (but
 *      real) word gets silently substituted in as the object — worse than
 *      a drop, because it evades the '[UNKNOWN]' safety check at
 *      sentenceBuilder.js:314 entirely. Confirmed live: translate("i bought
 *      a gadget yesterday") -> "Anga mejal·ko breaha" ("mejal"="yesterday"
 *      wrongly takes the object-marker slot; "gadget" — the actual
 *      unresolved word — disappears with no trace).
 *
 * Because of (2) especially, checking the ASSEMBLED Garo output for a
 * '[UNKNOWN]' marker is not a reliable detector — it can be silently
 * defeated. This module instead re-derives resolution status directly from
 * the ORIGINAL English content words, independently of which assembly path
 * translate() ends up using, by reusing the exact same lookup primitives
 * those paths already call (lookupGaro/lookupPhrase/STOP_WORDS/
 * AUXILIARY_SKIP) — no new lookup logic, no new linguistic content, purely
 * read-only reuse of what already exists.
 *
 * This module does NOT change translate()'s behavior or output in any way.
 * It is a separate, optional, read-only layer callable before or after
 * translate() — see docs/CLAUDE_B_AI_FALLBACK_DESIGN_20260824.md §7 for how
 * it can be wired in (or left unwired) without touching the production
 * cascade.
 */

import { lookupGaro } from '../lookupEngine.js';
import { lookupPhrase } from '../data/phrase_maps.js';
import { STOP_WORDS, AUXILIARY_SKIP } from '../normalizationEngine.js';

// Same stripping order sentenceBuilder.js's translated map already uses
// (ing/ed/s/es), reused verbatim rather than reinvented, so a word this
// detector calls "resolved" is resolved by the identical rule the real
// engine would have used.
function resolveContentWord(raw) {
  const w = raw.toLowerCase().replace(/[^a-z'·]/g, '');
  if (!w) return { word: raw, resolved: true, garo: null, skipped: true };
  const ingStripped = w.replace(/ing$/, '');
  const garo =
    lookupPhrase(w) ||
    lookupGaro(w) ||
    (ingStripped !== w ? lookupGaro(ingStripped) : null) ||
    lookupGaro(w.replace(/ed$/, '')) ||
    lookupGaro(w.replace(/s$/, '')) ||
    lookupGaro(w.replace(/es$/, '')) ||
    null;
  return { word: raw, resolved: !!garo, garo: garo || null, skipped: false };
}

/**
 * Independently checks each content word (i.e. every word that is not a
 * stop-word/auxiliary — the same filter assembleSentenceSOV already
 * applies) against the existing dictionary lookup chain.
 *
 * Returns per-word resolution status plus a sentence-level flag, computed
 * BEFORE any sentence-assembly step runs — so it can't be fooled by an
 * assembly path that silently drops or wrongly substitutes a word (see
 * file header). This is deliberately the same information translate()'s
 * own cascade already computes internally at various points, just
 * surfaced explicitly and reliably in one place instead of being an
 * incidental side effect of whichever assembly path happens to run.
 *
 * @param {string} input Raw English sentence/phrase.
 * @returns {{
 *   words: Array<{word:string, resolved:boolean, garo:string|null}>,
 *   unresolvedWords: string[],
 *   isComplete: boolean
 * }}
 */
export function detectUnresolvedWords(input) {
  if (!input || typeof input !== 'string') {
    return { words: [], unresolvedWords: [], isComplete: true };
  }
  const rawWords = input.trim().split(/\s+/);
  const results = [];
  for (const raw of rawWords) {
    const lw = raw.toLowerCase().replace(/[^a-z']/g, '');
    if (!lw || STOP_WORDS.has(lw) || AUXILIARY_SKIP.has(lw)) continue;
    results.push(resolveContentWord(raw));
  }
  const unresolvedWords = results.filter(r => !r.resolved).map(r => r.word);
  return {
    words: results,
    unresolvedWords,
    isComplete: unresolvedWords.length === 0,
  };
}
