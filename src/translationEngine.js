import garoDictionary from '../garo_dictionary.json'

class GaroTranslationEngine {

  constructor() {

    this.dictionary = garoDictionary || {}

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
    // TRUE GARO VERBS
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

      // TRUE GARO SENTENCES

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
    // HELPER WORDS
    // =====================================================

    this.helperWords = [
      'am',
      'is',
      'are',
      'was',
      'were',
      'have',
      'has',
      'had',
      'the',
      'a',
      'an',
      'to',
      'be',
      'will',
    ]

    this.buildIndexes()
  }

  // =====================================================
  // BUILD INDEXES
  // =====================================================

  buildIndexes() {

    try {

      Object.keys(this.dictionary).forEach(category => {

        const section = this.dictionary[category]

        if (!section || typeof section !== 'object') {
          return
        }

        Object.entries(section).forEach(([engKey, value]) => {

          if (!engKey) return

          if (engKey.startsWith('_')) {
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
              String(value)
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
  // NORMALIZE
  // =====================================================

  normalize(text) {

    if (!text) return ''

    return String(text)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[.,!?]/g, '')
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
  // DETECT TENSE
  // =====================================================

  detectTense(words = []) {

    if (
      words.includes('am') ||
      words.includes('is') ||
      words.includes('are')
    ) {

      return 'continuous'
    }

    if (
      words.includes('have') ||
      words.includes('has')
    ) {

      return 'perfect'
    }

    if (
      words.includes('was') ||
      words.includes('were')
    ) {

      return 'past'
    }

    if (
      words.includes('will')
    ) {

      return 'future'
    }

    return 'present'
  }

  // =====================================================
  // DETECT VERB
  // =====================================================

  detectVerb(word = '') {

    if (this.verbs[word]) {
      return word
    }

    // eating -> eat

    if (word.endsWith('ing')) {

      let base =
        word.slice(0, -3)

      if (base.endsWith('nn')) {
        base = base.slice(0, -1)
      }

      if (base.endsWith('tt')) {
        base = base.slice(0, -1)
      }

      if (base.endsWith('mm')) {
        base = base.slice(0, -1)
      }

      if (base === 'com') {
        base = 'come'
      }

      if (this.verbs[base]) {
        return base
      }
    }

    // played -> play

    if (word.endsWith('ed')) {

      const base =
        word.slice(0, -2)

      if (this.verbs[base]) {
        return base
      }
    }

    return null
  }

  // =====================================================
  // BUILD GARO VERB
  // =====================================================

  buildVerb(verb, tense) {

    const root =
      this.verbs[verb]

    if (!root) {
      return verb
    }

    if (tense === 'continuous') {
      return root + 'enga'
    }

    if (tense === 'perfect') {
      return root + 'manjok'
    }

    if (tense === 'past') {
      return root + 'aha'
    }

    if (tense === 'future') {
      return root + 'gen'
    }

    return root + 'bo'
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
  // BUILD TRUE GARO SENTENCE
  // =====================================================

  buildSentence(words = []) {

    let subject = ''

    let objects = []

    let verb = ''

    const tense =
      this.detectTense(words)

    for (const word of words) {

      if (
        this.helperWords.includes(word)
      ) {
        continue
      }

      // SUBJECT

      if (this.pronouns[word]) {

        subject =
          this.pronouns[word]

        continue
      }

      // VERB

      const foundVerb =
        this.detectVerb(word)

      if (foundVerb) {

        verb =
          this.buildVerb(
            foundVerb,
            tense
          )

        continue
      }

      // OBJECT

      objects.push(
        this.translateWord(word)
      )
    }

    // TRUE GARO ORDER:
    // SUBJECT + OBJECT + VERB

    return [

      subject,

      ...objects,

      verb,

    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
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

      // EXACT PHRASE MATCH

      if (this.phrases[normalized]) {

        return this.phrases[normalized]
      }

      const words =
        this.tokenize(normalized)

      return this.buildSentence(words)

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

  translateSentence(text = '') {

    const words =
      this.tokenize(text)

    return {

      original: text,

      translated:
        this.translate(text),

      breakdown: words.map(word => ({

        english: word,

        garo:
          this.translateWord(word),

        category: 'general',
      })),

      language: 'garo',

      tokens: words,

      morphology: [],

      classifiers: [],

      numbers: [],

      tenses: [
        this.detectTense(words)
      ],
    }
  }

  // =====================================================
  // WORD BY WORD
  // =====================================================

  translateSentenceWordByWord(text = '') {

    const words =
      this.tokenize(text)

    return {

      original: text,

      translated:
        words
          .map(word =>
            this.translateWord(word)
          )
          .join(' '),

      breakdown: [],

      tokens: words,

      morphology: [],

      classifiers: [],

      numbers: [],

      tenses: [],
    }
  }

  // =====================================================
  // ANALYZE GRAMMAR
  // =====================================================

  analyzeGrammar(text = '') {

    const words =
      this.tokenize(text)

    return {

      original: text,

      normalized:
        this.normalize(text),

      translatedPreview:
        this.translate(text),

      structure: 'SOV',

      grammar:
        'True Garo grammar engine',

      tense:
        this.detectTense(words),

      morphology: [],

      classifiers: [],

      numbers: [],

      tokens: words,
    }
  }

  // =====================================================
  // SEARCH
  // =====================================================

  searchVocabulary(query = '') {

    const q =
      this.normalize(query)

    return Object.keys(
      this.englishToGaro
    )

      .filter(word =>
        word.includes(q)
      )

      .map(word => ({

        english: word,

        garo:
          this.englishToGaro[word],
      }))
  }

  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================

  getAllCategories() {

    return Object.keys(
      this.dictionary || {}
    )
  }

  // =====================================================
  // FIXED CATEGORY VOCAB
  // =====================================================

  getCategoryVocabulary(category) {

    const section =
      this.dictionary?.[category]

    if (!section) {
      return []
    }

    // IMPORTANT:
    // RETURN ARRAY NOT OBJECT

    return Object.entries(section)

      .filter(([key]) =>
        !key.startsWith('_')
      )

      .map(([english, value]) => {

        let garo = ''

        if (
          typeof value === 'object' &&
          value !== null
        ) {

          garo =
            value.garo || ''

        } else {

          garo =
            String(value)
        }

        return {

          english,

          garo,

          category,
        }
      })
  }
}

export default new GaroTranslationEngine()
