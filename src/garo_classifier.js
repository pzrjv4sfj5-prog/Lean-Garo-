/**
 * garo_classifier.js
 * Claude A — Complete Rebuild 2026-06-07
 * Word order corrected 2026-06-21 per native speaker — see below.
 *
 * CORRECT GARO CLASSIFIER ORDER: [noun] + [classifier-number]
 * Example: achak mang·sa = one dog (NOT mang·sa achak)
 */

import { toGaroNumber as toGaroNumberImported } from './number_engine.js';

export const NUMBERS = {
  1:'sa', 2:'gni', 3:'gittam', 4:'bri', 5:'bonga',
  6:'dok', 7:'sni', 8:'chet', 9:'sku', 10:'chiking',
};

export const NUMBER_WORDS = {
  'one':1,'two':2,'three':3,'four':4,'five':5,
  'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
  'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,
  'sixteen':16,'seventeen':17,'eighteen':18,'nineteen':19,
  'twenty':20,'thirty':30,'forty':40,'fifty':50,
  'sixty':60,'seventy':70,'eighty':80,'ninety':90,'hundred':100,'thousand':1000,
};

export function parseCount(input) {
  if (!input) return null;
  const str = String(input).toLowerCase().trim();
  if (NUMBER_WORDS[str]) return NUMBER_WORDS[str];
  const n = parseInt(str);
  return (!isNaN(n) && n > 0) ? n : null;
}

export const CLASSIFIER_MAP = {
  'dog':'mang','achak':'mang','cat':'mang','menggo':'mang',
  'cow':'mang','matchu':'mang','goat':'mang','dobok':'mang',
  'pig':'mang','wak':'mang','bird':'mang','do·o':'mang',
  'fish':'mang','na·tok':'mang','hen':'mang','duck':'mang',
  'horse':'mang','buffalo':'mang','elephant':'mang','tiger':'mang',
  'monkey':'mang','rat':'mang','snake':'mang','butterfly':'mang',
  'bee':'mang','ant':'mang','mosquito':'mang','frog':'mang',
  'crab':'mang','rabbit':'mang','sheep':'mang','lamb':'mang',
  'deer':'mang','bear':'mang','eagle':'mang','parrot':'mang',
  'crow':'mang','sparrow':'mang','owl':'mang','pigeon':'mang',
  'eel':'mang','insect':'mang','animal':'mang',
  'person':'sak','mande':'sak','man':'sak','woman':'sak',
  'boy':'sak','girl':'sak','child':'sak','people':'sak',
  'teacher':'sak','skigipa':'sak','doctor':'sak','student':'sak',
  'pastor':'sak','farmer':'sak','friend':'sak','worker':'sak',
  'father':'sak','mother':'sak','brother':'sak','sister':'sak',
  'book':'king','ki·tap':'king','paper':'king','leaf':'king',
  'letter':'king','card':'king','cloth':'king','mat':'king',
  'board':'king','page':'king','notebook':'king',
  'money':'gong','tangka':'gong','rupee':'gong','coin':'gong',
  'stick':'ge','pole':'jol','rod':'jol','staff':'jol',
  // jol CONFIRMED 2026-09-19 (published Garo dictionary photo): "Jol..,
  // A numeral prefix the whole length of bamboo as Wa·a jolsa ra·babo
  // -- Brings whole length of bamboo." This is a genuine per-noun
  // classifier (not a generic tool/object fallback) specifically for
  // whole lengths of bamboo, confirmed no-raka-dot at n=1 ("jolsa", not
  // "jol·sa") -- matches the RAKA_CLASSIFIERS default it was already
  // shipping (jol was never added there), now a confirmed fact rather
  // than an unverified default. The bamboo/wa·a mapping below already
  // existed in this file uncited before this citation; the dictionary
  // corroborates it rather than introducing it. Only n=1 is directly
  // confirmed -- the 20-99 compound shape for jol is still unconfirmed
  // (classifierTail() still returns null for jol at n>19, same as se).
  'bamboo':'jol','wa·a':'jol',
  'tree':'pang','log':'dot','wooden post':'dot',
  'pen':'ge','kolom':'ge','pencil':'ge',
  'fruit':'rong','fruits':'rong','mewa':'rong','bite':'rong','bi·te':'rong',
  'apple':'rong','mango':'rong',
  'mountain':'dot','village':'dam',
  'banana':'ge','banana bunch':'akka',
  'alcohol':'rong','chu':'rong','beer':'rong',
  'water':'rong','chi':'rong', // contract Drink/Water row, confirmed_examples
  // "Chi rong sa" -- uses rong's already-established no-raka rule.
  'egg':'rong', // contract Egg row (classifier_or_unit: rong). No
  // confirmed_examples given, but rong's no-raka fusion is independently
  // established (rongsa/rongbonga/Chi rong sa above) so this follows the
  // same convention, not a new/separate guess.
  'tool':'se','tools':'se', // contract Tools row. NOTE: 'tool'/'tools'
  // is a genuine dictionary gap -- not in master_dictionary.json at all,
  // so this mapping has no noun to attach to yet; added defensively for
  // whenever the noun exists. RAKA BEHAVIOR UNVERIFIED for 'se' -- no
  // confirmed_examples anywhere in this repo. Defaulted to no-raka
  // (see RAKA_CLASSIFIERS below -- 'se' deliberately not added there)
  // as the majority-pattern guess, flagged for native review, not
  // presented as confirmed.
  'merong':'rong', // rice (uncooked/grain); cooked rice ('mi') is a mass
  // noun counted via container word ('plate'), not this classifier — see
  // master_dictionary.json 'one plate of rice' note. Do not map generic
  // 'rice' here, it's ambiguous between the two.
  'house':'te','nok':'te', // NEW classifier, native-confirmed 2026-08-14
  // (NV-073, Thangseng): 'nok te·sa' = 'one house'. Raka-carrying.
  'car':'bol','gari':'bol', // NEW classifier, 2026-09-10, per contract
  // Transport/Car row + Owner chat confirmation ('Gari bol sa'). No-raka
  // (see RAKA_CLASSIFIERS below -- 'bol' deliberately not added there).
  'road':'dil', // NEW classifier, 2026-09-10, Owner directive overriding
  // the contract file's classifier_table entry (which had noun "Rama dil"
  // + classifier "roa" -> "Rama dil roa sa"). Owner directive: noun is
  // "Rama" alone, classifier is "dil", giving "Rama dilsa". 'roa' is a
  // *different* classifier reserved for length/distance measurement, not
  // this noun-counting classifier. No-raka (matches "Rama dilsa" fused,
  // no dot). NOTE: the noun the runtime actually ships for "road" is
  // "ra·ma" (compiled_dict.json), not "Rama" -- casing/raka-mark aside,
  // this matches the confirmed "Rama" up to the project's existing
  // lowercase-surface convention (see "chattro", "song", "gari" etc. above,
  // all lowercased at surface realization). Not a new conflict.
};

