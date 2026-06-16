/**
 * garo_classifier.js
 * Claude A — Complete Rebuild 2026-06-07
 *
 * CORRECT GARO CLASSIFIER ORDER:
 * [classifier-number] + [noun]
 * Example: mang-sa achak = one dog (NOT achak mang-sa)
 */

import { toGaroNumber as toGaroNumberImported } from './number_engine.js';

export const NUMBERS = {
  1:'sa', 2:'gni', 3:'gitam', 4:'bri', 5:'bonga',
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
  'stick':'brong','pole':'brong','rod':'brong','bamboo':'brong',
  'pen':'brong','pencil':'brong','tree':'brong',
};

export const CLASSIFIERS = CLASSIFIER_MAP;

export function getClassifier(noun) {
  if (!noun) return 'ge';
  return CLASSIFIER_MAP[noun.toLowerCase().trim()] || 'ge';
}

function getClassifierSuffix(count) {
  const n = parseInt(count);
  if (NUMBERS[n]) return NUMBERS[n];
  if (n > 10 && n < 20) return `chiking-ma-${NUMBERS[n-10]||n-10}`;
  return String(n);
}

export function buildClassifierPhrase(classifier, count) {
  return `${classifier}-${getClassifierSuffix(count)}`;
}

export function toGaroNumber(n) {
  const num = parseInt(n);
  if (isNaN(num)) return null;
  if (NUMBERS[num]) return NUMBERS[num];
  if (num > 10 && num < 20) return `chiking-ma-${NUMBERS[num-10]}`;
  return null;
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
  const count = parseCount(words[0]);
  if (!count) return null;
  const englishNoun = words.slice(1).join(' ');
  const singular = IRREGULAR_PLURALS[englishNoun] || englishNoun.replace(/s$/, '');
  return { count, englishNoun: singular, originalNoun: englishNoun };
}

export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);
  if (classifier === 'ge') {
    const numGaro = toGaroNumber(count);
    return numGaro ? `${garoNoun.toLowerCase()} ${numGaro}` : garoNoun.toLowerCase();
  }
  const classifierPhrase = buildClassifierPhrase(classifier, count);
  return `${classifierPhrase} ${garoNoun.toLowerCase()}`;
}

export function countNounWithClassifier(garoNoun, count, classifier) {
  return `${buildClassifierPhrase(classifier, count)} ${garoNoun}`;
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
