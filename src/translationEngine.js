import DICT_RAW from '../master_dictionary.json' with { type: 'json' };

const DICTIONARY = new Map(DICT_RAW.map(e => [e.english.toLowerCase(), e.garo]));

export function translate(text) {
  if (!text) return '';
  const tokens = text.toLowerCase().replace(/[.,!]/g, "").split(/\s+/);
  
  // Basic Grammar Logic: If 3+ words, attempt SVO -> SOV reorder
  if (tokens.length >= 3) {
    const s = DICTIONARY.get(tokens[0]) || tokens[0];
    const v = DICTIONARY.get(tokens[tokens.length - 1]) || tokens[tokens.length - 1];
    const o = tokens.slice(1, tokens.length - 1).map(w => DICTIONARY.get(w) || w).join(" ");
    return `${s} ${o} ${v}`;
  }

  // Fallback for simple words
  return tokens.map(w => DICTIONARY.get(w) || w).join(" ");
}

export function getDictionarySize() { return DICTIONARY.size; }
export default translationEngine;