export const CLASSIFIERS = CLASSIFIER_MAP;

export function getClassifier(noun) {
  if (!noun) return 'ge';
  return CLASSIFIER_MAP[noun.toLowerCase().trim()] || 'ge';
}

function getClassifierSuffix(count) {
  const n = parseInt(count);
  if (NUMBERS[n]) return NUMBERS[n];
  const TEENS = {
    11:'Chi·sa', 12:'Chi·gni', 13:'Chi·gittam', 14:'Chi·bri',
    15:'Chi·bonga', 16:'Chi·dok', 17:'Chi·sni', 18:'Chi·chet', 19:'Chi·sku',
  };
  if (TEENS[n]) return TEENS[n];
  if (n > 19) {
    const result = toGaroNumberImported(n);
    return result ? result.replace(/ /g, '·') : null;
  }
  return null;
}

// Owner-confirmed 2026-09-13 (live chat, direct Thangseng citation via
// Claude B): "Ango na·tok manggittam donga" = "I have three fish" --
// mang (animals classifier) has NO raka dot, confirmed explicitly
// ("Real — mang genuinely has no raka dot, full stop") when asked
// whether this was a real point vs. a typing/relay artifact (the raka
// dot '·' is an easy character to drop when typing casually, so this
// was checked rather than assumed). This REVERSES the RAKA_CLASSIFIERS
// membership this project has run with for a long time — see the huge
// body of prior 'mang·'-dotted citations throughout
// docs/THANGSENG_NATIVE_VALIDATION.md and elsewhere.
//
// IMPORTANT — scope of this fix: this only changes the runtime
// classifier-COMPOSITION fallback (used when no literal dictionary
// entry exists for a given noun+count). It does NOT retroactively
// correct the ~151 existing master_dictionary.json rows (110 tagged
// verified_high) that literally store the old dotted 'mang·' form as
// a hardcoded string, nor the ~28 test assertions across 6 files that
// still expect it (both flagged in chat, not touched in this commit --
// that's a large data-correction pass, outside a mechanical engine
// fix, needs its own dedicated audit).
// king removed 2026-09-19 (direct Owner directive: "king doesn't use
// rakka") -- resolves the conflict flagged 2026-09-18 between this
// set's prior 'king' membership (sourced to commit 3ba97c3, itself
// only citing "per Claude A 8a12eca resolution" -- a commit whose own
// diff never actually mentions king) and the docx table's consistent
// undotted "Kingsa" across 15 rows. The docx reading wins outright now
// by direct instruction, not inference.
const RAKA_CLASSIFIERS = new Set(['ge', 'gong', 'te']);

