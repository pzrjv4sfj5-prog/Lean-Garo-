import garoDictionary from '../garo_dictionary.json'

class GaroTranslationEngine {

  constructor() {

    this.dictionary = garoDictionary

    this.englishToGaro = {}
    this.garoToEnglish = {}

    // =====================================================
    // PRONOUNS
    // =====================================================

    this.PRONOUNS = {

      i: 'Anga',
      me: 'Angko',
      you: 'Na·a',
      he: 'Ua',
      she: 'Ua',
      they: 'Bisong',
      we: 'An·ching',
      my: 'Angni',
      your: 'Nangni',
    }

    // =====================================================
    // VERBS
    // =====================================================

    this.VERBS = {

      go: 're·ang',
      come: 're·ba',
      eat: 'cha·',
      drink: 'ring',
      sleep: 'tusi',
      sit: 'asong',
      work: 'dak',
      help: 'dakchak',
      give: 'on·',
      take: 'ra·',
      see: 'ni',
      write: 'se·',
      read: 'porai',
      speak: 'agan',
      buy: 'bre',
      sell: 'pal',
      know: 'ui',
      love: 'ka·sa',
      play: 'kal',
      wash: 'rong',
      wait: 'damo',
      look: 'nia',
    }

    // =====================================================
    // IRREGULARS
    // =====================================================

    this.IRREGULARS = {

      went: 'go',
      going: 'go',
      goes: 'go',

      came: 'come',
      coming: 'come',

      ate: 'eat',
      eating: 'eat',

      drank: 'drink',
      drinking: 'drink',

      slept: 'sleep',
      sleeping: 'sleep',

      wrote: 'write',
      writing: 'write',

      played: 'play',
      playing: 'play',
    }

    // =====================================================
    // SUFFIXES
    // =====================================================

    this.SUFFIX = {

      continuous: 'enga',
      future: 'gen',
      imperative: 'bo',
      past: 'a',
      questionPresent: 'engma?',
      questionPast: 'ama?',
      negation: 'ja',
      location: 'chi',
    }

    // =====================================================
    // LOCATIONS
    // =====================================================

    this.LOCATIONS = {

      market: 'bajal',
      school: 'skul',
      home: 'nok',
      church: 'mondoli',
      village: 'songnok',
    }

    // =====================================================
    // OBJECT + VERB RULES
    // =====================================================

    this.OBJECT_VERB_PATTERNS = {

      'drink water': 'Chi ringbo',
      'drink tea': 'Cha ringbo',
      'eat rice': 'Mi cha·bo',
      'eat food': 'Be·en cha·bo',
      'go market': 'Bajalchi re·angbo',
      'go school': 'Skulchi re·angbo',
      'go home': 'Nokchi re·angbo',
      'come here': 'Ianona re·babo',
      'sit down': 'Asongbo',
      'read book': 'Ki·tap poraibo',
      'play football': 'Football kalbo',
      'wash clothes': 'Gaina rongbo',
    }

    // =====================================================
    // PHRASES
    // =====================================================

    this.PHRASES = {

      hi: 'Salam',
      hello: 'Salam',

      'good morning': 'Pringnam',
      'good evening': 'Attamnam',
      'good night': 'Walnam',

      'thank you': 'Mitela',

      'how are you': 'Na·a namengama?',

      'what are you doing': 'Maidakenga?',

      'where are you going': 'Na·a bano re·angenga?',

      'i love you': 'Anga nang·na ka·sa',

      "i don't know": 'Anga uija',

      'lets go': "Hai re'naha",
      "let's go": "Hai re'naha",
    }

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

        Object.entries(section).forEach(([english, value]) => {

          if (english.startsWith('_')) {
            return
          }

          let garo = ''

          if (typeof value === 'object') {
            garo = value.garo || ''
          } else {
            garo = String(value)
          }

          english = english.toLowerCase().trim()
          garo = garo.toLowerCase().trim()

          if (english && garo) {

            this.englishToGaro[english] = garo
            this.garoToEnglish[garo] = english
          }
        })
      })

    } catch (error) {

      console.error('Dictionary build failed:', error)
    }
  }

  // =====================================================
  // NORMALIZE
  // =====================================================

  normalize(text) {

    if (!text) return ''

    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?]/g, '')
  }

  tokenize(text) {

    return this.normalize(text)
      .split(' ')
      .filter(Boolean)
  }

  // =====================================================
  // DETECT TENSE
  // =====================================================

  detectTense(words) {

    if (words.includes('will')) {
      return 'future'
    }

    if (
      words.includes('did') ||
      words.includes('went') ||
      words.includes('ate')
    ) {
      return 'past'
    }

    if (
      words.includes('am') ||
      words.includes('is') ||
      words.includes('are') ||
      words.some(w => w.endsWith('ing'))
    ) {
      return 'continuous'
    }

    return 'present'
  }

  // =====================================================
  // NEGATIVE
  // =====================================================

  isNegative(words) {

    return (
      words.includes('not') ||
      words.includes("don't") ||
      words.includes('dont')
    )
  }

  // =====================================================
  // QUESTION
  // =====================================================

  isQuestion(text) {

    return text.trim().endsWith('?')
  }

  // =====================================================
  // VERB RESOLVER
  // =====================================================

  resolveVerb(word) {

    if (this.VERBS[word]) {
      return word
    }

    if (this.IRREGULARS[word]) {
      return this.IRREGULARS[word]
    }

    return null
  }

  // =====================================================
  // CONJUGATE
  // =====================================================

  conjugateVerb(verbKey, tense) {

    const root = this.VERBS[verbKey]

    if (!root) {
      return verbKey
    }

    switch (tense) {

      case 'continuous':
        return root + this.SUFFIX.continuous

      case 'future':
        return root + this.SUFFIX.future

      case 'past':
        return root + this.SUFFIX.past

      default:
        return root
    }
  }

  // =====================================================
  // TRANSLATE WORD
  // =====================================================

  translateWord(word) {

    return (
      this.englishToGaro[word] ||
      this.PRONOUNS[word] ||
      this.LOCATIONS[word] ||
      word
    )
  }

  // =====================================================
  // OBJECT VERB
  // =====================================================

  parseObjectVerb(words) {

    const joined = words.join(' ')

    if (this.OBJECT_VERB_PATTERNS[joined]) {
      return this.OBJECT_VERB_PATTERNS[joined]
    }

    return null
  }

  // =====================================================
  // QUESTION BUILDER
  // =====================================================

  buildQuestion(words) {

    const subject =
      this.PRONOUNS[words[1]] || 'Na·a'

    let verb = null

    for (const word of words) {

      const resolved =
        this.resolveVerb(word)

      if (resolved) {
        verb = resolved
      }
    }

    if (!verb) {
      return null
    }

    return `${subject} ${this.VERBS[verb]}engma?`
  }

  // =====================================================
  // BUILD SENTENCE
  // =====================================================

  buildSentence(words) {

    const tense =
      this.detectTense(words)

    let subject = null
    let verb = null

    const objects = []

    for (const word of words) {

      if (this.PRONOUNS[word]) {

        subject = this.PRONOUNS[word]
        continue
      }

      const resolved =
        this.resolveVerb(word)

      if (resolved) {

        verb = resolved
        continue
      }

      if (
        ![
          'am',
          'is',
          'are',
          'will',
          'to',
          'the',
          'a',
          'an'
        ].includes(word)
      ) {

        let translated =
          this.translateWord(word)

        if (this.LOCATIONS[word]) {
          translated += this.SUFFIX.location
        }

        objects.push(translated)
      }
    }

    if (!verb) {
      return null
    }

    const garoVerb =
      this.conjugateVerb(verb, tense)

    return [
      subject,
      ...objects,
      garoVerb
    ]
      .filter(Boolean)
      .join(' ')
  }

  // =====================================================
  // MAIN TRANSLATOR
  // =====================================================

  translate(text) {

    try {

      if (!text) {
        return ''
      }

      const normalized =
        this.normalize(text)

      // phrases

      if (this.PHRASES[normalized]) {
        return this.PHRASES[normalized]
      }

      // object verb

      if (
        this.OBJECT_VERB_PATTERNS[normalized]
      ) {
        return this.OBJECT_VERB_PATTERNS[normalized]
      }

      const words =
        this.tokenize(normalized)

      // question

      if (this.isQuestion(text)) {

        const q =
          this.buildQuestion(words)

        if (q) {
          return q
        }
      }

      // sentence

      const sentence =
        this.buildSentence(words)

      if (sentence) {
        return sentence
      }

      // fallback

      return words
        .map(word => this.translateWord(word))
        .join(' ')

    } catch (error) {

      console.error('Translation failed:', error)

      return 'Translation failed'
    }
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  translateSentence(text) {

    return {

      original: text,

      translated: this.translate(text),

      language: 'garo',
    }
  }

  // =====================================================
  // WORD BY WORD
  // =====================================================

  translateSentenceWordByWord(text) {

    const words = this.tokenize(text)

    return {

      original: text,

      translated: words
        .map(word => this.translateWord(word))
        .join(' '),

      breakdown: words.map(word => ({
        english: word,
        garo: this.translateWord(word),
      })),
    }
  }

  // =====================================================
  // ANALYZE GRAMMAR
  // =====================================================

  analyzeGrammar(sentence) {

    const normalized =
      this.normalize(sentence)

    const words =
      this.tokenize(normalized)

    const analysis = {

      original: sentence,

      normalized,

      tokens: words,

      tense:
        this.detectTense(words),

      negative:
        this.isNegative(words),

      question:
        this.isQuestion(sentence),

      subject: null,

      verb: null,

      objects: [],

      translatedPreview:
        this.translate(sentence),
    }

    for (const word of words) {

      if (this.PRONOUNS[word]) {

        analysis.subject = {

          english: word,
          garo: this.PRONOUNS[word]
        }

        continue
      }

      const resolved =
        this.resolveVerb(word)

      if (resolved) {

        analysis.verb = {

          english: word,
          root: resolved,
          garo: this.VERBS[resolved]
        }

        continue
      }

      analysis.objects.push({

        english: word,

        garo:
          this.translateWord(word)
      })
    }

    return analysis
  }

  // =====================================================
  // SEARCH
  // =====================================================

  searchVocabulary(query) {

    const q =
      this.normalize(query)

    const results = []

    Object.keys(this.englishToGaro)
      .forEach(word => {

        if (word.includes(q)) {

          results.push({

            english: word,

            garo:
              this.englishToGaro[word]
          })
        }
      })

    return results
  }

  // =====================================================
  // CATEGORIES
  // =====================================================

  getAllCategories() {

    return Object.keys(this.dictionary)
  }

  getCategoryVocabulary(category) {

    return this.dictionary[category] || {}
  }
}

export default new GaroTranslationEngine()
