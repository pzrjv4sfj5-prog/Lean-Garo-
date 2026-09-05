/**
 * garo_classifier.js
 * Claude A — Complete Rebuild 2026-06-07
 * Word order corrected 2026-06-21 per native speaker — see below.
 *
 * CORRECT GARO CLASSIFIER ORDER: [noun] + [classifier-number]
 * Example: achak mang·sa = one dog (NOT mang·sa achak)
 *
 * This reverses an earlier "confirmed by user" decision documented in
 * the original project handoff (classifier-first: mang-sa achak). That
 * decision is now superseded — native speaker provided 5 unambiguous
 * examples spanning all 5 classifier categories, all noun-first:
 *   one dog    -> achak mang·sa   (mang = animals)
 *   two dogs   -> achak mang·gni
 *   three books -> ki·tap king·gitam  (king = flat objects)
 *   one person -> mande sak·sa    (sak = people)
 *   four fruits -> mewa rongbri   (rong = roundish objects; corrected
 *                                  2026-08-01 — see below, was wrongly
 *                                  "ge" fallback)
 *   five coins -> tangka gong·bonga (gong = money/currency)
 *   ten birds  -> do·a mang·chiking
 *
 * rong classifier added 2026-08-01, direct Thangseng relay: "with fruits,
 * rong is the preferred prefix because they are roundish in shape, e.g.,
 * apple rongsa; te·gatchu rongbonga... and for alcohol is rong and in
 * Garo alcohol is chu (new word)". Two independently-typed examples from
 * Thangseng himself (rongsa, rongbonga) both show no raka mark, so rong
 * is implemented as a no-raka classifier (like king/jol), not a raka
 * classifier (like mang/sak/ge/gong). "ge" is now confirmed genuinely
 * general/tools-only — fruit was never a real ge case, it was an
 * unconfirmed default guess that happened to go unquestioned until now.
 */

import { toGaroNumber as toGaroNumberImported } from './number_engine.js';

export const NUMBERS = {
  1:'sa', 2:'gni', 3:'gittam', 4:'bri', 5:'bonga',
  6:'dok', 7:'sni', 8:'chet', 9:'sku', 10:'chiking',
};

export const NUMBER_WORDS = {
  'one':1,'two':2,'three':3,'four':4,'five':5,
  'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
  'eleven':11,'twelve':12,'twenty':20,'hundred':100,'thousand':1000,
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
  'bamboo':'jol','wa·a':'jol',
  'tree':'pang','log':'dot','wooden post':'dot',
  'pen':'ge','kolom':'ge','pencil':'ge',
  'fruit':'rong','fruits':'rong','mewa':'rong','bite':'rong','bi·te':'rong',
  'apple':'rong','mango':'rong',
  'alcohol':'rong','chu':'rong','beer':'rong',
  'merong':'rong', // rice (uncooked/grain); cooked rice ('mi') is a mass
  // noun counted via container word ('plate'), not this classifier — see
  // master_dictionary.json 'one plate of rice' note. Do not map generic
  // 'rice' here, it's ambiguous between the two.
  'house':'te','nok':'te', // NEW classifier, native-confirmed 2026-08-14
  // (NV-073, Thangseng): 'nok te·sa' = 'one house'. Raka-carrying.
};

export const CLASSIFIERS = CLASSIFIER_MAP;

export function getClassifier(noun) {
  if (!noun) return 'ge';
  return CLASSIFIER_MAP[noun.toLowerCase().trim()] || 'ge';
}

function getClassifierSuffix(count) {
  const n = parseInt(count);
  if (NUMBERS[n]) return NUMBERS[n];
  // 11-19: native speaker confirmed 2026-06-28 the correct form is
  // "Chi·" + base digit (Chi·sa=11, Chi·gni=12, ... Chi·sku=19) — NOT
  // "chiking·ma·" as previously implemented. This was a real error, not
  // a register/formality variant — replaced entirely, not kept alongside.
  const TEENS = {
    11:'Chi·sa', 12:'Chi·gni', 13:'Chi·gittam', 14:'Chi·bri',
    15:'Chi·bonga', 16:'Chi·dok', 17:'Chi·sni', 18:'Chi·chet', 19:'Chi·sku',
  };
  if (TEENS[n]) return TEENS[n];
  // 20+: native speaker confirmed 2026-06-28 this follows the SAME
  // pattern as number_engine.js's toGaroNumber() — tens word + units word
  // (e.g. 21 = "Kolgrik sa", 25 = "Kolgrik bonga"). The hundreds/thousands
  // logic in number_engine.js follows the same composition rule per the
  // native speaker ("the logic will be same in hundreds or thousands"),
  // so delegating to that function for ANY n > 19 rather than only 20-99.
  if (n > 19) {
    const result = toGaroNumberImported(n);
    // Native speaker confirmed 2026-06-28: tens+units join to classifier with raka,
    // not space. "21 dogs" = achak mang·Kolgrik·sa (not mang·Kolgrik sa).
    // number_engine returns "Kolgrik sa" (space-separated) — replace spaces with · here.
    return result ? result.replace(/ /g, '·') : null;
  }
  return null;
}

