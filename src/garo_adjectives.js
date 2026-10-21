import { lookupGaro } from './lookupEngine.js';
import { lookupPhrase } from './data/phrase_maps.js';

// RULE-006 (2026-10-20, NV-177/178 + PO ruling): a pre-noun adjective takes
// -gipa and stacks directly (size, then colour, then noun: Dalgipa gitchak
// nok). The derivation is universal for every -a-final adjective: drop the
// final -a to get the stem, KEEP any raka, attach -gipa (dal·a -> dal·gipa,
// Chon·a -> Chon·gipa, Nama -> Namgipa, Ta·rak·a -> Ta·rak·gipa). The
// post-noun / predicate form stays the base -a. Adjectives are identified by
// this closed English list (the engine has no POS data) and their Garo base
// comes from the dictionary, never typed in. Adjectives whose base is not
// -a-final (old, new, young, weak, kind) get no derived form and keep the
// previous cascade. Left out on purpose: bad (Namja is nama + negative -ja,
// stem unclear), clean (Rongtal·ata), expensive (same base as hard). Colours
// are bare words (Dalgipa gitchak nok); only red has attested placement.
const PRE_NOUN_ADJ_ENGLISH = new Set([
  'big', 'small', 'long', 'short', 'tall', 'good', 'fast', 'slow', 'heavy', 'beautiful',
  'hot', 'cold', 'dirty', 'strong', 'thin', 'thick', 'soft', 'hard', 'sweet', 'dry', 'wet',
  'poor', 'wide', 'narrow', 'deep', 'tasty', 'angry', 'hungry', 'sick', 'lazy', 'clever',
  'cheap', 'full', 'sharp', 'dull', 'quiet', 'warm', 'round', 'smooth', 'rough', 'tired',
  'busy', 'ready', 'green',
]);
export const PRE_NOUN_COLOUR_ADJ = { red: 'gitchak' };
export function preNounAdjectiveForm(english) {
  if (!PRE_NOUN_ADJ_ENGLISH.has(english)) return null;
  const base = String(lookupPhrase(english) || lookupGaro(english) || '');
  if (!base || /\s/.test(base) || !/a$/i.test(base)) return null;
  return base.slice(0, -1).toLowerCase() + 'gipa';
}

// Leading adjectives of an English noun phrase -> { adj: 'dal·gipa gitchak', rest: [noun words] }.
// The final word is always left for the noun, so a lone adjective is not consumed.
export function splitPreNounAdjectives(words) {
  const parts = []; let i = 0;
  while (i < words.length - 1) {
    const w = words[i].toLowerCase();
    const form = preNounAdjectiveForm(w) || PRE_NOUN_COLOUR_ADJ[w];
    if (!form) break;
    parts.push(form); i++;
  }
  return parts.length ? { adj: parts.join(' '), rest: words.slice(i) } : null;
}