// Owner-confirmed 2026-09-13 (in-chat, live conversation): "beer rong sa"
// is correct with a literal space before the number -- NOT the fused
// "rongsa" this codebase otherwise ships for the 'rong' classifier
// (e.g. "mewa rongbri"/"chu rongsa" per RULE-038, fused, high-confidence
// for solid/fruit nouns). Clarified in the same conversation: "beer" and
// "alcohol" both resolve to the single Garo noun 'chu' ("chu is alcohol,
// it can be beer gin or anything") -- so this is chu itself taking a
// space, not a separate loanword. Owner explicitly said "maybe water" for
// whether 'chi' (water) should also be spaced -- that's a "maybe", not a
// confirmation, so 'chi'/'water' is deliberately left OUT of this set
// pending a firmer answer; it keeps the existing fused behavior for now.
// This does not change RULE-038's existing "chu rongsa"=one alcohol
// example wording -- that example is now understood to be the stale
// fused assumption this correction supersedes for chu specifically; the
// written rule doc itself was not edited in this pass (flagged, not
// silently rewritten -- see conversation log).
const SPACED_NOUNS = new Set(['chu', 'alcohol', 'beer']);

function bareNumberWord(n) {
  n = parseInt(n);
  if (NUMBERS[n]) return NUMBERS[n];
  const TEENS = {
    11:'Chi·sa', 12:'Chi·gni', 13:'Chi·gittam', 14:'Chi·bri',
    15:'Chi·bonga', 16:'Chi·dok', 17:'Chi·sni', 18:'Chi·chet', 19:'Chi·sku',
  };
  if (TEENS[n]) return TEENS[n];
  if (n >= 20 && n <= 99) {
    const result = toGaroNumberImported(n);
    return result ? result.replace(/ /g, '·') : null;
  }
  if (n >= 100) return composeLargeBareNumber(n);
  return null;
}

function composeLargeBareNumber(n) {
  const thousands = Math.floor(n / 1000);
  const remThousand = n % 1000;
  const hundreds = Math.floor(remThousand / 100);
  const remHundred = remThousand % 100;
  const parts = [];
  if (thousands > 0) parts.push(thousands === 1 ? 'hajal' : `hajal ${bareNumberWord(thousands)}`);
  if (hundreds > 0) parts.push(hundreds === 1 ? 'ritcha' : `ritcha ${bareNumberWord(hundreds)}`);
  if (remHundred > 0) parts.push(bareNumberWord(remHundred));
  return parts.join(' ');
}

