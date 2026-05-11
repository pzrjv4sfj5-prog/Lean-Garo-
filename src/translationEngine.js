import garoDictionary from '../garo_dictionary.json'
import conversationPatterns from './data/dictionary/conversation_patterns.json'

class GaroTranslationEngine {

  constructor() {

    // =====================================================
    // SAFE DICTIONARY LOAD
    // =====================================================

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

      "let's eat food":
        "Hai, mi cha·na",

      "let's eat rice":
        "Hai, mi cha·na",

      "let's go eat":
        "Hai, mi cha·na re·na",

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

    // =====================================================
    // BUILD SYSTEMS
    // =====================================================

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

      // =================================================
      // CONVERSATION PATTERNS
      // =================================================

      if (
        this.conversationMap?.[normalized]
      ) {

        return this.conversationMap[normalized]
      }

      // =================================================
      // EXACT PHRASES
      // =================================================

      if (
        this.phraseMap?.[normalized]
      ) {

        return this.phraseMap[normalized]
      }

      const words =
        this.tokenize(normalized)

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
        return ''
      }

      return this.translate(sentence)

    } catch (error) {

      console.error(
        'translateSentence failed:',
        error
      )

      return sentence
    }
  }
}

export default new GaroTranslationEngine()
