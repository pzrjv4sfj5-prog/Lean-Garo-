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
 *   four fruits -> mewa ge·bri    (ge = general fallback)
 *   five coins -> tangka gong·bonga (gong = money/currency)
 *   ten birds  -> do·a mang·chiking
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
const RAKA_CLASSIFIERS = new Set(['mang', 'sak', 'ge', 'gong']);
// No-raka classifiers: king, jol, pang, dot (suffixes attach directly)

export function buildClassifierPhrase(classifier, count) {
  const suffix = getClassifierSuffix(count);
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
  return { count, englishNoun: singular, originalNoun: englishNoun };
}

export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);
  // 'ge' (general fallback classifier) was previously treated as "no
  // classifier at all" — dropping it entirely from output. Native speaker
  // confirmed it's a real classifier like the others: "four fruits" ->
  // "mewa ge·bri", not "mewa bri". Fixed to use the same buildClassifierPhrase
  // path as every other classifier category.
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