// Shared classifier+number-word fusion for n in 1-99, including the sak
// (human) 20-99 surface-form exception (Owner directive 2026-09-10,
// "Chattro saksotbri sa"): tens word fuses straight onto the classifier,
// lowercased, keeping the original space before the trailing units word
// -- NOT the general n>19 rule (native-confirmed 2026-06-28 for
// mang/animals: tens+units join to the classifier with a raka dot, e.g.
// "mang·Kolgrik·sa"). Used by both buildClassifierPhrase (n<100) and
// buildLargeClassifierPhrase's remHundred branch (n>=100 with a 1-99
// remainder, e.g. "999 students" = ritcha sku + this tail for n=99) --
// previously only the former called the sak branch, so "999/141 students"
// still shipped the old dot-joined form even after the <100 fix.
// 20-99 compound surface forms, confirmed per-classifier (2026-09-16,
// live Thangseng citations relayed by Project Owner in chat). This is
// NOT a general rule that mechanically generalizes from one classifier
// to the rest -- the shape differs by classifier: sak and rong fuse the
// compound with no raka dot; mang fuses WITH a raka dot before the
// compound, which is a DIFFERENT fact from mang's own n<20 no-dot rule
// above (that rule covers a bare digit fused to the classifier; this is
// a compound tens+units word fused to the classifier -- a different
// construction, not a contradiction of the earlier citation). Only
// these classifiers were confirmed for n>19 as of 2026-09-16; see
// 2026-09-18 addendum below for bol/king/ge/te (added) and gong
// (reverted pending conflict resolution). jol's own n<20 classifier
// identity and dot status were confirmed 2026-09-19 (see CLASSIFIER_MAP
// comment above); its 20-99 compound shape is still unconfirmed. se
// remains fully unconfirmed (its n<20 form still ships as the flagged
// default-pattern guess, not a citation -- see CLASSIFIER_MAP/UNIT_WORDS
// comments; its n>19 compound is blocked below rather than guessed) so
// translate() falls through to a weaker (but not actively wrong)
// assembly path instead of shipping a fabricated/garbled compound form
// -- this was Bug 2, and it is only partially closed by this fix.
// Confirmed citations, live:
//   41 students -> "Chattro saksotbrisa"      (sak: no gap, no dot)
//   41 dogs     -> "Achak mang·sotbrisa"      (mang: no gap, WITH dot)
//   25 mangoes  -> "te·gatchu rongkolgrikbonga" (rong: no gap, no dot)
//   41 coins    -> "gong·sotbrisa" (2026-09-17, direct Thangseng citation
//                  relayed by Project Owner via chat screenshot): fused,
//                  WITH dot -- same shape as mang, not sak/rong. This is
//                  consistent with (though not derivable from) gong's
//                  already-confirmed single-digit rule (dotted: "gong·bonga"
//                  for 5, "gong·sa" even after a large-number prefix in
//                  "hajal chikking gong·sa" for 10,001) -- but the compound
//                  20-99 case still had to be confirmed separately, per the
//                  mang precedent where single-digit and compound behavior
//                  are NOT guaranteed to match.
//
// gong: dot:true. CORRECTED 2026-09-18 (Claude D findings, evidence-only,
// docs/CLAUDE_D_20260918_compound_classifier_findings.json), reversing the
// 2026-09-19 Owner judgment call below. This is the fact's third flip
// (dot -> no dot -> dot) so the full chain is kept on record: the prior
// no-dot call was explicitly flagged by its own commit as a pattern-based
// guess between two conflicting sources, reversible by a future direct
// citation -- that citation arrived: Owner, this chat, "Gong uses
// rakka(.) it's clearly mentioned in the counting pdf." The apparent
// docx contradiction was mechanically audited (source table's own gong
// column: 19/19 dotted for n=1-19, 0/22 dotted for n=20-41, zero
// exceptions either way) and read as a transcription gap in that one
// table (consistent with two other already-flagged bad gong cells in
// it), not a real split in the language -- so gong carries the dot at
// every number, 1 to infinity, no exception.
//
// mang: dot:false. CORRECTED 2026-09-18 (same Claude D findings doc),
// reversing 5a900ac. This is mang's THIRD reversal on this exact
// question (dot:true bug -> de-dotted by Owner directive 2026-09-13 ->
// reopened to dot:true by 5a900ac 2026-09-17). Reverted again on a fresh
// direct Thangseng citation, dated the day after 5a900ac, relayed via
// WhatsApp/Tridip: "[18/9/2026] Tridip: Mang and rong uses rakka or
// not? Thangseng: No." rong's dot:false (also from 5a900ac) is
// unaffected -- this citation corroborates rong, only reverses mang.
// Given three flips on one fact, do not touch this again without a
// citation at least this direct -- see standing rule §4 in the
// migration docs against "applying logic" to fill the gap instead.
//
// bol/king/ge/te 20-41 compounds: CONFIRMED (2026-09-18, Counting_docx_
// thanseng.docx). Verified mechanically against number_engine.
// toGaroNumber() for n=20,21,24,30,31,40,41 -- table's "bolkolgrik"/
// "kingkolgriksa"/"gesotbri"/"tesotbrisa" etc. equal classifier +
// toGaroNumber(n) with spaces stripped and lowercased, same shape as
// sak, no dot. jol and se are NOT in this table -- still fully
// unconfirmed for the 20-99 compound specifically, classifierTail()
// still returns null (unresolved, not guessed) for those two. (jol's
// own n<20 identity/dot status has since been separately confirmed --
// see the CLASSIFIER_MAP comment above -- but that does not extend to
// its compound shape.)
const CONFIRMED_COMPOUND_CLASSIFIERS = {
  sak: { dot: false },
  mang: { dot: false },
  rong: { dot: false },
  bol: { dot: false },
  king: { dot: false },
  ge: { dot: false },
  te: { dot: false },
  gong: { dot: true },
};

