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
function classifierTail(classifier, n, spaced = false) {
  if (classifier === 'sak' && n > 19) {
    const raw = toGaroNumberImported(n); // e.g. "Sotbri sa" (n=41)
    if (!raw) return null;
    return `${classifier}${raw.charAt(0).toLowerCase()}${raw.slice(1)}`;
  }
  const suffix = getClassifierSuffix(n);
  if (suffix === null) return null;
  if (spaced) return `${classifier} ${suffix}`;
  return RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·${suffix}` : `${classifier}${suffix}`;
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
    const last = prefixParts.pop();
    const attach = spaced
      ? `${classifier} sa`
      : (RAKA_CLASSIFIERS.has(classifier) ? `${classifier}·sa` : `${classifier}sa`);
    tail = `${last} ${attach}`;
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
