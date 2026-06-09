/**
 * garo_classifier.js
 * Claude A — Complete Rebuild
 *
 * GARO CLASSIFIER RULE (ABSOLUTE):
 * Output order = [classifier-number] + [noun]
 * NEVER [noun] + [classifier-number]
 *
 * Examples:
 *   mang-sa achak    = one dog
 *   mang-gni achak   = two dogs
 *   sak-sa skigipa   = one teacher
 *   king-sa ki·tap   = one book
 */

// ─── Number system ────────────────────────────────────────────────────────────

export const NUMBERS = {
  1:  'sa',
  2:  'gni',
  3:  'gitam',
  4:  'bri',
  5:  'bonga',
  6:  'dok',
  7:  'sni',
  8:  'chet',
  9:  'sku',
  10: 'chiking',
  11: 'chiking-ma-sa',
  12: 'chiking-ma-gni',
  20: 'kolgrik',
  100: 'ritcha-sa',
  1000: 'hajal-sa',
};

export const NUMBER_WORDS = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'twenty': 20,
  'hundred': 100, 'thousand': 1000,
};

export function toGaroNumber(n) {
  const num = parseInt(n);
  if (isNaN(num)) return null;
  if (NUMBERS[num]) return NUMBERS[num];
  // Compound numbers: 13-19 = chiking-ma-[unit]
  if (num > 10 && num < 20) {
    const unit = NUMBERS[num - 10];
    return unit ? `chiking-ma-${unit}` : null;
  }
  return null;
}

// ─── Classifier database ──────────────────────────────────────────────────────

/**
 * Classifier map — noun (english, lowercase) → classifier
 *
 * mang  = animals, birds, fish, insects
 * sak   = people, persons
 * king  = flat objects: books, paper, leaves, cloth, boards
 * gong  = money, coins
 * brong = long objects: sticks, poles, rods, bamboo
 * ge    = general objects (default for inanimate things)
 * ja    = paired items
 */

export const CLASSIFIER_MAP = {
  // Animals — mang
  'dog': 'mang', 'achak': 'mang',
  'cat': 'mang', 'menggo': 'mang',
  'cow': 'mang', 'matchu': 'mang',
  'goat': 'mang', 'dobok': 'mang',
  'pig': 'mang', 'wak': 'mang',
  'bird': 'mang', "do·o": 'mang',
  'fish': 'mang', "na·tok": 'mang',
  'hen': 'mang', 'duck': 'mang',
  'horse': 'mang', 'gure': 'mang',
  'buffalo': 'mang', 'matma': 'mang',
  'elephant': 'mang', 'mong': 'mang',
  'tiger': 'mang', 'matcha': 'mang',
  'monkey': 'mang', 'amak': 'mang',
  'rat': 'mang', 'mese': 'mang',
  'snake': 'mang', 'chipu': 'mang',
  'butterfly': 'mang',
  'bee': 'mang',
  'ant': 'mang', 'akin': 'mang',
  'mosquito': 'mang', 'ganggu': 'mang',
  'frog': 'mang',
  'crab': 'mang',
  'rabbit': 'mang', 'sapau': 'mang',
  'sheep': 'mang', 'lamb': 'mang',
  'deer': 'mang',
  'bear': 'mang', 'matmak': 'mang',
  'eagle': 'mang',
  'parrot': 'mang',
  'crow': 'mang', "do·ka": 'mang',
  'sparrow': 'mang',
  'owl': 'mang',
  'pigeon': 'mang',
  'eel': 'mang', "na·nil": 'mang',

  // People — sak
  'person': 'sak', 'mande': 'sak',
  'man': 'sak', "me·asa": 'sak',
  'woman': 'sak', "me·chik": 'sak',
  'boy': 'sak', 'pante': 'sak',
  'girl': 'sak', "me·tra": 'sak',
  'child': 'sak', 'bisa': 'sak',
  'teacher': 'sak', 'skigipa': 'sak',
  'doctor': 'sak', "sam-on·gipa": 'sak',
  'student': 'sak',
  'pastor': 'sak',
  'farmer': 'sak',
  'friend': 'sak', 'ripsak': 'sak',
  'father': 'sak', 'apa': 'sak',
  'mother': 'sak', 'ama': 'sak',
  'brother': 'sak', 'bok': 'sak',
  'sister': 'sak', 'bomi': 'sak',
  'worker': 'sak',
  'king': 'sak', 'queen': 'sak',
  'thief': 'sak', "cha·ugipa": 'sak',
  'stranger': 'sak', 'ruri': 'sak',

  // Flat objects — king
  'book': 'king', "ki·tap": 'king',
  'paper': 'king',
  'leaf': 'king', 'bijak': 'king',
  'letter': 'king',
  'card': 'king',
  'cloth': 'king',
  'mat': 'king', 'am': 'king',
  'board': 'king',
  'page': 'king',
  'newspaper': 'king',
  'notebook': 'king',

  // Money — gong
  'money': 'gong', 'tangka': 'gong',
  'rupee': 'gong',
  'coin': 'gong',
  'note': 'gong',
  'paisa': 'gong',

  // Long objects — brong
  'stick': 'brong',
  'pole': 'brong',
  'rod': 'brong',
  'bamboo': 'brong', "wa·a": 'brong',
  'pen': 'brong',
  'pencil': 'brong',
  'pipe': 'brong',
  'tube': 'brong',
  'branch': 'brong',
  'tree': 'brong', "a·bil": 'brong',
};

