/**
 * sentenceBuilder.js
 * Extracted from translationEngine.js (2026-07-29, BACKLOG-003 Phase 6).
 *
 * Pure extract-method: assembleSentenceSOV, assembleGrammar,
 * translateIfClause, translateMultiClause moved verbatim, zero logic
 * change, all historical bug-fix comments preserved exactly.
 *
 * NOTE — deliberate circular import: translateIfClause/translateMultiClause
 * call back into translate() (translationEngine.js), which in turn calls
 * into this module. This is safe under ES modules because `translate` is
 * only referenced inside async function bodies here — never at module
 * top-level/evaluation time — so by the time it's actually invoked, both
 * modules have finished initializing. Verified working via the full
 * 237-sentence stress benchmark (byte-identical before/after) and the
 * dedicated if-clause/multi-clause regression tests, both of which
 * exercise this exact call path.
 *
 * Overlap note (per docs/ARCHITECTURE.md's Phase 6 scoping task —
 * documented, not resolved, since resolving it would be a behavior
 * change, not a pure move): assembleSentenceSOV and assembleGrammar are
 * NOT redundant with each other despite the similar name. assembleGrammar
 * consumes analyzeGrammar's structured {subject,verb,object,...} output
 * and requires a recognized subject (pronoun or coherent NP) to produce
 * anything. assembleSentenceSOV is the fallback for everything
 * analyzeGrammar can't structure — it works directly off the raw word
 * list with no subject requirement, using looser word-by-word lookup +
 * verb/non-verb classification. translate() tries assembleGrammar first
 * (step 6) and only falls through to assembleSentenceSOV (step 6.5) if
 * that fails — a real two-tier cascade, not duplicate logic.
 */

import IRREGULAR_VERBS from './data/irregular_verbs.json' with { type: 'json' };
import PURPOSE_MAP from './data/purpose_map.json' with { type: 'json' };
import PRONOUN_MAP from './data/pronoun_map.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import { lookup, lookupGaro } from './lookupEngine.js';
import { applyNegation, applyTense, stripToStem } from './morphologyEngine.js';
import { STOP_WORDS, AUXILIARY_SKIP, MID_JOIN_CONNECTIVES } from './normalizationEngine.js';
import { translate } from './translationEngine.js';