// Classifiers that carry raka (·) — confirmed by Thangseng raka rule
const RAKA_CLASSIFIERS = new Set(['mang', 'ge', 'gong', 'te']);
// 'te' (house) added 2026-08-14, NV-073, Thangseng direct: 'nok te·sa'
// shows the raka dot, so 'te' joins the raka-carrying set.
// 'sak' removed 2026-09-05, NV-124 engine handoff: Thangseng confirmed
// 2026-09-03 that sak is no-raka ('saksa', not 'sak·sa') — dictionary
// data was fixed at the time, this was the deferred engine-side half.
// No-raka classifiers: king, jol, pang, dot, rong, sak (suffixes attach directly)
// rong confirmed no-raka 2026-08-01 from Thangseng's own typed examples
// ("rongsa", "rongbonga" — no dot in either), see file header note.

// Bare (classifier-free) number word for a place-value multiplier, e.g. the
// "10" in "ten thousand". <=10 uses NUMBERS directly; 11-19 uses TEENS;
// 20-99 delegates to the already-verified (2026-06-28) tens+units composer;
// 100+ recurses through composeLargeBareNumber. Never carries a classifier —
// this is purely for naming the multiplier itself.
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

// Place-value composer for 100+: "hajal" (1000) and "ritcha" (100) are
// stated as bare words, each optionally followed by its own bare multiplier
// word when the multiplier isn't 1 (e.g. "hajal chiking" = ten thousand,
// not "chiking hajalsa" — see buildLargeClassifierPhrase's file note,
// corrected 2026-08-13 per Project Owner direct correction on 10,001).
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

// Hundreds/thousands + classifier composition — corrected 2026-08-13.
// PREVIOUS (WRONG) BEHAVIOR: the classifier was fused via raka to the
// FRONT of the entire multi-word number (e.g. 10,001 rupees ->
// "gong·chiking·hajalsa·sa"), treating the whole place-value phrase as if
// it were a single classifier suffix. Direct Project Owner correction:
// the classifier only ever attaches to the FINAL atomic digit (the
// noun+classifier+category pattern is per-count, not per-number-phrase).
// Every higher place-value word (hajal=1000, ritcha=100, and their
// multipliers) is stated as a bare, space-separated word IN FRONT of the
// classifier-marked remainder.
// CONFIRMED: 10,001 -> "hajal chiking gong·sa" (hajal=1000, chiking=10
// bare multiplier for the thousands place, gong·sa=classifier+final 1).
// Tens 20-99 (e.g. "21 dogs" = achak mang·Kolgrik·sa) are UNCHANGED here —
// that raka-to-classifier-front form for the tens+units block was
// independently native-confirmed 2026-06-28 and is not touched by this fix.
function buildLargeClassifierPhrase(classifier, n) {
  const thousands = Math.floor(n / 1000);
  const remThousand = n % 1000;
  const hundreds = Math.floor(remThousand / 100);
  const remHundred = remThousand % 100; // 0-99: goes through the existing verified tens+units+classifier path

  const prefixParts = [];
  if (thousands > 0) prefixParts.push(thousands === 1 ? 'hajal' : `hajal ${bareNumberWord(thousands)}`);
  if (hundreds > 0) prefixParts.push(hundreds === 1 ? 'ritcha' : `ritcha ${bareNumberWord(hundreds)}`);

  let tail;
  if (remHundred > 0) {
    const suffix = getClassifierSuffix(remHundred);
    if (suffix === null) return null;
    tail = RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·${suffix}` : `${classifier}${suffix}`;
  } else if (prefixParts.length > 0) {
    // Exact multiple of 100/1000 (e.g. exactly 1000, 2000, 100, 500):
    // classifier + 'sa' attaches to the trailing place-value word.
    // Inferred by direct analogy from the confirmed 10,001 case, not yet
    // independently native-confirmed for the exact-multiple case — flag
    // for native review if precision on round-thousand phrasing matters.
    const last = prefixParts.pop();
    const attach = RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·sa` : `${classifier}sa`;
    tail = `${last} ${attach}`;
  } else {
    return null;
  }
  return [...prefixParts, tail].filter(Boolean).join(' ');
}