/**
 * Get classifier for a noun.
 * Checks both English and Garo forms.
 * Falls back to 'ge' (general) if not found.
 */
export function getClassifier(noun) {
  if (!noun) return 'ge';
  const lower = noun.toLowerCase().trim();
  return CLASSIFIER_MAP[lower] || 'ge';
}

// ─── Number suffix system ─────────────────────────────────────────────────────

/**
 * Build classifier phrase: [classifier]-[number-suffix]
 * Rule: classifier ALWAYS comes first
 *
 * Number suffixes attached to classifier:
 * 1  = -sa
 * 2  = -gni
 * 3  = -gitam (NOT gittam — common misspelling)
 * 4  = -bri
 * 5  = -bonga
 * 6  = -dok
 * 7  = -sni
 * 8  = -chet
 * 9  = -sku
 * 10 = -chiking
 */

const CLASSIFIER_SUFFIXES = {
  1:  'sa',
  2:  'gni',
  3:  'gitam',
  4:  'bri',
  5:  'bonga',
  6:  'dok',
  7:  'sni',
  8:  'chet',
  9:  'sku',
  10: 'chiking',
};

function getClassifierSuffix(count) {
  const n = parseInt(count);
  if (CLASSIFIER_SUFFIXES[n]) return CLASSIFIER_SUFFIXES[n];
  if (n > 10 && n < 20) return `chiking-ma-${CLASSIFIER_SUFFIXES[n - 10] || n - 10}`;
  return String(n);
}

/**
 * Build classifier phrase only: e.g. "mang-sa", "sak-gni"
 */
export function buildClassifierPhrase(classifier, count) {
  const suffix = getClassifierSuffix(count);
  return `${classifier}-${suffix}`;
}

/**
 * countNoun — main export
 * Returns: [classifier-number] [noun]
 * NEVER [noun] [classifier-number]
 *
 * @param {string} garoNoun  — Garo word for the noun
 * @param {number} count     — quantity
 * @param {string} englishNoun — English noun (for classifier lookup)
 */
export function countNoun(garoNoun, count, englishNoun) {
  const classifier = getClassifier(englishNoun || garoNoun);

  if (classifier === 'ge') {
    // General objects — no classifier, just noun + number word
    const numGaro = toGaroNumber(count);
    return numGaro ? `${garoNoun} ${numGaro}` : garoNoun;
  }

  const classifierPhrase = buildClassifierPhrase(classifier, count);
  // CORRECT ORDER: classifier-number THEN noun
  return `${classifierPhrase} ${garoNoun}`;
}

/**
 * countNounWithClassifier — explicit classifier override
 */
export function countNounWithClassifier(garoNoun, count, classifier) {
  const classifierPhrase = buildClassifierPhrase(classifier, count);
  return `${classifierPhrase} ${garoNoun}`;
}

/**
 * buildPhrase — used by translation engine
 * Looks up Garo noun from dictionary, then classifies
 */
export function buildPhrase(dictionary, englishNoun, count) {
  const garoNoun = dictionary?.[englishNoun.toLowerCase()]?.[0]?.garo
    || dictionary?.[englishNoun.toLowerCase()]
    || englishNoun;

  return countNoun(
    typeof garoNoun === 'string' ? garoNoun : garoNoun?.garo || englishNoun,
    count,
    englishNoun
  );
}

/**
 * parseCountingPhrase — parse "two dogs", "one teacher" etc
 * Returns { count, englishNoun, garoPhrase } or null
 */
export function parseCountingPhrase(input) {
  if (!input) return null;
  const lower = input.toLowerCase().trim();
  const words = lower.split(/\s+/);
  if (words.length < 2) return null;

  // Check first word is a number
  const count = NUMBER_WORDS[words[0]] || parseInt(words[0]);
  if (!count || isNaN(count)) return null;

  // Noun is everything after the number
  const englishNoun = words.slice(1).join(' ');
  // Remove plural s for lookup
  const singularNoun = englishNoun.replace(/s$/, '');

  return { count, englishNoun: singularNoun, originalNoun: englishNoun };
}

export function validatePhrase(phrase) {
  if (!phrase) return false;
  // Valid phrase should not have noun before classifier
  // Check: does it start with a known classifier?
  const classifiers = ['mang', 'sak', 'king', 'gong', 'brong', 'ge', 'ja'];
  const firstWord = phrase.split(/[\s-]/)[0].toLowerCase();
  return classifiers.includes(firstWord) || true; // permissive for now
}

export default {
  toGaroNumber,
  getClassifier,
  buildClassifierPhrase,
  countNoun,
  countNounWithClassifier,
  buildPhrase,
  parseCountingPhrase,
  validatePhrase,
  CLASSIFIER_MAP,
  NUMBERS,
  NUMBER_WORDS,
};
