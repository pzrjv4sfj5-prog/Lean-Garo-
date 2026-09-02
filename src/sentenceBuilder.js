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
import { lookup, lookupGaro, VERB_LEMMAS } from './lookupEngine.js';
import { applyNegation, applyTense, stripToStem, getConjugationRoot } from './morphologyEngine.js';
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
  // Negation-word guard (2026-08-29, Claude B, session migration):
  // mirrors grammarEngine.js's own identical guard (2026-07-29,
  // "Negation-word guard" comment, object-extraction loop) — "not"/
  // "never" are neither STOP_WORDS nor AUXILIARY_SKIP, so a bare "not"
  // was reaching this function's own translation attempt, failing
  // (lookupGaro('not') has no entry — negation is handled entirely via
  // the isNegative flag below, never as lexical content), and being
  // silently dropped by the old `.filter(p => p.garo)` step (same silent-
  // drop bug class fixed above). Confirmed live: "a big dog will not eat
  // rice" — content included "not" — sov-assembly's own translation bail
  // now (correctly) fires because "not" resolves to '[UNKNOWN]', losing
  // the otherwise-correct negative-future assembly entirely, a real
  // regression from the fix above. Not a contested linguistic call, same
  // reasoning as grammarEngine's own precedent: a bare negation particle
  // is never real translatable content once isNegative already carries
  // this sentence's negation status (detected independently, upstream,
  // via analyzeGrammar's own /n't|\b(not|never)\b/i pattern) — dropping
  // it here loses no information. Scoped to exactly grammarEngine's own
  // two words, not a broader STOP_WORDS change (smaller, safer diff;
  // STOP_WORDS is shared by other call sites not audited this session).
  const content = words.filter(w => !STOP_WORDS.has(w.toLowerCase()) && !AUXILIARY_SKIP.has(w.toLowerCase()) && !/^(not|never)$/.test(w.toLowerCase()));
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
    // Item 3 fix (2026-08-23, Claude B, session migration): the s$-only
    // strip left sibilant-ending plurals ("boxes"->"boxe", "wishes"->
    // "wishe") unresolved, so the noun was silently dropped from output
    // entirely rather than surfacing wrong or [UNKNOWN] - confirmed live
    // via "...four heavy boxes..." translating with box/bak·so completely
    // absent. Try the s$ strip first (existing, correct for the common
    // case: "dogs"->"dog"), then fall back to an es$ strip only if that
    // failed to resolve ("boxes"->"box"). Ordered so the pre-existing s$
    // path is untouched for every word it already handled correctly.
    return lookupPhrase(lw) || lookupGaro(lw)
      || IRREGULAR_VERBS[lw]
      || ingLookup || lookupGaro(lw.replace(/ed$/,''))
      || lookupGaro(lw.replace(/s$/,'')) || lookupGaro(lw.replace(/es$/,'')) || null;
  });
  const validTranslations = translated.filter(Boolean);
  if (!validTranslations.length) return null;
  // OOV/proper-noun fix (2026-08-29, Claude B, session migration): this
  // used to be `.filter(p => p.garo)`, which silently DROPPED any content
  // word whose translation attempt came back null (most commonly an
  // out-of-dictionary proper noun — city/place names like "guwahati" or
  // "delhi" — but any unresolved content word hits the same path) instead
  // of surfacing it. Confirmed live: translate("i live in guwahati") ->
  // "Anga donga" (the destination vanished entirely, no error, no
  // [UNKNOWN], confidence still reported 0.75 as if nothing were missing)
  // — the same silent-drop shape already fixed once in assembleGrammar's
  // object/location handling (2026-07-29) and again in step 7 morphology
  // (RC-CANDIDATE-034, 2026-07-31), but this function's own `pairs` step
  // had never been touched by either fix. Every content word is now kept
  // in `pairs`, substituting an explicit '[UNKNOWN]' marker for a failed
  // lookup instead of removing the word — same convention used
  // everywhere else in this codebase.
  const pairs = content.map((w, i) => ({ eng: w, garo: translated[i] || '[UNKNOWN]' }));
  if (pairs.every(p => p.garo === p.eng)) return null;
  const verbs = [], nonVerbs = [];
  // isIrregularVerb tracked per verb (RC-CANDIDATE-018 part b): a
  // pre-inflected IRREGULAR_VERBS form (e.g. "eating"->"cha·enga") can't
  // be safely re-suffixed with gen/jawa, same guard analyzeGrammar
  // already applies to its own verb resolution — without it, future
  // tense on an irregular verb here would double-inflect.
  let lastVerbIsIrregular = false;
  // Item 3 fix (2026-08-23, Claude B, session migration): the /·a$/
  // verb-signal regex (added for the "eat"/"go" root-form fix above)
  // also matches many attributive adjectives, since Garo's raka+a
  // pattern is used for both stative predicates AND adjective glosses
  // ("Chu·a"=tall, "Chon·a"=small). No POS data exists anywhere in this
  // repo to tell these apart (confirmed RC-CANDIDATE-003, see
  // grammarEngine.js's RC-CANDIDATE-010 comment) - genuinely an
  // architectural boundary, not a gap to guess around by inventing a
  // tall/small/etc. exclusion list (same failure mode RC-CANDIDATE-003
  // already rejected for "down"/"bed").
  // Reproduced: "the tall man is carrying four heavy boxes to the
  // river" put BOTH "tall"->Chu·a and "carrying"->gat·a in `verbs`,
  // stranding the adjective at the sentence tail, disjoint from "man".
  // Fix avoids guessing which word IS an adjective; instead it uses a
  // structural fact already implicit in this function's own design (one
  // verbs[] entry receives the tense/negation suffix) - a sentence has
  // exactly one finite predicate, so when multiple words match the
  // verb-signal regex, only the LAST one (closest to the SOV-final verb
  // slot this whole engine assumes) is treated as the verb; earlier
  // matches fall back to nonVerbs, which preserves their original
  // relative position - keeping an attributive adjective adjacent to
  // the noun it preceded, with no need to know it's an adjective at all.
  // Confirmed harmless for the true single-predicate-adjective case
  // ("a big dog is sleeping"/RC-CANDIDATE-018 tests): when only one word
  // matches, it's still elected as the (only) verb exactly as before.
  // Item 5 fix (2026-08-23, Claude B, session migration): the /·a$/
  // suffix regex only catches verbs whose Garo form happens to carry a
  // recognizable tense/mood suffix - bare-root Garo verb citations with
  // no suffix at all ("Nia"=see) matched nothing, so "did you see the
  // two small dogs" never identified "see" as the verb at all (confirmed
  // live: old output put "Nia" among nonVerbs). Added VERB_LEMMAS (see
  // lookupEngine.js) as a second, DEFINITIVE signal, checked against the
  // ENGLISH word (not the Garo output), so it works regardless of which
  // Garo suffix shape the translation happens to have.
  //
  // The two signals are NOT treated as equally trustworthy. lemmaSignal
  // is ground truth (the dictionary's own "to X" classification);
  // suffixSignal is a heuristic already known to false-positive on
  // adjectives (item 3, above). Naively taking "last match wins" across
  // both, as item 3's fix alone did, breaks exactly this sentence: "see"
  // (true verb, lemma-confirmed) sits BEFORE "small" (false-positive
  // suffix match, adjective) in English word order, so plain last-wins
  // picked the adjective. Fix: whenever at least one lemma-confirmed
  // verb exists anywhere in the sentence, that signal alone decides the
  // verb (last such match, still per SOV convention) and the ambiguous
  // suffix signal is ignored entirely. Only fall back to suffix-signal
  // last-wins when no word matches VERB_LEMMAS at all - i.e. exactly the
  // item 3 fix, preserved unchanged for verbs the 939-word lemma list
  // doesn't happen to cover ("eat", "sleep", etc., confirmed missing).
  const lemmaSignal = pairs.map(({ eng }) => {
    const lw = eng.toLowerCase().replace(/[^a-z]/g,'');
    return VERB_LEMMAS.has(lw)
      || VERB_LEMMAS.has(lw.replace(/ing$/,''))
      || VERB_LEMMAS.has(lw.replace(/ed$/,''))
      || VERB_LEMMAS.has(lw.replace(/s$/,''));
  });
  const suffixSignal = pairs.map(({ eng, garo: t }) => {
    const e = lookup(eng.toLowerCase());
    return e?.pos === 'verb' || /enga$|aha$|gen$|bo$|na$|·a$/.test(t);
  });
  const hasLemmaMatch = lemmaSignal.some(Boolean);
  const verbSignal = hasLemmaMatch ? lemmaSignal : suffixSignal;
  let lastVerbIdx = -1;
  for (let i = verbSignal.length - 1; i >= 0; i--) {
    if (verbSignal[i]) { lastVerbIdx = i; break; }
  }
  pairs.forEach(({ eng, garo: t }, i) => {
    const lw = eng.toLowerCase().replace(/[^a-z]/g,'');
    if (i === lastVerbIdx) {
      // go/re·ang- stem-decoupling fix, part 2 (2026-09-02, Claude B —
      // closes Finding 1, docs/CLAUDE_B_TRACE_FINDING1_20260902.md).
      // This function resolves the elected verb via plain lookupGaro
      // (see `translated` above), which correctly returns the bare-form
      // root ('re·a' for "go" — VERIFIED/HIGH, NV-100) but is NOT the
      // stem tense/negation suffixes should attach to for verbs with a
      // dedicated conjugation_roots.json entry (same decoupling already
      // applied in grammarEngine.js:401/422 for the grammar-assembly
      // path). Without this, any subjectless sentence (no pronoun, no
      // a/an/the NP — the only way this fallback is reached at all, per
      // sentenceBuilder.js's own module comment above) using such a verb
      // fell through to this SECOND, independent verb-resolution path
      // with zero knowledge of the decoupling table, producing malformed
      // output ("did not go" -> "re·ja" instead of "Re·angja", confirmed
      // root-caused in the trace doc above). getConjugationRoot() is a
      // documented no-op for every verb without a table entry (returns
      // garoVerb unchanged), so this is behavior-identical for every verb
      // except the ones the table exists to correct — same guarantee
      // grammarEngine.js's callers already rely on. Scoped to exactly the
      // elected verb slot (lastVerbIdx) — non-verb content words in
      // `nonVerbs` are untouched.
      verbs.push(getConjugationRoot(lw, t));
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
  const result = [...nonVerbs, ...verbs].join(' ');
  // Mirrors assembleGrammar's own `result.includes('[UNKNOWN]')` bail
  // (see that function, ~line 314): this function sits directly above
  // step 7 (morphology) in translate()'s cascade, and morphology already
  // knows how to surface '[UNKNOWN]' correctly and report a lower,
  // honest confidence (0.65) for a partially-resolved sentence. Rather
  // than have THIS function confidently return a sentence with a bare
  // "[UNKNOWN]" token stitched into otherwise-fluent SOV output at
  // sov-assembly's own (higher, 0.75) confidence, bail here so
  // translate() falls through to the weaker-but-honest step instead —
  // same tradeoff assembleGrammar already made one tier up, now applied
  // consistently at this tier too. A fully-resolved sentence (no
  // '[UNKNOWN]' pairs) is completely unaffected.
  if (result.includes('[UNKNOWN]')) return null;
  return result;
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

  // Destination/location + -chi marker (docs/BUG_location_noun_dropped.md
  // fix, engine-level 2026-08-12). Placed right after subject, ahead of
  // object/purpose/verb — matches the ordering that bug report scoped:
  // Subject + Location-chi + Object-ko + Purpose-na + Verb.
  if (grammar.location) {
    const locText = grammar.location.garo === '[UNKNOWN]' ? grammar.location.garo : grammar.location.garo.toLowerCase();
    // Precomposed-value guard (2026-08-20, Claude B, engineering-only):
    // analyzeGrammar now prefers an already-VERIFIED "to X" phrase entry
    // (e.g. "bajalchi") over bare-noun composition when one exists — that
    // value already includes the -chi suffix, so appending it again here
    // would double it ("bajalchi·chi"). Only the bare-noun fallback case
    // (unconfirmed destinations, no dedicated "to X" entry) still needs
    // the suffix appended here.
    parts.push(/chi$/.test(locText) ? locText : locText + '·chi');
  }

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
  // Claude C audit Finding 2 fix (2026-08-04, Claude B): grammar.isQuestion
  // (set by analyzeGrammar for inverted-aux yes/no questions, e.g. "is he
  // going to school?") appends the general yes/no-question marker ' ma?' —
  // already confirmed as the correct general pattern via multiple existing
  // VERIFIED corrections.json entries ("are you going"->"...enga ma?",
  // "will you eat"->"...genma?"), not new linguistic content.
  return grammar.isQuestion ? result + ' ma?' : result;
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

