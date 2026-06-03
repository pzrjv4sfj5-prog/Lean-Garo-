import DICT_RAW from '../master_dictionary.json' with { type: 'json' };

const DICTIONARY = new Map(
  DICT_RAW.map(entry => [entry.english.toLowerCase(), entry.garo])
);

function translate(text) {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(/\s+/)
    .map(word => {
      const cleanWord = word.replace(
        /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
        ''
      );

      return DICTIONARY.get(cleanWord) || word;
    })
    .join(' ');
}

function getDictionarySize() {
  return DICTIONARY.size;
}

async function translateSentence(text, inputLang = 'en', outputLang = 'garo') {
  const translated = translate(text);

  return {
    original: text,
    translated,
    breakdown: []
  };
}

async function analyzeGrammar(text, language = 'en') {
  return {
    language,
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    tense: 'unknown',
    notes: ['Grammar engine recovery mode']
  };
}


// ── SEARCH ADAPTERS (platform layer — no core logic changes) ──────────────────

function getAllCategories() {
  const cats = new Set();
  for (const entry of DICT_RAW) {
    if (entry.category) cats.add(entry.category);
  }
  return Array.from(cats).sort();
}

function searchVocabulary(query, lang = 'all', limit = 50) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const entry of DICT_RAW) {
    const matchEn = entry.english.toLowerCase().includes(q);
    const matchGa = entry.garo.toLowerCase().includes(q);
    const match = lang === 'english' ? matchEn
                : lang === 'garo'    ? matchGa
                : matchEn || matchGa;
    if (match) {
      results.push({
        english:  entry.english,
        garo:     entry.garo,
        category: entry.category || 'uncategorized',
      });
      if (results.length >= limit) break;
    }
  }
  return results;
}

function getCategoryVocabulary(category) {
  return DICT_RAW
    .filter(e => (e.category || 'uncategorized') === category)
    .map(e => ({
      english:  e.english,
      garo:     e.garo,
      category: e.category || 'uncategorized',
    }));
}

const translationEngine = {
  translate,
  translateSentence,
  analyzeGrammar,
  getDictionarySize,
  getAllCategories,
  searchVocabulary,
  getCategoryVocabulary,
};

export {
  translate,
  translateSentence,
  analyzeGrammar,
  getDictionarySize,
  getAllCategories,
  searchVocabulary,
  getCategoryVocabulary,
};

export default translationEngine;