export function buildClassifierPhrase(classifier, count) {
  const n = parseInt(count);
  if (isNaN(n) || n <= 0) return null;
  if (n >= 100) {
    return buildLargeClassifierPhrase(classifier, n);
  }
  const suffix = getClassifierSuffix(n);
  if (suffix === null) return null;
  // Only add raka if this classifier has one (Rule 1 — raka in root only)
  return RAKA_CLASSIFIERS.has(classifier)
    ? `${classifier}·${suffix}`
    : `${classifier}${suffix}`;
}

export function toGaroNumber(n) {
  const num = parseInt(n);
  if (isNaN(num)) return null;
  // Was a separate, independently-drifting copy of the same 1-19 logic as
  // getClassifierSuffix() (and had the same now-fixed teens error +
  // 20+ dead-end). Delegating to the single corrected implementation
  // instead of maintaining a third copy.
  return getClassifierSuffix(num);
}


const IRREGULAR_PLURALS = {
  'people': 'person', 'children': 'child', 'men': 'man',
  'women': 'woman', 'mice': 'mouse', 'feet': 'foot',
  'teeth': 'tooth', 'geese': 'goose', 'oxen': 'ox',
  'sheep': 'sheep', 'fish': 'fish', 'deer': 'deer',
};

export function parseCountingPhrase(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length < 2) return null;
  let count = parseCount(words[0]);
  if (!count) return null;
  // RC-CANDIDATE-031 fix (2026-07-30, Claude B, engineering quality
  // audit): greedily consume a second leading number-word as a
  // tens+units compound ("twenty" + "one" = 21) before treating it as
  // the start of the noun phrase. Previously only words[0] was ever
  // read as the count, so "twenty one apples" silently produced
  // {count:20, englishNoun:"one apple"} - "one" swallowed into the
  // noun instead of combining to 21 - even though the classifier
  // system itself already renders 21 correctly
  // (getClassifierSuffix/toGaroNumber both confirmed working for a
  // single integer input). Scoped to exactly the reproduced shape:
  // count is a multiple of 10 that's >=20 (i.e. an actual tens word -
  // currently only "twenty" exists in NUMBER_WORDS, but this doesn't
  // hardcode that so it keeps working if 30/40/etc are added later),
  // the next word is a 1-9 units word, and there's still at least one
  // word left over for the noun. Not scope creep: no new number
  // vocabulary added, purely a parsing-order fix for words that were
  // already recognized individually.
  let consumed = 1;
  if (count >= 20 && count % 10 === 0 && words.length > 2) {
    const units = parseCount(words[1]);
    if (units !== null && units >= 1 && units <= 9) {
      count += units;
      consumed = 2;
    }
  }
  const englishNoun = words.slice(consumed).join(' ');
  if (!englishNoun) return null;
  const singular = IRREGULAR_PLURALS[englishNoun] || englishNoun.replace(/s$/, '');
  // Item 2 fix (2026-08-23, Claude B, session migration): this function
  // has no dictionary access (no import here), so it can't itself know
  // whether the multi-word remainder ("long sticks") is a genuine
  // multi-word noun ("sugar cane") or an [ADJ][NOUN] phrase where only
  // the last word is the actual noun. Rather than guess here, expose
  // BOTH candidates and let the caller (translationEngine.js, which
  // already has dictionary lookups) try the full phrase first — as
  // today, so genuine multi-word nouns are unaffected — and fall back
  // to `nounOnly` only if that fails. This is purely a parsing-coverage
  // change: no new vocabulary, no adjective translation, no word-order
  // decision (the adjective's Garo form is simply not looked up at
  // this stage, per the migration doc's explicit scope: "still feed
  // the resolved noun into countNoun() unchanged").
  const nounWords = englishNoun.split(' ');
  const lastWord = nounWords[nounWords.length - 1];
  const nounOnly = nounWords.length > 1
    ? (IRREGULAR_PLURALS[lastWord] || lastWord.replace(/s$/, ''))
    : singular;
  return { count, englishNoun: singular, originalNoun: englishNoun, nounOnly };
}

export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);
  // 'ge' (general fallback classifier) was previously treated as "no
  // classifier at all" — dropping it entirely from output. Native speaker
  // confirmed it's a real classifier like the others, applied the same
  // buildClassifierPhrase path as every other classifier category.
  // NOTE: "four fruits" is no longer a 'ge' example — fruit nouns now
  // correctly resolve to the 'rong' classifier (see CLASSIFIER_MAP),
  // e.g. "mewa rongbri", not "mewa ge·bri". 'ge' remains the fallback
  // for genuinely uncategorized nouns (tools etc.).
  const classifierPhrase = buildClassifierPhrase(classifier, count);
  if (classifierPhrase === null) return null;
  return `${garoNoun.toLowerCase()} ${classifierPhrase}`;
}

export function countNounWithClassifier(garoNoun, count, classifier) {
  const classifierPhrase = buildClassifierPhrase(classifier, count);
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