// *** UNVERIFIED GUESS -- Project Owner explicit override, 2026-09-19 ***
// No citation exists for jol's 20-99 compound shape. jol was NOT in the
// Counting_docx_thanseng.docx table that confirmed bol/king/ge/te/gong
// (only jol's n=1 form is cited, from a separate dictionary-entry photo
// -- see the CLASSIFIER_MAP comment above). This entry ships a
// pattern-based guess (fused, no dot -- matching sak/rong/bol/king/ge/te's
// majority shape) ONLY because the Project Owner explicitly instructed
// it after being shown the standing rule against exactly this move
// ("apply the logic" from other confirmed classifiers) -- see the
// migration docs' repeated §4.1: mang and gong BOTH broke this same
// majority-pattern guess once each, so this is a known-risky move being
// taken deliberately, not a citation being treated as one.
//
// Kept in a SEPARATE map from CONFIRMED_COMPOUND_CLASSIFIERS so it can
// never be mistaken for a citation, and so it's trivial to rip out the
// moment real evidence arrives (positive or negative) -- just delete
// the jol line here and move it into CONFIRMED_COMPOUND_CLASSIFIERS
// once cited, or delete it entirely if a citation contradicts the
// guess. classifierTail() below returns a { guess: true } marker
// alongside the string for anything resolved from this map, which
// translationEngine.js uses to cap the runtime confidence well below
// the confirmed-classifier path (see its own comment at the call site)
// and to tag the result's method distinctly, so a guessed jol count is
// never indistinguishable from a cited one in test output, logs, or the
// API surface.
const UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE = {
  jol: { dot: false },
};

