import phraseMaps, { compiledDict } from './phrase_maps.js';

const DICTIONARY = new Map(phraseMaps.map((entry) => [String(entry.english || '').toLowerCase().trim(), entry]));

function normalize(text) {
  return String(text || '').toLowerCase().trim().replace(/[.,!?;:"'()]/g, '');
}

function pickTranslation(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => pickTranslation(item))
      .find(Boolean) || '';
  }

  if (value && typeof value === 'object') {
    return pickTranslation(value.garo || value.translation || value.text || value.value || '');
  }

  return String(value || '').trim();
}

function findExactTranslation(text) {
  const key = normalize(text);
  const direct = compiledDict?.[key];
  if (direct) return pickTranslation(direct);

  return DICTIONARY.get(key)?.garo || '';
}

function findTranslation(word) {
  const exact = findExactTranslation(word);
  if (exact) return exact;

  const key = normalize(word);
  return DICTIONARY.get(key)?.garo || word;
}

function buildPhraseMatches(text) {
  const tokens = normalize(text).split(/\s+/).filter(Boolean);
  const candidates = [];

  for (let start = 0; start < tokens.length; start += 1) {
    for (let end = tokens.length; end > start; end -= 1) {
      const phrase = tokens.slice(start, end).join(' ');
      const translated = findExactTranslation(phrase);

      if (translated) {
        candidates.push({ phrase, translated, start, end });
      }
    }
  }

  return candidates.sort((a, b) => b.phrase.length - a.phrase.length || a.start - b.start);
}

export function translate(text) {
  if (!text) return '';

  const normalized = normalize(text);
  if (!normalized) return '';

  const phraseMatches = buildPhraseMatches(normalized);
  if (phraseMatches.length > 0) {
    const translatedSegments = [];
    let cursor = 0;

    phraseMatches.forEach((match) => {
      if (match.start < cursor) return;

      const prefix = normalized.split(/\s+/).slice(cursor, match.start).join(' ');
      if (prefix) {
        translatedSegments.push(
          prefix
            .split(/\s+/)
            .filter(Boolean)
            .map((token) => findTranslation(token))
            .join(' ')
        );
      }

      translatedSegments.push(match.translated);
      cursor = match.end;
    });

    const tail = normalized.split(/\s+/).slice(cursor).join(' ');
    if (tail) {
      translatedSegments.push(
        tail
          .split(/\s+/)
          .filter(Boolean)
          .map((token) => findTranslation(token))
          .join(' ')
      );
    }

    return translatedSegments.filter(Boolean).join(' ').trim();
  }

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => findTranslation(token))
    .join(' ')
    .trim();
}


export function getDictionarySize() {
  return DICTIONARY.size;
}

export function translateSentence(text, inputLang = 'en', outputLang = 'garo') {
  const translated = translate(text);
  return {
    translated,
    original: text,
    breakdown: translated ? [{ text, translated }] : [],
    direction: `${inputLang}_to_${outputLang}`,
  };
}

export function analyzeGrammar(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  return {
    wordCount: words.length,
    coverage: words.length ? '100%' : '0%',
    structure: 'direct',
  };
}

export function getAllCategories() {
  return [...new Set(phraseMaps.map((entry) => entry.category || 'general').filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function searchVocabulary(query = '', language = 'all') {
  const needle = normalize(query);
  if (!needle) return [];

  return phraseMaps.filter((entry) => {
    const english = normalize(entry.english);
    const garo = normalize(entry.garo);
    const haystack = `${english} ${garo}`;
    const matchesText = haystack.includes(needle);
    if (!matchesText) return false;

    if (language === 'english') return english.includes(needle);
    if (language === 'garo') return garo.includes(needle);
    return true;
  }).slice(0, 100);
}

export function getCategoryVocabulary(category) {
  return phraseMaps.filter((entry) => (entry.category || 'general') === category).slice(0, 100);
}

export function getPhraseSuggestions(query = '', limit = 8) {
  const needle = normalize(query);
  if (!needle) return [];

  return phraseMaps
    .filter((entry) => {
      const english = normalize(entry.english);
      const garo = normalize(entry.garo);
      return english.includes(needle) || garo.includes(needle);
    })
    .slice(0, limit)
    .map((entry) => ({
      english: entry.english,
      garo: entry.garo,
      category: entry.category || 'general',
    }));
}

const translationEngine = {
  translate,
  getDictionarySize,
  translateSentence,
  analyzeGrammar,
  getAllCategories,
  searchVocabulary,
  getCategoryVocabulary,
  getPhraseSuggestions,
};

export default translationEngine;