export function assembleSentenceSOV(words, isNegative = false, detectedTense = 'present') {
  // RC-CANDIDATE-018 fix, part (b) (2026-07-18, Claude A confirmed
  // engineering-only): AUXILIARY_SKIP excluded here too, not just
  // STOP_WORDS — "will" specifically has its own master_dictionary.json
  // entry ("·gen") and was being translated as an ordinary content word,
  // landing in nonVerbs and printed as a floating orphan token ("Achak Mi
  // ·gen Cha·a") instead of ever reaching the verb. Root cause 1/2 from
  // the Project Owner's directive: auxiliary detection must happen
  // before dictionary lookup, and the tense marker belongs suffixed onto
  // the verb, not treated as independent lexical content. This is the
  // fallback path's fix; part (a) (analyzeGrammar's NP-subject coherence
  // check) routes more sentences away from needing this fallback at all,
  // but adjective-modified subjects and other RC-010-documented
  // exclusions still legitimately reach this function and need working
  // tense attachment regardless.
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()) && !AUXILIARY_SKIP.has(w.toLowerCase()));
  if (!content.length) return null;
  // RULE-044/NV-047 movement-locative override — see fix comment above
  // this function's diff for full rationale. "going" is checked against
  // the raw (punctuation-stripped) word list rather than `content`,
  // since AUXILIARY_SKIP already strips a bare "going" token from
  // `content` in some constructions — the movement signal itself must
  // still be detected even when "going" doesn't survive as its own
  // content word.
  const hasMovementVerbSignal = words.some(w => w.toLowerCase().replace(/[^a-z]/g,'') === 'going');
  const translated = content.map(w => {
    const lw = w.toLowerCase().replace(/[^a-z'·]/g,'');
    if (lw === 'where' && hasMovementVerbSignal) return 'Bachi';
    // RC-CANDIDATE-035 fix (2026-07-31, Claude B): same collision class
    // as the findVerbForm fix in morphologyEngine.js, independently
    // present here since this function does its own ing$/ed$/s$
    // stripping rather than delegating to findVerbForm. "using" strips
    // to "us", which is a dictionary/pronoun entry ("Chingna"), not a
    // verb root — without this guard "she is using her phone" picked up
    // a stray "Chingna" token with no connection to "using". Guarding
    // only the ing$ stripped form (the one implicated in the confirmed
    // live repro) rather than all three stripped forms, since ed$/s$
    // haven't been shown to collide and broadening the guard past the
    // confirmed root cause risks masking genuine ed$/s$-stripped verbs.
    const ingStripped = lw.replace(/ing$/,'');
    const ingLookup = (ingStripped !== lw && !(ingStripped in PRONOUN_MAP)) ? lookupGaro(ingStripped) : null;
    return lookupPhrase(lw) || lookupGaro(lw)
      || IRREGULAR_VERBS[lw]
      || ingLookup || lookupGaro(lw.replace(/ed$/,''))
      || lookupGaro(lw.replace(/s$/,'')) || null;
  });
  const validTranslations = translated.filter(Boolean);
  if (!validTranslations.length) return null;
  // Build result using only words that have translations
  const pairs = content.map((w, i) => ({ eng: w, garo: translated[i] })).filter(p => p.garo);
  if (pairs.every(p => p.garo === p.eng)) return null;
  const verbs = [], nonVerbs = [];
  // isIrregularVerb tracked per verb (RC-CANDIDATE-018 part b): a
  // pre-inflected IRREGULAR_VERBS form (e.g. "eating"->"cha·enga") can't
  // be safely re-suffixed with gen/jawa, same guard analyzeGrammar
  // already applies to its own verb resolution — without it, future
  // tense on an irregular verb here would double-inflect.
  let lastVerbIsIrregular = false;
  pairs.forEach(({ eng, garo: t }) => {
    const lw = eng.toLowerCase().replace(/[^a-z]/g,'');
    const e = lookup(eng.toLowerCase());
    // Original regex only caught enga/aha/gen/bo/na endings and missed the
    // common present-tense pattern (root+raka+a, e.g. "Cha·a", "Re·a") —
    // meaning words like "eat"/"go" were classified as nonVerbs here and
    // never received tense/negation suffixes at all. Added ·a as a verb
    // signal (raka immediately before a trailing 'a').
    if (e?.pos === 'verb' || /enga$|aha$|gen$|bo$|na$|·a$/.test(t)) {
      verbs.push(t);
      lastVerbIsIrregular = !!(IRREGULAR_VERBS[lw] || IRREGULAR_VERBS[lw.replace(/ing$|ed$|es$|s$/, '')]);
    } else {
      nonVerbs.push(t);
    }
  });
  // Future-tense suffix attachment (RC-CANDIDATE-018 part b) — same
  // convention and same Rule 5 exception as analyzeGrammar's verb
  // resolution (line ~397): negative future is stem+jawa directly, never
  // gen+ja stacked (confirmed bug shape 2026-07-05, 'Cha·genja').
  if (detectedTense === 'future' && verbs.length && !lastVerbIsIrregular) {
    if (isNegative) {
      verbs[verbs.length - 1] = applyTense(verbs[verbs.length - 1], 'negative_future');
    } else {
      verbs[verbs.length - 1] = applyTense(verbs[verbs.length - 1], 'future');
    }
  } else if (isNegative && verbs.length) {
    // Apply negation suffix to the verb, same convention as analyzeGrammar's
    // main path (fixes the gap Claude B found: this fallback function had
    // zero negation awareness, so "didn't eat" / "doesn't understand" lost
    // their negation entirely once 8ead984 added the contractions to
    // STOP_WORDS — they were stripped here with nothing left to signal them).
    // Rule 18/27: see applyNegation() definition for rationale.
    verbs[verbs.length - 1] = applyNegation(verbs[verbs.length - 1]);
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

// fuzzyMatch extracted to src/normalizationEngine.js (2026-07-26, BACKLOG-003 Phase 7).


// ── PURPOSE VERB MAP ─────────────────────────────────────────────────────────
// PURPOSE_MAP extracted to src/data/purpose_map.json (2026-07-09,
// BACKLOG-001). Data verified byte-for-byte identical before the swap.
//
// HISTORICAL NOTE (stale as of 2026-08-03, left for context): this
// comment originally flagged 'search':'am·e·nik·na' as a stale pre-
// Rule-32 form still live in purpose-clause constructions. That was
// fixed 2026-07-10 (RC-CANDIDATE-006, commit d0e6c06) — purpose_map.json
// now holds 'Sandi·na' — before this comment was copied verbatim during
// the 2026-07-29 extraction, so it described already-fixed behavior for
// over three weeks. Runtime Engineering Audit (2026-08-03) re-verified
// current purpose_map.json value directly; no live defect here.

export function assembleGrammar(grammar) {
  if (!grammar || !grammar.subject) return null;
  const parts = [];
  parts.push(grammar.subject.garo);

  // Possessive + Object + -ko/-o marker
  // RC-CANDIDATE-002 fix (Claude A approved, 2026-07-10): use ·o for a
  // confirmed locative adjunct (in/on/at + noun), ·ko otherwise (default,
  // unchanged behavior for genuine direct objects).
  //
  // Engineering fix (2026-07-29, Claude B, found via live quality check,
  // not a regression case report): the `garo !== '[UNKNOWN]'` guard here
  // meant an unresolved object (e.g. "smartphone" — not in the
  // dictionary) was silently OMITTED from `parts` entirely, along with
  // its possessive, rather than included as '[UNKNOWN]' — which defeated
  // the `result.includes('[UNKNOWN]')` safety check below (line ~192):
  // that check can only catch '[UNKNOWN]' if it's actually present in the
  // joined string. Confirmed live: "she is using her smartphone" ->
  // "Ua Chingna" (subject+verb only, entire object AND possessive
  // silently vanished), returned as method='grammar-assembly',
  // confidence=0.82 — indistinguishable from a fully correct
  // translation, no signal anything was dropped. Now always pushes
  // possessive+object (or object) when an object exists, so an unknown
  // object correctly makes it into `result`, correctly trips the
  // existing '[UNKNOWN]' check, and correctly falls through to the next
  // cascade step (sov-assembly / morphology / passthrough) instead of
  // confidently returning an incomplete sentence. Pure engineering fix —
  // restores the behavior the existing check was already written to
  // provide, no new Garo vocabulary or grammar invented.
  const objMarker = (grammar.object && grammar.object.isLocativeAdjunct) ? '·o' : '·ko';
  if (grammar.possessive && grammar.object) {
    const objText = grammar.object.garo === '[UNKNOWN]' ? grammar.object.garo : grammar.object.garo.toLowerCase();
    parts.push(grammar.possessive.garo + ' ' + objText + objMarker);
  } else if (grammar.object) {
    const objText = grammar.object.garo === '[UNKNOWN]' ? grammar.object.garo : grammar.object.garo.toLowerCase();
    parts.push(objText + objMarker);
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
  } else if (grammar.isNegative && grammar.object && grammar.object.isLocativeAdjunct) {
    // Negative-locative copula (Thangseng-confirmed, RC-CANDIDATE-017,
    // docs/PENDING_LINGUISTIC_PROPOSAL_20260722_thangseng_batch.md item
    // 7): "the book is not on the table" has no explicit verb for
    // analyzeGrammar to find — English "is" is implicit/copular, so
    // grammar.verb stayed null and the whole clause (negation included)
    // was silently dropped before this fix. Thangseng's own example:
    // "Ki·tap tableo ong·ja" (book table-LOC exist-NEG). Locative marker
    // stays on the noun (already handled above via objMarker); this only
    // supplies the missing negative-existential verb. Only fires for the
    // negative case — the affirmative copula ("the book is on the
    // table") is a separate, still-open construction, not confirmed by
    // Thangseng, not guessed at here.
    parts.push('ong·ja');
  }

  if (parts.length < 2) return null;
  const result = parts.join(' ');
  if (result.includes('[UNKNOWN]')) return null;
  return result;
}


// Input normalization — apostrophe contraction expansion
// normalizeInput extracted to src/normalizationEngine.js (2026-07-26, BACKLOG-003 Phase 7).


// PAST_TO_ROOT and PROGRESSIVE_MAP removed 2026-07-06 — confirmed zero call
// sites (grepped, only IRREGULAR_VERBS + applyTense's generic suffix logic
// are actually used for past/progressive forms). Flagged as dead code in
// docs/ARCHITECTURE.md §9, verified safe to delete, removed as low-risk P2
// tech-debt cleanup per the V1.0 launch sprint work package.

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
// MID_JOIN_CONNECTIVES extracted to src/normalizationEngine.js (2026-07-26, BACKLOG-003 Phase 7).

// Strips a verb's bare root-form final "a" to get its stem for suffix
// attachment, per the confirmed pattern: Cha·a (eat) -> stem Cha· ->
// Cha·ode (if eat). Kata (run, no raka) -> stem Kat -> Katode. Only
// strips a single trailing "a" — does not touch the raka mark itself,
// consistent with "raka is part of the root, suffixes never carry it."
// stripToStem extracted to src/morphologyEngine.js (2026-07-25, BACKLOG-003 Phase 3).

// Implements the confirmed -ode if-clause pattern. Only activates when
// the input starts with "if" (English-side trigger), otherwise returns
// null and the normal cascade continues. Translates the condition
// clause's final word via the existing pipeline, strips it to its stem,
// and appends "ode" — does NOT invent any new Garo vocabulary, only
// reshapes an already-correctly-translated word per a confirmed suffix
// rule. The consequence clause is translated entirely normally.
export async function translateIfClause(input) {
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

export async function translateMultiClause(input) {
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

