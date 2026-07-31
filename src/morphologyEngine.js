/**
 * morphologyEngine.js
 * Claude B — Repository Steward / Engineering Architect
 *
 * Phase 3 of the translationEngine.js modularization roadmap
 * (docs/ARCHITECTURE.md BACKLOG-003). Verb/tense/negation morphology —
 * extracted verbatim, zero logic change. Behavior verified byte-
 * identical via the full 237-sentence stress benchmark diff before/after.
 *
 * findVerbForm is the exact function implicated in the 2026-07-25
 * "he works" incident (SESSION_BOOTSTRAP.md) — its dependency on
 * lookupGaro()'s corrections-precedence order wasn't visible from
 * reading findVerbForm alone. Isolating it here alongside its actual
 * dependency (lookupEngine.js) is meant to keep that coupling visible.
 */

import IRREGULAR_VERBS from './data/irregular_verbs.json' with { type: 'json' };
import PRONOUN_MAP from './data/pronoun_map.json' with { type: 'json' };
import { lookupGaro } from './lookupEngine.js';

export function applyNegation(garoForm) {
  const base = garoForm.replace(/·a$/, '·').replace(/a$/, '');
  return base.includes('·') ? base + 'ja' : garoForm.replace(/a$/, '') + 'ja';
}

export function applyTense(verbRoot, tense) {
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

export function findVerbForm(w) {
  if (IRREGULAR_VERBS[w]) return IRREGULAR_VERBS[w];
  if (lookupGaro(w)) return lookupGaro(w);
  const stripped = w.replace(/ing$|ed$|es$|s$/, '');
  if (stripped !== w) {
    if (IRREGULAR_VERBS[stripped]) return IRREGULAR_VERBS[stripped];
    // RULE-041 follow-up (2026-07-25, Claude B): prefer the confirmed
    // infinitive entry ("to " + stripped) over the bare stripped form
    // when both exist, since corrections.json's bare-word keys (e.g.
    // "work" -> "Daka") are shared with other tables (purpose_map.json)
    // for a different construction and are NOT safe to repoint here -
    // doing so broke Check B's cross-table root-consistency check
    // (corrections "work" vs purpose_map "work" are intentionally
    // different senses). The infinitive key is unambiguous and isn't
    // shared with any other table, so this is a pure lookup-order fix,
    // no data changes. Fixes "he works" -> "Ua Kam ka·a" without
    // touching the bare "work" key's existing (correct, for its own
    // callers) value.
    if (lookupGaro('to ' + stripped)) return lookupGaro('to ' + stripped);
    // RC-CANDIDATE-035 fix (2026-07-31, Claude B): the bare stripped-form
    // lookup below has no way to tell a verb stem from a same-spelled
    // English pronoun, since master_dictionary.json's `pos` field is
    // null on every entry (same documented gap as the "bed"/"down"
    // noun-guards above and analyzeGrammar's subject-coherence check).
    // Root-caused live: "using" strips (ing$ rule) to "us", which is
    // not a verb root but IS a key in pronoun_map.json ("us" ->
    // "An·ching·ko"/"Chingna" depending on lookup path) - so this
    // fallback returned the pronoun's Garo form as if it were "using"'s
    // verb translation. Confirmed: translate("she is using her phone")
    // -> "Ua Uni phone·ko Chingna", a stray token with no connection to
    // "using" (which correctly has no dictionary verb entry).
    // PRONOUN_MAP is authoritative, closed, and already used elsewhere
    // in the grammar pipeline for exactly this purpose (identifying
    // pronouns) - reusing it here is a general, principled guard against
    // this whole collision class, not a single-word patch. "using" itself
    // remains correctly unresolved (returns null, sentence falls through
    // to sov-assembly/morphology per the normal cascade) - no new Garo
    // vocabulary invented for "use/using", which is still genuinely
    // absent from the dictionary in its -ing form.
    if (lookupGaro(stripped) && !(stripped in PRONOUN_MAP)) return lookupGaro(stripped);
    // English y->ied spelling change: 'studied' strips to 'studi', not
    // 'study' (found 2026-07-05) - try restoring the 'y'.
    if (/i$/.test(stripped)) {
      const yForm = stripped.slice(0, -1) + 'y';
      if (IRREGULAR_VERBS[yForm]) return IRREGULAR_VERBS[yForm];
      if (lookupGaro(yForm)) return lookupGaro(yForm);
    }
    // Silent-e "+s" fallback (found 2026-07-22, page-113-115 vocab
    // testing): "tickles" strips to "tickl" via the es$ branch above,
    // which isn't a real word, so the verb search loop in
    // analyzeGrammar silently rejected it and mis-picked a later noun
    // as the verb instead ("she tickles the baby" -> "Ua gen·da",
    // dropping the verb; also confirmed on "likes"/"hopes"/"closes").
    // Root cause: verbs whose base already ends in a silent 'e'
    // (tickle, like, hope, close) just add a bare 's' for 3rd-person,
    // but that superficially looks identical to a genuine sibilant -es
    // form (watches, fixes). Restoring the 'e' as a fallback here only
    // fires when the es$-stripped form didn't resolve, so genuine -es
    // verbs (which resolve one line up) are completely unaffected.
    if (/es$/.test(w) && !/e$/.test(stripped)) {
      const eForm = stripped + 'e';
      if (IRREGULAR_VERBS[eForm]) return IRREGULAR_VERBS[eForm];
      if (lookupGaro(eForm)) return lookupGaro(eForm);
    }
  }
  return null;
}

export function stripToStem(garoWord) {
  if (!garoWord) return garoWord;
  return garoWord.replace(/a$/i, '');
}
