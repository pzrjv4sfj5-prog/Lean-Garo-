/**
 * grammarEngine.js
 * Extracted from translationEngine.js (2026-07-29, BACKLOG-003 Phase 5).
 *
 * Pure extract-method: analyzeGrammar and tryWithoutGijaConstruction moved
 * verbatim, zero logic change, all historical bug-fix comments preserved
 * exactly as-is (they document confirmed root causes, not just style).
 * Verified via 237-sentence stress benchmark byte-identical diff before/
 * after the move — see docs/ARCHITECTURE.md BACKLOG-003 Phase 5 entry.
 */

import IRREGULAR_VERBS from './data/irregular_verbs.json' with { type: 'json' };
import PURPOSE_MAP from './data/purpose_map.json' with { type: 'json' };
import PRONOUN_MAP from './data/pronoun_map.json' with { type: 'json' };
import POSSESSIVES from './data/possessives.json' with { type: 'json' };
import { NUMBER_WORDS } from './garo_classifier.js';
import { lookupGaro } from './lookupEngine.js';
import { lookupPhrase } from './data/phrase_maps.js';
import { applyNegation, applyTense, findVerbForm } from './morphologyEngine.js';
import { STOP_WORDS, AUXILIARY_SKIP } from './normalizationEngine.js';

export function analyzeGrammar(input) {
  if (!input || typeof input !== 'string') return null;
  const words = input.trim().split(/\s+/);

  // Claude C audit Finding 2 fix (2026-08-04, Claude B): inverted yes/no
  // questions ("is he going to school?") never reached grammar-assembly at
  // all — the subject/verb search below only recognizes subject-initial
  // (declarative) word order via PRONOUN_MAP[firstWord]; aux-inversion
  // ("is"/"are"/"was"/"were" + pronoun) fell through entirely, leaving
  // grammar.verb null, so assembleGrammar (requires grammar.subject)
  // returned null and the whole sentence dropped to assembleSentenceSOV,
  // which has no verb-tense assembly at all (confirmed live: "is he going
  // to school?" -> "Ua Skul", no verb at all, vs. declarative "he is going
  // to school" -> "Ua Skulgen", correct). Fix: recognize this one
  // closed-class inversion pattern (aux + pronoun) and normalize word order
  // to canonical SVO before the existing, working subject/verb logic runs —
  // same "closed-class word, not new guessing" discipline as
  // AUXILIARY_SKIP/STOP_WORDS elsewhere in this file. isQuestion is
  // threaded through to assembleGrammar, which appends ' ma?' — the general
  // yes/no-question marker already confirmed in multiple existing VERIFIED
  // corrections.json entries ("are you going"->"...enga ma?", "will you
  // eat"->"...genma?"), not new linguistic content invented here. Scoped
  // narrowly to pronoun subjects only (NP-subject inversion, e.g. "is the
  // teacher going...", is a separate, unconfirmed case — left untouched).
  let isQuestion = false;
  if (/^(is|are|was|were)$/i.test(words[0] || '') && PRONOUN_MAP[(words[1] || '').toLowerCase().replace(/[^a-z]/g,'')]) {
    isQuestion = true;
    words.splice(0, 1);
  }

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
  // RC-CANDIDATE-033 resolution (2026-07-31, Claude B): this array was
  // flagged as "computed every call, never consumed" - true for the
  // translation-assembly pipeline (assembleGrammar/assembleSentenceSOV
  // never read grammar.classifierHints to select a Garo classifier),
  // but re-verification found that diagnosis incomplete: it IS a real,
  // deliberate consumer surface - see the dedicated
  // "classifierHints includes jol...ge" test in
  // tests/unit/translationEngine.test.js, added 2026-07-11 specifically
  // to verify this regex-based classifier-detection logic independently
  // of full sentence assembly (per docs/grammar_rules_structured/
  // RULE-G-classifier.yaml's own note that jol/ge are "confirmed but
  // unimplemented" - i.e. deliberately staged ahead of integration, not
  // orphaned). Deleting this computation would silently break that
  // passing test and discard already-confirmed classifier data with no
  // correctness benefit; wiring it into live sentence output would be a
  // real behavior change requiring its own stress-benchmark
  // verification and arguably a classifier-selection design decision
  // outside pure engineering scope. Per "if verification disproves the
  // original diagnosis, correct the documentation before shipping":
  // resolving RC-033 as a documentation correction, not a code change -
  // see docs/PENDING_REGRESSION_CASES.md for the full writeup.
  const classifierHints = [];
  const li = input.toLowerCase();
  if (/\b(dog|cat|cow|bird|fish|animal|insect)\b/.test(li)) classifierHints.push({ classifier: 'mang', reason: 'animal noun' });
  if (/\b(person|man|woman|teacher|student)\b/.test(li)) classifierHints.push({ classifier: 'sak', reason: 'person noun' });
  if (/\b(money|rupee|coin)\b/.test(li)) classifierHints.push({ classifier: 'gong', reason: 'money noun' });
  if (/\b(book|paper|leaf)\b/.test(li)) classifierHints.push({ classifier: 'king', reason: 'flat object' });
  // jol/ge added 2026-07-11 - flagged by Claude A (PROJECT_STATUS.md,
  // notes.pdf transcript): this array only covered mang/sak/gong/king,
  // missing jol (long objects) and ge (pens/sticks). Both classifiers
  // already exist, confirmed, in garo_classifier.js's CLASSIFIER_MAP
  // (see 'pole'/'rod'/'staff'/'bamboo'->jol, 'pen'/'pencil'/'stick'->ge)
  // - this was a reconciliation gap between two separate classifier
  // tables, not a missing linguistic fact.
  if (/\b(pole|rod|staff|bamboo)\b/.test(li)) classifierHints.push({ classifier: 'jol', reason: 'long object' });
  if (/\b(pen|pencil|stick)\b/.test(li)) classifierHints.push({ classifier: 'ge', reason: 'pen/stick-like object' });

  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g,'');
  // Parser-boundary review (2026-07-12, before adding more special
  // cases): this positional "article + next word" heuristic has no way
  // to know whether that next word is the head noun ("the dog") or a
  // modifier ("the big dog" -> would wrongly grab "big"). No POS data
  // exists anywhere in this repo to disambiguate (master_dictionary.json
  // `pos` is null on every entry, confirmed during RC-CANDIDATE-003;
  // garo_classifier.js's CLASSIFIER_MAP is Garo counting classifiers, not
  // English POS; category_index.json is topical, not grammatical) - this
  // is a real architectural boundary, not a gap to guess around. Rather
  // than add a growing pile of per-word exclusions as each new adjective
  // surfaces (the same failure mode as RC-CANDIDATE-003's "down"/"bed"
  // list), this uses ONE general coherence check: only accept the
  // candidate if what follows it is nothing, a copula, or something that
  // resolves as a verb (reusing findVerbForm, not new heuristics). This
  // correctly rejects "big" in "a big dog" (fails the check, "dog" isn't
  // a verb) without ever needing to know "big" is an adjective, and
  // generalizes to any future adjective the same way. When rejected, the
  // sentence safely falls through to the existing sov-assembly fallback
  // instead of confidently mislabeling the subject.
  //
  // Explicitly and intentionally NOT covered by this fix (documented
  // boundary, not a silent gap): demonstrative-led subjects ("this dog"),
  // quantifier-led subjects ("two teachers"), possessive-headed subjects
  // as the sentence subject ("my dog" - POSSESSIVES already work
  // elsewhere but not as a subject-NP head here), coordinated subjects
  // ("the dog and the cat"), and any multi-word modifier before the head
  // noun beyond what the coherence check happens to reject safely. These
  // would need real NP-boundary detection, which needs real POS/parser
  // data this repository does not have - out of scope for this fix, not
  // silently promised as solved.
  // RC-CANDIDATE-018 fix, part (a) (2026-07-18, Claude A confirmed
  // engineering-only, root cause traced 2026-07-16): the NP-subject
  // coherence check below now recognizes AUXILIARY_SKIP (module-level,
  // shared with the verb-search loop and assembleSentenceSOV) the same
  // way it already recognized copulas/STOP_WORDS. Before this fix,
  // "the dog will eat rice" had nextTok="will", which matched neither
  // /^(is|are|was|were)$/ nor STOP_WORDS, so coherent=false and the
  // ENTIRE sentence fell through to the much weaker assembleSentenceSOV
  // fallback (bypassing every grammar-assembly fix, including the
  // future-tense suffix attachment at line ~397 below, which already
  // correctly handles detectedTense==='future' for pronoun subjects -
  // confirmed live: "she will go" -> "Ua Re·anggen"). Only the
  // entry-to-grammar-assembly gate was broken, not the tense-attachment
  // logic itself.
  let npSubjectGaro = null, npSubjectEnglish = null, subjectEndIndex = 0;
  if (!PRONOUN_MAP[firstWord] && /^(a|an|the)$/.test(firstWord) && words.length > 1) {
    const nounWord = words[1].toLowerCase().replace(/[^a-z]/g,'');
    if (!STOP_WORDS.has(nounWord) && !POSSESSIVES[nounWord]) {
      const g = lookupGaro(nounWord);
      const nextTok = words[2] ? words[2].toLowerCase().replace(/[^a-z]/g,'') : null;
      // Note: deliberately NOT using findVerbForm(nextTok) here, even
      // though it looks like a natural "is this a verb" check - it isn't
      // one. findVerbForm falls back to a plain lookupGaro, so it
      // succeeds on ANY dictionary word, not just verbs (proven directly:
      // findVerbForm('dog') succeeds because 'dog' is a valid noun entry,
      // which would have wrongly marked "a big dog" as coherent since
      // "dog" "resolves"). Restricting to copula/stopword/auxiliary/absent
      // is strictly less coverage but is the only signal actually
      // verifiable without real POS data - see the parser-boundary review
      // above. AUXILIARY_SKIP added here (RC-CANDIDATE-018) for the same
      // reason STOP_WORDS already was: these are closed-class words this
      // file already treats as structural elsewhere, not new guessing.
      const coherent = !nextTok || /^(is|are|was|were)$/.test(nextTok) || STOP_WORDS.has(nextTok) || AUXILIARY_SKIP.has(nextTok);
      if (g && coherent) { npSubjectGaro = g; npSubjectEnglish = words[1]; subjectEndIndex = 1; }
    }
  }

  if (PRONOUN_MAP[firstWord] || npSubjectGaro) {

    subject = PRONOUN_MAP[firstWord]
      ? { english: words[0], garo: PRONOUN_MAP[firstWord] }
      : { english: npSubjectEnglish, garo: npSubjectGaro };
    const subjectWords = new Set(words.slice(0, subjectEndIndex + 1).map(w => w.toLowerCase().replace(/[^a-z]/g,'')));

    // Find verb — skip stop words, possessives, and auxiliary tense markers
    const SPECIAL_TENSES = ['discontinued','completed','chim','pastcont'];
    let pendingLocativeVerbGuard = false;
    for (let i = subjectEndIndex + 1; i < words.length; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
      if (STOP_WORDS.has(w) || POSSESSIVES[w] || AUXILIARY_SKIP.has(w)) {
        if (/^(in|on|at)$/.test(w)) pendingLocativeVerbGuard = true;
        continue;
      }
      // Number-word guard (2026-07-13): reuses the existing NUMBER_WORDS
      // table (garo_classifier.js) rather than a new heuristic - same
      // "no POS data" collision class the parser-boundary review
      // predicted (quantifiers named explicitly as a future breakage of
      // the same root assumption). Without this, "he has two dogs" wrongly
      // picked "two" as the verb (resolves via lookupGaro to the number
      // word "Gni"), leaving "has dogs" unresolved as the object
      // ("[UNKNOWN]"). A number word is never the main verb.
      if (NUMBER_WORDS[w] !== undefined) continue;
      // RC-CANDIDATE-010 fix (2026-07-12): a word immediately following a
      // locative preposition (in/on/at), possibly with an intervening
      // article ("on the table"), is a locative-adjunct object, never the
      // main verb - generalizes the RC-CANDIDATE-003 pattern ("down"/
      // "bed" hardcoded below) instead of hardcoding every new noun this
      // collides with. Root cause: enabling NP subjects to reach
      // grammar-assembly (this same fix) exposed this far more often than
      // before, since "NP is in/on/at NOUN" sentences never reached this
      // loop previously. Without this guard, "the book is on the table"
      // -> "table" gets picked as the verb (resolves via lookupGaro)
      // instead of being left for the object/locative loop below,
      // producing "boi te·bil" with no verb-slot content and no ·o marker.
      // Uses the same pending-flag pattern as the object loop's locative
      // tracking (consumed on the next real word, not gated on adjacency)
      // for the same reason: articles/other stopwords can sit between the
      // preposition and the noun.
      if (pendingLocativeVerbGuard) { pendingLocativeVerbGuard = false; continue; }
      // RC-CANDIDATE-003 fix (Claude A approved, 2026-07-10): 'down' is a
      // directional adverb with its own correct standalone translation
      // (corrections.json 'down'->'Ka·ma'), but this verb-search loop
      // doesn't distinguish part of speech - it was picking 'down' as the
      // VERB in "I am lying down" (since it resolves via lookupGaro) while
      // the actual verb 'lying' fell through unrecognized into the object
      // slot, producing 'Anga Ka·ma' (nonsense: "I [verb-form-of] down").
      // Same lexical-split class as ring/ring· (NV-010) - two different
      // words colliding, not a grammar gap. Excluding it here does not
      // touch the corrections.json entry, which remains correct for
      // standalone "down" and other constructions.
      if (w === 'down') continue;
      // RC-CANDIDATE-003 fix, part 2 (Claude A directive was "guard the
      // fallback so it doesn't apply to words already present as nouns" -
      // that's not currently buildable as a GENERAL rule: master_
      // dictionary.json's `pos` field is null on every single entry,
      // there's no noun/verb tag anywhere in the data. Implementing the
      // one CONFIRMED instance narrowly instead of inventing new POS-
      // tagging infrastructure this session. "bed" was being picked as
      // the verb in "I am lying in bed" (resolves via lookupGaro to the
      // noun Palang) while 'lying' fell through unrecognized, then got a
      // past-tense suffix appended producing invalid Garo 'Palangha'.
      // Documented as a repeat of the same class as 'down' above. A
      // general noun-guard needs real POS data first - see
      // docs/PENDING_REGRESSION_CASES.md RC-CANDIDATE-003 for the open
      // follow-up (add POS tagging, not scoped here).
      if (w === 'bed') continue;
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
          // RULE-030 (fully validated, 2026-07-25 final confirmation):
          // negative-future "go" uses the bare "re·a" root -> "re·jawa"
          // ("Re·jawa"="I will not go"), NOT the "Re·ang"-family root
          // findVerbForm('go') returns for other tenses ("Re·anga"=go,
          // "re·angenga"=going). Native-confirmed: mood/tense/negation
          // are the complete conditioning factor for which "go" root
          // applies, not destination-presence. Without this exception,
          // any negative-future "go" sentence not already covered by a
          // corrections.json literal (e.g. "he will not go") fell through
          // to the generic root and produced "Re·angjawa" - confirmed
          // wrong, found while generalizing corrections.json's narrow
          // "i will not go"/"will not go" patch per Claude A's flag.
          const negFutureRoot = (w === 'go') ? 're·a' : garoVerb;
          garoWithTense = applyTense(negFutureRoot, 'negative_future');
          verb = { english: words[i], garo: garoVerb, tense: 'negative_future', garoWithTense, isNegative, index: i };
          break;
        }
        if (!isIrregular && ['future', ...SPECIAL_TENSES].includes(detectedTense)) {
          garoWithTense = applyTense(garoVerb, detectedTense);
        } else if (!isNegative && !isIrregular && (detectedTense === 'past' || /ed$/.test(w))
                   && !/(enga|aha|gen|bo|chim|jaha|jawa|nabe|manaha)$/.test(garoVerb)) {
          // Rule 2 (confirmed): -aha = simple past AND perfect. Applied here
          // for affirmative statements regardless of whether tense evidence
          // came from a sentence-level auxiliary (was/did/...) or from the
          // verb's own -ed morphology ('studied' has neither an auxiliary
          // nor an IRREGULAR_VERBS entry, so without this it silently
          // resolved to no verb at all — found 2026-07-05 grammar audit).
          // Rule 27: negation is handled separately below and never
          // composes with this — 'did not X' uses present+ja regardless.
          garoWithTense = applyTense(garoVerb, 'past');
        }
        if (isNegative) {
          garoWithTense = applyNegation(garoWithTense);
        }
        verb = { english: words[i], garo: garoVerb, tense: detectedTense, garoWithTense, isNegative, index: i };
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
    // RC-CANDIDATE-002 fix (Claude A approved, 2026-07-10): "in"/"on"/"at"
    // are stopwords, so they were silently skipped and the following noun
    // got the default object marker ·ko — losing the locative distinction
    // entirely ("in bed" -> "palang·ko" instead of "palango"). Tracks a
    // PENDING flag set when a locative stopword is seen and consumed on
    // the next real word pushed — not gated on objectWords being empty,
    // since an earlier unresolved word (e.g. "lying" in "lying in bed")
    // can already occupy an earlier slot; what matters is which word
    // immediately follows the preposition, not overall span position.
    // Only fires in this SOV grammar-assembly fallback path — never
    // overrides a working corrections.json exact match, since those never
    // reach this code.
    let objectIsLocativeAdjunct = false;
    let pendingLocative = false;

    for (let i = subjectEndIndex + 1; i < words.length; i++) {
      const w = words[i].toLowerCase().replace(/[^a-z]/g,'');
      const prevW = i > 0 ? words[i-1].toLowerCase().replace(/[^a-z]/g,'') : '';
      if (w === 'to' && i + 1 < words.length && prevW !== 'used') {
        const nextW = words[i+1].toLowerCase().replace(/[^a-z]/g,'');
        if (PURPOSE_MAP[nextW]) {
          purposeAction = { english: words[i+1], garo: PURPOSE_MAP[nextW] };
          i++; continue;
        }
      }
      if (POSSESSIVES[w] || STOP_WORDS.has(w) || AUXILIARY_SKIP.has(w) || subjectWords.has(w)) {
        if (/^(in|on|at)$/.test(w)) pendingLocative = true;
        continue;
      }
      // Negation-word guard (2026-07-29, found via live quality check,
      // Claude B): "not"/"never" are neither STOP_WORDS nor
      // AUXILIARY_SKIP, so they were falling through and being captured
      // as the OBJECT in negative intransitive sentences ("i did not
      // eat" -> object.english="not" -> lookupGaro fails -> '[UNKNOWN]').
      // Same category of fix as the NUMBER_WORDS guard on the verb loop
      // above ("a number word is never the main verb") - a bare negation
      // particle is never the object, in any reading of English grammar,
      // not a contested linguistic call. isNegative (detected earlier via
      // the same /n't|\b(not|never)\b/i pattern) already carries this
      // sentence's negation status independently, so dropping these two
      // words here loses no information.
      if (/^(not|never)$/.test(w)) continue;
      if (verb && words[i] === verb.english) continue;
      if (IRREGULAR_VERBS[w] || IRREGULAR_VERBS[w.replace(/ing$|ed$|es$|s$/, '')]) continue;
      if (pendingLocative) { objectIsLocativeAdjunct = true; pendingLocative = false; }
      objectWords.push(words[i]);
    }

    if (objectWords.length > 0) {
      const objEng = objectWords.join(' ');
      const lastWord = objectWords[objectWords.length-1];
      const objGaro = lookupPhrase(objEng) || lookupGaro(objEng) || lookupPhrase(lastWord) || lookupGaro(lastWord) || '[UNKNOWN]';
      const marker = objectIsLocativeAdjunct ? '·o' : '·ko';
      object = { english: objEng, garo: objGaro, withMarker: objGaro + marker, isLocativeAdjunct: objectIsLocativeAdjunct };
    }

    return {
      wordCount, detectedTense, tenseEvidence, isNegative, isQuestion,
      garoTenseSuffix: null, // removed 2026-07-05, see comment above
      structure: subject ? 'SVO → SOV (Garo)' : 'unknown',
      subject, verb, object, possessive, purposeAction, classifierHints,
      garoWordOrder: 'SOV (Subject → Object → Verb)',
      notes: wordCount === 1 ? 'Single word — direct lookup' : wordCount <= 3 ? 'Short phrase' : 'Complex sentence — SOV assembly',
    };
  }



  return {
    wordCount, detectedTense, tenseEvidence, isNegative, isQuestion,
    garoTenseSuffix: null, // removed 2026-07-05, see comment above
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
export function tryWithoutGijaConstruction(input) {
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
