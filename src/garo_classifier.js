/**
 * garo_classifier.js
 * ==================
 * Garo Language — Noun Classifier Engine
 *
 * HOW GARO CLASSIFIERS WORK
 * --------------------------
 * In Garo, when you count a noun you must attach a classifier word
 * that matches the category of that noun, followed by the number.
 *
 * Word order:  NOUN  +  CLASSIFIER-NUMBER
 * Example:     achak    mang-sa        (one dog)
 *              achak    mang-gni       (two dogs)
 *              ki·tap   king-sa        (one book)
 *
 * This is the opposite of English ("one dog") — the classifier
 * always comes before the number in Garo.
 *
 * CLASSIFIERS
 * -----------
 *  mang  → animals, birds, fish, insects
 *  sak   → people, persons
 *  gong  → money, coins, currency
 *  king  → books, paper, leaves, flat/thin objects
 *  ge    → objects, tools, things (general fallback)
 *
 * NUMBERS
 * -------
 *  1 = sa       6  = dok
 *  2 = gni      7  = sni
 *  3 = gittam   8  = chet
 *  4 = bri      9  = sku
 *  5 = bonga    10 = chiking
 */

// ─── Data ────────────────────────────────────────────────────────────────────

export const NUMBERS = {
  1: "sa",
  2: "gni",
  3: "gittam",
  4: "bri",
  5: "bonga",
  6: "dok",
  7: "sni",
  8: "chet",
  9: "sku",
  10: "chiking",
};

export const CLASSIFIERS = {
  mang: {
    label: "mang",
    description: "animals, birds, fish, insects",
    categories: ["animals", "birds", "insects_and_aquatic", "animal_actions_and_parts"],
  },
  sak: {
    label: "sak",
    description: "people and persons",
    categories: ["family_members", "occupations", "social_people"],
  },
  gong: {
    label: "gong",
    description: "money and currency",
    categories: ["at_the_market"],
  },
  king: {
    label: "king",
    description: "books, paper, leaves, flat thin objects",
    categories: ["education"],
  },
  ge: {
    label: "ge",
    description: "objects, tools, things (general)",
    categories: [
      "fruits",
      "vegetables_and_roots",
      "household_items",
      "clothing_and_wearables",
      "kitchen_and_cooking",
      "travel_and_transport",
      "materials_and_textures",
    ],
  },
};

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Convert an integer (1-10) to its Garo number word.
 * @param {number} n
 * @returns {string}
 */
export function toGaroNumber(n) {
  const word = NUMBERS[n];
  if (!word) throw new Error(`Number ${n} is out of supported range (1-10).`);
  return word;
}

/**
 * Get the correct classifier for a dictionary category.
 * Falls back to "ge" (general objects) if the category has no specific classifier.
 *
 * @param {string} category  - key from garo_dictionary.json (e.g. "animals", "fruits")
 * @returns {string}          - classifier label (e.g. "mang", "sak", "ge")
 */
export function getClassifier(category) {
  for (const [label, data] of Object.entries(CLASSIFIERS)) {
    if (data.categories.includes(category)) return label;
  }
  return "ge"; // general fallback
}

/**
 * Build a Garo counted noun phrase.
 * Pattern:  NOUN  CLASSIFIER-NUMBER
 *
 * @param {string} garoNoun   - the Garo word for the noun (e.g. "achak")
 * @param {number} count      - quantity (1-10)
 * @param {string} category   - dictionary category key (e.g. "animals")
 * @returns {string}           - e.g. "achak mang-sa"
 */
export function countNoun(garoNoun, count, category) {
  const classifier = getClassifier(category);
  const number = toGaroNumber(count);
  return `${garoNoun} ${classifier}-${number}`;
}

/**
 * Build a counted phrase directly from a classifier label.
 * Use this when you already know which classifier to use.
 *
 * @param {string} garoNoun    - Garo word
 * @param {number} count       - quantity (1-10)
 * @param {string} classifier  - one of: "mang", "sak", "gong", "king", "ge"
 * @returns {string}
 */
export function countNounWithClassifier(garoNoun, count, classifier) {
  if (!CLASSIFIERS[classifier]) {
    throw new Error(`Unknown classifier "${classifier}". Valid: ${Object.keys(CLASSIFIERS).join(", ")}`);
  }
  const number = toGaroNumber(count);
  return `${garoNoun} ${classifier}-${number}`;
}

/**
 * Look up a word from garo_dictionary.json and build a counted phrase.
 * Returns the result in all three languages.
 *
 * @param {object} dictionary  - the parsed garo_dictionary.json object
 * @param {string} category    - category key (e.g. "animals")
 * @param {string} englishWord - English key (e.g. "dog")
 * @param {number} count       - quantity (1-10)
 * @returns {{ english: string, garo: string, hindi: string }}
 *
 * @example
 * const dict = await fetch('/garo_dictionary.json').then(r => r.json())
 * buildPhrase(dict, 'animals', 'dog', 3)
 * // => { english: '3 dog', garo: 'achak mang-gittam', hindi: '3 kutte' }
 */
export function buildPhrase(dictionary, category, englishWord, count) {
  const categoryData = dictionary[category];
  if (!categoryData) throw new Error(`Category "${category}" not found in dictionary.`);

  const entry = categoryData[englishWord];
  if (!entry) throw new Error(`Word "${englishWord}" not found in category "${category}".`);

  const garoWord = typeof entry === "object" ? entry.garo : entry;
  const hindiWord = typeof entry === "object" ? entry.hindi : "";

  const classifier = categoryData._classifier || getClassifier(category);
  const number = toGaroNumber(count);

  return {
    english: `${count} ${englishWord}`,
    garo: `${garoWord} ${classifier}-${number}`,
    hindi: hindiWord ? `${count} ${hindiWord}` : "",
  };
}

/**
 * Validate that a Garo counted phrase follows the correct order.
 * Correct:   "achak mang-sa"   (noun  classifier-number)
 * Incorrect: "achak sa-mang"   (noun  number-classifier)
 *
 * @param {string} phrase
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePhrase(phrase) {
  const classifierLabels = Object.keys(CLASSIFIERS).join("|");
  const numberWords = Object.values(NUMBERS).join("|");

  const correctPattern = new RegExp(
    `^.+\\s+(${classifierLabels})-(${numberWords})$`
  );
  const wrongPattern = new RegExp(
    `(${numberWords})[·\\-](${classifierLabels})`
  );

  if (wrongPattern.test(phrase)) {
    return {
      valid: false,
      message: `Wrong order. Found "number-classifier". Correct order is "classifier-number". e.g. mang-sa not sa-mang`,
    };
  }
  if (correctPattern.test(phrase)) {
    return { valid: true, message: "Correct classifier order." };
  }
  return { valid: true, message: "No classifier pattern detected." };
}

// ─── Default export (all functions bundled) ───────────────────────────────────

export default {
  NUMBERS,
  CLASSIFIERS,
  toGaroNumber,
  getClassifier,
  countNoun,
  countNounWithClassifier,
  buildPhrase,
  validatePhrase,
};
