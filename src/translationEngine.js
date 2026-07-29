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
import IRREGULAR_VERBS from './data/irregular_verbs.json' with { type: 'json' };
import PURPOSE_MAP from './data/purpose_map.json' with { type: 'json' };
import { lookupPhrase } from './data/phrase_maps.js';
import { countNoun, parseCountingPhrase } from './garo_classifier.js';
import { corrections, normalizeEntry, EN_INDEX, lookup, lookupGaro } from './lookupEngine.js';
import { applyNegation, applyTense, stripToStem } from './morphologyEngine.js';
import { STOP_WORDS, AUXILIARY_SKIP, fuzzyMatch, normalizeInput, MID_JOIN_CONNECTIVES } from './normalizationEngine.js';
// analyzeGrammar, tryWithoutGijaConstruction extracted to
// src/grammarEngine.js (2026-07-29, BACKLOG-003 Phase 5). Verified zero
// logic change via byte-identical 237-sentence stress benchmark diff.
import { analyzeGrammar, tryWithoutGijaConstruction } from './grammarEngine.js';
export { analyzeGrammar };
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

function assembleSentenceSOV(words, isNegative = false, detectedTense = 'present') {
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
// NOTE (found during extraction, not fixed — linguistic decision, not
// engineering): 'search':'am·e·nik·na' is the pre-Rule-32 form, which
// RULE-032/VALIDATION_CORPUS.md's `search`=`Sandia` was supposed to
// replace. It's still LIVE and reachable here: "i want to search"
// currently produces "Anga am·e·nik·na sikenga" (verified via translate()
// before this extraction), even though standalone "search" correctly
// produces "Sandia" via corrections.json (which this map never reaches
// for that input, since corrections is checked first in the cascade).
// This map is only consulted for purpose-clause constructions ("want to
// X", "go to X", etc.), which is a different code path than the one
// Rule 32 fixed — so the fix didn't propagate here. Logged as a new
// candidate regression case (docs/PENDING_REGRESSION_CASES.md) rather
// than corrected in this commit, since choosing the right purpose-form
// of "search" is Claude A's call, not mine.

function assembleGrammar(grammar) {
  if (!grammar || !grammar.subject) return null;
  const parts = [];
  parts.push(grammar.subject.garo);

  // Possessive + Object + -ko/-o marker
  // RC-CANDIDATE-002 fix (Claude A approved, 2026-07-10): use ·o for a
  // confirmed locative adjunct (in/on/at + noun), ·ko otherwise (default,
  // unchanged behavior for genuine direct objects).
  const objMarker = (grammar.object && grammar.object.isLocativeAdjunct) ? '·o' : '·ko';
  if (grammar.possessive && grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.possessive.garo + ' ' + grammar.object.garo.toLowerCase() + objMarker);
  } else if (grammar.object && grammar.object.garo !== '[UNKNOWN]') {
    parts.push(grammar.object.garo.toLowerCase() + objMarker);
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
