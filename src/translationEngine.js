import garoDictionary from '../garo_dictionary.json'
import conversationPatterns from './data/dictionary/conversation_patterns.json'
import { countNoun } from './garo_classifier'

class GaroTranslationEngine {

  constructor() {

    this.dictionary =
      typeof garoDictionary === 'object' &&
      garoDictionary !== null
        ? garoDictionary
        : {}

    this.englishToGaro = {}
    this.garoToEnglish = {}

    // =====================================================
    // PRONOUNS
    // =====================================================

    this.pronouns = {

      i: 'Anga',
      me: 'Angko',
      you: 'Na·a',
      he: 'Ua',
      she: 'Ua',
      we: 'An·ching',
      they: 'Bisong',

      my: 'Angni',
      your: 'Nangni',
      our: 'An·chingni',
    }

    // =====================================================
    // NOUNS
    // =====================================================

    this.nouns = {

      rice: 'mi',
      food: 'be·en',
      water: 'chi',
      tea: 'cha',
      milk: 'to',
      meat: 'bik',
      fish: 'na·tok',
      chicken: 'do·o',
      bird: 'do·o',

      market: 'bajal',
      school: 'skul',
      house: 'nok',
      home: 'nok',

      book: 'ki·tap',
      clothes: 'gaina',
      road: 'rama',

      dog: 'a·chak',
      cat: 'bi·sim',
    }

    this.englishToCategory = {}
    this.manualNounCategoryMap = {
      chicken: 'birds',
      bird: 'birds',
      cat: 'animals',
      dog: 'animals',
      fish: 'insects_and_aquatic',
      banana: 'fruits',
      book: 'education',
    }

    this.numberWords = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    }

    // =====================================================
    // VERBS
    // =====================================================

    this.verbs = {

      eat: 'cha·',
      drink: 'ring',
      go: 're·ang',
      come: 're·ba',
      sleep: 'tusi',
      sit: 'asong',
      run: 'kat',
      walk: 'song',
      read: 'porai',
      write: 'se·',
      work: 'dak',
      speak: 'agan',
      play: 'kal',
      wash: 'rong',
      see: 'ni',
      help: 'dakchak',
      buy: 'bre',
      sell: 'pal',
      cook: 'soa',
      learn: 'skie',
      teach: 'skia',
    }

    // =====================================================
    // COMMON PHRASES
    // =====================================================

    this.phrases = {

      hello: 'Salam',
      hi: 'Salam',

      'good morning': 'Pringnam',
      'good evening': 'Attamnam',
      'good night': 'Walnam',

      'thank you': 'Mitela',
      thanks: 'Mitela',

      'how are you':
        'Na·a namengama?',

      'i love you':
        'Anga nang·na ka·sa',

      "i don't know":
        'Anga uija',

      "let's go":
        "Hai re·naha",

      "let's eat":
        "Hai cha·ha",

      "let's sleep":
        "Hai tusina",

      "let's drink":
        "Hai ringaha",

      "let's sit":
        "Hai asongha",

      "let's play":
        "Hai kalha",

      "let's work":
        "Hai dakha",

      "let's run":
        "Hai katha",

      'drink water':
        'Chi ringbo',

      'eat rice':
        'Mi cha·bo',

      'eat food':
        'Be·en cha·bo',

      'drink tea':
        'Cha ringbo',

      'i am eating':
        'Anga cha·enga',

      'i am eating rice':
        'Anga mi cha·enga',

      'i am drinking':
        'Anga ringenga',

      'i am drinking water':
        'Anga chi ringenga',

      'i am sleeping':
        'Anga tusienga',

      'i am sitting':
        'Anga asongenga',

      'i am running':
        'Anga katenga',

      'i am going':
        'Anga re·angenga',

      'i am coming':
        'Anga re·baenga',

      'you are eating':
        'Na·a cha·enga',

      'you are eating rice':
        'Na·a mi cha·enga',
    }

