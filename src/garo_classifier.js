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

const RAKA_CLASSIFIERS = new Set(['mang', 'ge', 'gong', 'te', 'king']);

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
function classifierTail(classifier, n) {
  if (classifier === 'sak' && n > 19) {
    const raw = toGaroNumberImported(n); // e.g. "Sotbri sa" (n=41)
    if (!raw) return null;
    return `${classifier}${raw.charAt(0).toLowerCase()}${raw.slice(1)}`;
  }
  const suffix = getClassifierSuffix(n);
  if (suffix === null) return null;
  return RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·${suffix}` : `${classifier}${suffix}`;
}

function buildLargeClassifierPhrase(classifier, n) {
  const thousands = Math.floor(n / 1000);
  const remThousand = n % 1000;
  const hundreds = Math.floor(remThousand / 100);
  const remHundred = remThousand % 100;
  const prefixParts = [];
  if (thousands > 0) prefixParts.push(thousands === 1 ? 'hajal' : `hajal ${bareNumberWord(thousands)}`);
  if (hundreds > 0) prefixParts.push(hundreds === 1 ? 'ritcha' : `ritcha ${bareNumberWord(hundreds)}`);
  let tail;
  if (remHundred > 0) {
    tail = classifierTail(classifier, remHundred);
    if (tail === null) return null;
  } else if (prefixParts.length > 0) {
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
  return classifierTail(classifier, n);
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
};

// Measurement/serving unit words (2026-09-10, Claude B, per Owner
// contract's Measurement/Food categories: kg=weight, litre=liquid volume,
// plate=serving). Recognized only as the FIRST word of the noun phrase
// (optionally followed by "of"), stripped before normal noun resolution.
// RAKA BEHAVIOR UNVERIFIED for all three -- no native-confirmed example
// exists anywhere in this repo (unlike mountain/village/car/banana, which
// all had explicit confirmed_examples). Defaulted to no-raka below
// (RAKA_CLASSIFIERS unchanged, so these fall to the no-raka branch) as
// the majority-pattern guess, NOT a confirmed rule -- flag for native
// review before treating "kgsa"/"litresa"/"platesa" as settled.
const UNIT_WORDS = {
  'kg': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
  'litre': 'litre', 'litres': 'litre', 'liter': 'litre', 'liters': 'litre',
  'plate': 'plate', 'plates': 'plate',
};

export function parseCountingPhrase(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length < 2) return null;
  let count = parseCount(words[0]);
  if (!count) return null;
  let consumed = 1;
  if (count >= 20 && count % 10 === 0 && words.length > 2) {
    const units = parseCount(words[1]);
    if (units !== null && units >= 1 && units <= 9) {
      count += units;
      consumed = 2;
    }
  }
  let remaining = words.slice(consumed);
  let unit = null;
  if (remaining.length > 0 && UNIT_WORDS[remaining[0]]) {
    unit = UNIT_WORDS[remaining[0]];
    remaining = remaining.slice(1);
    if (remaining[0] === 'of') remaining = remaining.slice(1);
  }
  const englishNoun = remaining.join(' ');
  if (!englishNoun) return null;
  const singular = IRREGULAR_PLURALS[englishNoun] || englishNoun.replace(/s$/, '');
  const nounWords = englishNoun.split(' ');
  const lastWord = nounWords[nounWords.length - 1];
  const nounOnly = nounWords.length > 1
    ? (IRREGULAR_PLURALS[lastWord] || lastWord.replace(/s$/, ''))
    : singular;
  return { count, englishNoun: singular, originalNoun: englishNoun, nounOnly, unit };
}

export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);
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