function classifierTail(classifier, n, spaced = false) {
  if (n > 19 && CONFIRMED_COMPOUND_CLASSIFIERS[classifier]) {
    const raw = toGaroNumberImported(n); // e.g. "Sotbri Sa" (n=41)
    if (!raw) return null;
    const fused = raw.replace(/\s+/g, '').toLowerCase();
    // spaced-mode fix (2026-09-19, direct Thangseng citation: "21
    // litres" = "litre rong kolgriksa" -- a space before the compound
    // tail). Previously this branch ignored the spaced flag entirely
    // (it had never been exercised for n>=20 before -- the only prior
    // spaced citation, chu/alcohol, was only confirmed for n<20). Now
    // mirrors the n<20 branch below: spaced mode inserts a literal
    // space before the (internally still-fused) compound tail and
    // skips the classifier's own dot rule entirely, same override
    // already established for n<20.
    if (spaced) return `${classifier} ${fused}`;
    return CONFIRMED_COMPOUND_CLASSIFIERS[classifier].dot
      ? `${classifier}·${fused}`
      : `${classifier}${fused}`;
  }
  if (n > 19 && UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE[classifier]) {
    // Owner-approved guess -- see the map's comment above. Deliberately
    // duplicates (rather than shares code with) the CONFIRMED branch: a
    // future edit to the confirmed path must not silently also change
    // the guessed one, and vice versa.
    const raw = toGaroNumberImported(n);
    if (!raw) return null;
    const fused = raw.replace(/\s+/g, '').toLowerCase();
    if (spaced) return `${classifier} ${fused}`;
    return UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE[classifier].dot
      ? `${classifier}·${fused}`
      : `${classifier}${fused}`;
  }
  if (n > 19) return null; // unconfirmed classifier for 20-99 -- don't guess
  const suffix = getClassifierSuffix(n);
  if (suffix === null) return null;
  if (spaced) return `${classifier} ${suffix}`;
  return RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·${suffix}` : `${classifier}${suffix}`;
}

// Exported so translationEngine.js can tell a cited compound-classifier
// result apart from an Owner-approved guess and cap confidence/tag the
// method accordingly, without classifierTail()'s return value itself
// having to stop being a plain string everywhere else it's used.
export function isUnverifiedCompoundGuess(classifier, count) {
  const n = parseInt(count);
  return n > 19
    && !CONFIRMED_COMPOUND_CLASSIFIERS[classifier]
    && !!UNVERIFIED_COMPOUND_CLASSIFIERS_PENDING_EVIDENCE[classifier];
}

function buildLargeClassifierPhrase(classifier, n, spaced = false) {
  const thousands = Math.floor(n / 1000);
  const remThousand = n % 1000;
  const hundreds = Math.floor(remThousand / 100);
  const remHundred = remThousand % 100;
  const prefixParts = [];
  if (thousands > 0) prefixParts.push(thousands === 1 ? 'hajal' : `hajal ${bareNumberWord(thousands)}`);
  if (hundreds > 0) prefixParts.push(hundreds === 1 ? 'ritcha' : `ritcha ${bareNumberWord(hundreds)}`);
  let tail;
  if (remHundred > 0) {
    tail = classifierTail(classifier, remHundred, spaced);
    if (tail === null) return null;
  } else if (prefixParts.length > 0) {
    // Bug 3 fix (2026-09-18, direct Thangseng citation: "100 dogs" =
    // "achak mangritcha"). The old code here guessed that an exact
    // multiple of 100/1000 needs a spurious classifier+"sa" filler
    // tacked on with a space (as if it were secretly "n+1") -- that was
    // never confirmed and caused a real collision: n=100 and n=101 both
    // rendered as "ritcha classifiersa". The citation shows the correct
    // mechanism instead: for an exact multiple, the classifier fuses
    // DIRECTLY onto the last quantifier word itself (mang + ritcha =
    // "mangritcha"), no extra unit filler, and confirmed NO raka dot
    // for this construction regardless of the classifier's own dot
    // status elsewhere (mang is normally dot-carrying at n<20 --
    // "mang·sa" -- but not here). This exactly mirrors the already-
    // confirmed round-tens rule (classifierTail's units===0 branch:
    // classifier fuses onto the bare tens word, e.g. "bolkolgrik" for
    // 20, no filler) -- same mechanism, just one order of magnitude up.
    // Only n=100 itself is a direct citation; extending the same
    // fuse-no-filler mechanism to exact multiples of 100 (200, 300...)
    // and exact multiples of 1000 (1000, 2000...) is a mechanical
    // generalization of that confirmed mechanism, not an independently
    // confirmed fact for each -- flagged here in case a future citation
    // ever shows those diverge.
    const last = prefixParts.pop();
    const fusedLast = last.replace(/\s+/g, '').toLowerCase();
    tail = spaced ? `${classifier} ${last}` : `${classifier}${fusedLast}`;
  } else {
    return null;
  }
  return [...prefixParts, tail].filter(Boolean).join(' ');
}

export function buildClassifierPhrase(classifier, count, spaced = false) {
  const n = parseInt(count);
  if (isNaN(n) || n <= 0) return null;
  if (n >= 100) {
    return buildLargeClassifierPhrase(classifier, n, spaced);
  }
  return classifierTail(classifier, n, spaced);
}



export function toGaroNumber(n) {
  const num = parseInt(n);
  if (isNaN(num)) return null;
  return getClassifierSuffix(num);
}

const IRREGULAR_PLURALS = {
  'people': 'person', 'children': 'child', 'men': 'man',
  'women': 'woman', 'mice': 'mouse', 'feet': 'foot',
  'teeth': 'tooth', 'geese': 'goose', 'oxen': 'ox',
  'sheep': 'sheep', 'fish': 'fish', 'deer': 'deer',
  // Houses bug fix (2026-09-18, Claude B): the regular /(?:[sxz]|ch|sh)es$/
  // rule below exists for words like "bus"/"box"/"church" whose singular
  // itself ends in a sibilant, so the plural adds a full "-es" syllable.
  // It cannot tell those apart from words that already end in a silent
  // "e" after s/z and just add a bare "-s" (house->houses, horse->horses)
  // -- both surface forms end in "...ses", so suffix-only regex is
  // genuinely ambiguous here, not fixable by a smarter pattern. Listed
  // explicitly instead, same as this table's other true exceptions.
  // Confirmed live: translate("2 houses") was falling all the way to the
  // weak morphology fallback ("[UNKNOWN] Nok", 0.65) instead of classifier
  // composition ("nok te·gni", 0.96) because singularize("houses") ->
  // "hous", an unrecognized dictionary key. Scoped to the -se nouns that
  // are actual headwords in master_dictionary.json (mechanical English
  // orthography fix, not a Garo-form decision).
  'houses': 'house', 'horses': 'horse', 'noses': 'nose',
  'nurses': 'nurse', 'promises': 'promise', 'sunrises': 'sunrise',
  'surprises': 'surprise',
};

// Measurement/serving unit words (2026-09-10, Claude B, per Owner
// contract's Measurement/Food categories: kg=weight, litre=liquid volume,
// plate=serving). Recognized only as the FIRST word of the noun phrase
// (optionally followed by "of"), stripped before normal noun resolution.
// RAKA BEHAVIOR for 'kg' CONFIRMED no-raka 2026-09-16 (Project Owner
// directive, chat, "merong kg gni" = 2kg (uncooked) rice) -- matches the
// no-raka default already shipping.
//
// SPACING (2026-09-19, direct Owner/Thangseng clarification): kg and
// plate are self-classifying (the unit word IS its own classifier,
// same as the existing UNIT_WORDS normalization below) -- confirmed
// spaced: "kg gni", "plate sa" (momo plate sa = 1 plate of momos).
// litre is NOT self-classifying: it's confirmed to take the existing
// liquid/fruit classifier 'rong' (litre = liquid volume -- petrol,
// diesel, kerosene), also spaced, same pattern as the chu/alcohol
// exception in SPACED_NOUNS above but as its own citation, not
// inferred from chu. Confirmed citation: "litre rong kolgriksa" = 21
// litres.
//
// Bug found while landing this: countNounWithClassifier previously
// called buildClassifierPhrase with no spaced argument (defaulting to
// false/fused), so the already-shipped kg path produced "kggni" --
// silently contradicting its own cited source above ("kg gni",
// spaced). Fixed alongside litre/plate below; see
// tests/unit/unit_word_classifiers.test.js.
const UNIT_WORDS = {
  'kg': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
  'litre': 'litre', 'litres': 'litre', 'liter': 'litre', 'liters': 'litre',
  'plate': 'plate', 'plates': 'plate',
};

// kg/plate: self-classifying, the unit word itself is the classifier.
// litre: NOT self-classifying, uses the existing 'rong' classifier.
// All three confirmed spaced (see comment above) -- countNounWithClassifier
// below always passes spaced=true for unit-word phrases.
const UNIT_CLASSIFIER = { kg: 'kg', litre: 'rong', plate: 'plate' };

// Bug 5 fix (2026-09-12, Claude B): the naive `word.replace(/s$/, '')`
// singularizer below only strips a bare trailing 's', so any noun with a
// regular English "-es" plural (mangoes, boxes, potatoes, dishes, ...)
// singularized to a form ("mangoe", "boxe", "potatoe", "dishe") that
// doesn't exist in the dictionary. That silently dropped garoNoun in
// translationEngine.js's classifier-counting branch, so the whole phrase
// fell through to the much weaker sov-assembly fallback (wrong word
// order, classifier ignored) instead of classifier composition — live-
// confirmed via translate("seven mangoes") returning "Sni te·ga·chu"
// (number-first, no classifier) instead of "te·ga·chu rong·sni".
// This does NOT touch classifier selection, raka rules, or any Garo
// surface form — purely the English-side plural stripping used to find
// the dictionary key, a mechanical fix to standard English orthography
// (not a linguistic/Garo decision, so within Claude B's remit).
function singularize(word) {
  if (IRREGULAR_PLURALS[word]) return IRREGULAR_PLURALS[word];
  if (word.length > 4 && /ies$/.test(word)) return word.slice(0, -3) + 'y'; // berries -> berry
  if (/(?:[sxz]|ch|sh)es$/.test(word)) return word.slice(0, -2); // boxes/churches/dishes/buses -> box/church/dish/bus
  if (/oes$/.test(word)) return word.slice(0, -2); // mangoes/potatoes/tomatoes -> mango/potato/tomato
  if (/s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1); // dogs -> dog (unchanged default)
  return word;
}

function parseNumberBlock(words, pos) {
  const v = NUMBER_WORDS[words[pos]];
  if (v === undefined || v >= 100) return null; // this block only handles 1-19 and tens-multiples
  if (v >= 20 && v % 10 === 0) {
    const nextV = NUMBER_WORDS[words[pos + 1]];
    if (nextV !== undefined && nextV >= 1 && nextV <= 9) {
      return { value: v + nextV, consumed: 2 }; // e.g. "twenty five" -> 25
    }
    return { value: v, consumed: 1 }; // a following word that isn't 1-9 (e.g. "twenty ten") must not combine
  }
  return { value: v, consumed: 1 };
}

function skipAnd(words, pos) {
  return (words[pos] === 'and' && NUMBER_WORDS[words[pos + 1]] !== undefined) ? pos + 1 : pos;
}

export function parseCountingPhrase(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length < 2) return null;
  // Bug 4 fix (2026-09-12, Claude B): explicit thousands/hundreds/tens
  // grammar so word-form cardinals like "one hundred" or "two thousand"
  // — "hundred"/"thousand" were already in NUMBER_WORDS but never
  // consumed past the first word — are recognized and combined, the
  // same way "twenty five" already was. This only changes which
  // English number *words* map to which integer (ordinary English
  // cardinal grammar, not a Garo decision); it feeds the same existing
  // buildClassifierPhrase/buildLargeClassifierPhrase composition
  // already used by digit input like "100 dogs", so it does not add or
  // change any Garo surface rule. Structured as explicit blocks (not a
  // flat accumulate-loop) specifically to preserve the existing
  // RC-CANDIDATE-031 guarantee that an invalid compound like "twenty
  // ten" must not combine.
  let total = 0;
  let pos = 0;
  const asDigit = /^\d+$/.test(words[0]) ? parseInt(words[0], 10) : null;
  if (asDigit !== null && asDigit > 0) {
    total = asDigit;
    pos = 1;
  } else {
    let block = parseNumberBlock(words, pos);
    if (block && words[pos + block.consumed] === 'thousand') {
      total += block.value * 1000;
      pos = skipAnd(words, pos + block.consumed + 1);
    } else if (words[pos] === 'thousand') {
      total += 1000;
      pos = skipAnd(words, pos + 1);
    }
    block = parseNumberBlock(words, pos);
    if (block && words[pos + block.consumed] === 'hundred') {
      total += block.value * 100;
      pos = skipAnd(words, pos + block.consumed + 1);
    } else if (words[pos] === 'hundred') {
      total += 100;
      pos = skipAnd(words, pos + 1);
    }
    block = parseNumberBlock(words, pos);
    if (block) {
      total += block.value;
      pos += block.consumed;
    }
  }
  let count = total;
  if (!count) return null;
  const consumed = pos;
  let remaining = words.slice(consumed);
  let unit = null;
  if (remaining.length > 0 && UNIT_WORDS[remaining[0]]) {
    unit = UNIT_WORDS[remaining[0]];
    remaining = remaining.slice(1);
    if (remaining[0] === 'of') remaining = remaining.slice(1);
  }
  const englishNoun = remaining.join(' ');
  if (!englishNoun) return null;
  const singular = singularize(englishNoun);
  const nounWords = englishNoun.split(' ');
  const lastWord = nounWords[nounWords.length - 1];
  const nounOnly = nounWords.length > 1 ? singularize(lastWord) : singular;
  return { count, englishNoun: singular, originalNoun: englishNoun, nounOnly, unit };
}

export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);
  const spaced = SPACED_NOUNS.has((englishNoun || garoNoun || '').toLowerCase().trim());
  const classifierPhrase = buildClassifierPhrase(classifier, count, spaced);
  if (classifierPhrase === null) return null;
  return `${garoNoun.toLowerCase()} ${classifierPhrase}`;
}

export function countNounWithClassifier(garoNoun, count, unit) {
  // unit is the normalized UNIT_WORDS value ('kg'/'litre'/'plate') --
  // map to the real classifier (litre uses 'rong', not itself -- see
  // UNIT_CLASSIFIER comment above) and always pass spaced=true, now
  // confirmed for all three unit words (2026-09-19).
  const classifier = UNIT_CLASSIFIER[unit] || unit;
  const classifierPhrase = buildClassifierPhrase(classifier, count, true);
  if (classifierPhrase === null) return null;
  return `${garoNoun} ${classifierPhrase}`;
}

export function buildPhrase(dictionary, englishNoun, count) {
  const entry = dictionary?.[englishNoun.toLowerCase()];
  const garoNoun = Array.isArray(entry) ? entry[0]?.garo : (typeof entry === 'string' ? entry : englishNoun);
  return countNoun(garoNoun || englishNoun, count, englishNoun);
}

export function validatePhrase(phrase) {
  return Boolean(phrase && phrase.length > 0);
}

export default {
  toGaroNumber, getClassifier, buildClassifierPhrase, countNoun,
  countNounWithClassifier, buildPhrase, parseCountingPhrase,
  parseCount, validatePhrase, CLASSIFIER_MAP, NUMBERS, NUMBER_WORDS,
};