    this.buildIndexes()
    this.buildConversationPatterns()
    this.buildPhraseMap()
  }

  // =====================================================
  // NORMALIZE
  // =====================================================

  normalize(text) {

    if (!text) return ''

    return String(text)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[.,!?‘’']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // =====================================================
  // BUILD CONVERSATION PATTERNS
  // =====================================================

  buildConversationPatterns() {

    try {

      this.conversationMap = {}

      Object.entries(conversationPatterns)

        .forEach(([english, value]) => {

          if (
            !english ||
            String(english).startsWith('_')
          ) {
            return
          }

          if (
            typeof value !== 'object' ||
            !value?.garo
          ) {
            return
          }

          const normalized =
            this.normalize(english)

          this.conversationMap[normalized] =
            value.garo
        })

    } catch (error) {

      console.error(
        'Conversation pattern build failed:',
        error
      )

      this.conversationMap = {}
    }
  }

  // =====================================================
  // BUILD PHRASE MAP
  // =====================================================

  buildPhraseMap() {

    try {

      this.phraseMap = {}

      Object.entries(this.phrases).forEach(([english, garo]) => {

        const normalizedEnglish =
          this.normalize(english)

        if (!normalizedEnglish || !garo) {
          return
        }

        this.phraseMap[normalizedEnglish] = garo
      })

      Object.entries(this.englishToGaro).forEach(([english, garo]) => {

        if (!english || !garo) {
          return
        }

        const normalizedEnglish =
          this.normalize(english)

        if (normalizedEnglish.includes(' ')) {

          this.phraseMap[normalizedEnglish] =
            garo
        }
      })

      this.maxPhraseLength = Math.max(
        1,
        ...Object.keys(this.phraseMap).map(phrase =>
          String(phrase)
            .split(' ')
            .filter(Boolean).length
        )
      )

    } catch (error) {

      console.error(
        'Phrase map build failed:',
        error
      )

      this.phraseMap = { ...this.phrases }
      this.maxPhraseLength = 1
    }
  }

  // =====================================================
  // BUILD INDEXES
  // =====================================================

  buildIndexes() {

    try {

      Object.keys(this.dictionary).forEach(category => {

        const section = this.dictionary[category]

        if (
          !section ||
          typeof section !== 'object' ||
          Array.isArray(section)
        ) {
          return
        }

        Object.entries(section).forEach(([engKey, value]) => {

          if (!engKey) return

          if (String(engKey).startsWith('_')) {
            return
          }

          let garoValue = ''

          if (
            typeof value === 'object' &&
            value !== null
          ) {

            garoValue =
              value.garo || ''

          } else {

            garoValue =
              String(value || '')
          }

          const english =
            String(engKey)
              .toLowerCase()
              .trim()

          const garo =
            String(garoValue)
              .toLowerCase()
              .trim()

          if (!english || !garo) {
            return
          }

          this.englishToGaro[english] = garo
          this.garoToEnglish[garo] = english
          this.englishToCategory[english] = category
        })
      })

    } catch (error) {

      console.error(
        'Dictionary build failed:',
        error
      )
    }
  }

  // =====================================================
  // COUNT PHRASES
  // =====================================================

  parseNumberWord(word = '') {
    if (!word) return null
    const normalized = String(word).toLowerCase().trim()
    if (/^\d+$/.test(normalized)) {
      const n = Number(normalized)
      return n >= 1 && n <= 10 ? n : null
    }
    return this.numberWords[normalized] || null
  }

  singularizeWord(word = '') {
    if (!word) return ''
    const normalized = String(word).toLowerCase().trim()
    if (this.englishToGaro[normalized] || this.nouns[normalized]) {
      return normalized
    }
    if (normalized.endsWith('ies')) {
      return normalized.slice(0, -3) + 'y'
    }
    if (normalized.endsWith('es')) {
      return normalized.slice(0, -2)
    }
    if (normalized.endsWith('s')) {
      return normalized.slice(0, -1)
    }
    return normalized
  }

  translateCountPhrase(words = []) {
    if (words.length < 2) {
      return null
    }

    const count = this.parseNumberWord(words[0])
    if (!count) {
      return null
    }

    const nounText = words.slice(1).join(' ')
    const singular = this.singularizeWord(nounText)
    const garoNoun = this.englishToGaro[singular] || this.nouns[singular]
    const category =
      this.englishToCategory[singular] ||
      this.manualNounCategoryMap[singular] ||
      'ge'

    if (!garoNoun) {
      return null
    }

    try {
      return countNoun(garoNoun, count, category)
    } catch (error) {
      return null
    }
  }

  // =====================================================
  // NORMALIZE
  // =====================================================

  normalize(text) {

    if (!text) return ''

    return String(text)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[.,!?‘’']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // =====================================================
  // TOKENIZE
  // =====================================================

  tokenize(text) {

    return this.normalize(text)
      .split(' ')
      .filter(Boolean)
  }

  // =====================================================
  // TRANSLATE WORD
  // =====================================================

  translateWord(word = '') {

    return (

      this.pronouns[word] ||

      this.nouns[word] ||

      this.englishToGaro[word] ||

      word
    )
  }

  // =====================================================
  // TRANSLATE WITH PHRASES
  // =====================================================

  translateWithPhrases(words = []) {

    const result = []
    let index = 0

    while (index < words.length) {

      let matched = false

      const maxLen = Math.min(
        this.maxPhraseLength,
        words.length - index
      )

      for (let length = maxLen; length > 0; length--) {

        const phrase = words
          .slice(index, index + length)
          .join(' ')

        const garo =
          this.phraseMap[phrase]

        if (garo) {

          result.push(garo)

          index += length

          matched = true

          break
        }
      }

      if (!matched) {

        result.push(
          this.translateWord(words[index])
        )

        index += 1
      }
    }

    return result.join(' ').trim()
  }

  // =====================================================
  // MAIN TRANSLATE
  // =====================================================

  translate(text = '') {

    try {

      const normalized =
        this.normalize(text)

      if (!normalized) {
        return ''
      }

      if (
        this.conversationMap?.[normalized]
      ) {

        return this.conversationMap[normalized]
      }

      if (
        this.phraseMap?.[normalized]
      ) {

        return this.phraseMap[normalized]
      }

      const words =
        this.tokenize(normalized)

      const countPhrase = this.translateCountPhrase(words)
      if (countPhrase) {
        return countPhrase
      }

      const hasVerb =
        words.some(word =>
          Boolean(this.detectVerb(word))
        )

      if (hasVerb) {
        return this.buildSentence(words)
      }

      return this.translateWithPhrases(words)

    } catch (error) {

      console.error(
        'Translation failed:',
        error
      )

      return ''
    }
  }

  // =====================================================
  // TRANSLATE SENTENCE
  // =====================================================

  translateSentence(sentence = '') {

    try {

      if (!sentence) {
        return {
          original: '',
          translated: '',
          breakdown: [],
          language: 'garo',
          tokens: [],
          morphology: [],
          classifiers: [],
          numbers: [],
          tenses: [],
        }
      }

      const translated = this.translate(sentence)
      const words = this.tokenize(sentence)

      return {
        original: sentence,
        translated,
        breakdown: words.map(word => ({
          english: word,
          garo: this.translateWord(word),
          category: 'general',
        })),
        language: 'garo',
        tokens: words,
        morphology: [],
        classifiers: [],
        numbers: [],
        tenses: [this.detectTense(words)],
      }

    } catch (error) {

      console.error(
        'translateSentence failed:',
        error
      )

      return {
        original: sentence,
        translated: '',
        breakdown: [],
        language: 'garo',
        tokens: [],
        morphology: [],
        classifiers: [],
        numbers: [],
        tenses: [],
      }
    }
  }

  // =====================================================
  // ANALYZE GRAMMAR
  // =====================================================

  analyzeGrammar(text = '') {

    try {

      const normalized =
        this.normalize(text)

      const words =
        this.tokenize(normalized)

      return {

        original: text,

        normalized,

        wordCount: words.length,

        words,

        tense:
          normalized.includes('enga')
            ? 'present_continuous'
            : normalized.includes('aha')
            ? 'past'
            : normalized.includes('gen')
            ? 'future'
            : 'unknown',

        isQuestion:
          normalized.includes('?'),

        hasConversationPattern:
          !!this.conversationMap?.[normalized],

        translation:
          this.translate(text),
      }

    } catch (error) {

      console.error(
        'Grammar analysis failed:',
        error
      )

      return {
        original: text,
        normalized: this.normalize(text),
        wordCount: 0,
        words: [],
        tense: 'unknown',
        isQuestion: false,
        hasConversationPattern: false,
        translation: '',
        morphology: [],
        numbers: [],
        error: true,
      }
    }
  }
}

export default new GaroTranslationEngine()
