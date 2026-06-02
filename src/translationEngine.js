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

const translationEngine = {
  translate,
  translateSentence,
  analyzeGrammar,
  getDictionarySize
};

export {
  translate,
  translateSentence,
  analyzeGrammar,
  getDictionarySize
};

export default translationEngine;
