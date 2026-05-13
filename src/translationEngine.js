import garoDictionary from '../garo_dictionary.json' with { type: 'json' }
import conversationPatterns from './data/dictionary/conversation_patterns.json' with { type: 'json' }
import { countNoun } from './garo_classifier.js'

const numberWords = {
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
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
}

const numberWordRegex = new RegExp(`\\b(${Object.keys(numberWords).join('|')})\\b`, 'gi')

class GaroTranslationEngine {

  constructor() {

    this.dictionary =
      typeof garoDictionary === 'object' &&
      garoDictionary !== null
        ? garoDictionary
        : {}

    this.englishToGaro = {}
    this.garoToEnglish = {}
    this.categoryForWord = {}
    this.categoryIndex = {}

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

      "let's go to the market":
        "Hai bajal re·naha",

      "let's go to market":
        "Hai bajal re·naha",

      "go to the market":
        "Bajal re·naha",

      "go to market":
        "Bajal re·naha",

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

    // Bind methods to preserve `this` when functions are called externally
    this.normalize = this.normalize.bind(this)
    this.tokenize = this.tokenize.bind(this)
    this.translate = this.translate.bind(this)
    this.translateSentence = this.translateSentence.bind(this)
    this.analyzeGrammar = this.analyzeGrammar.bind(this)
    this.translateWord = this.translateWord.bind(this)
    this.translateWithPhrases = this.translateWithPhrases.bind(this)
    this.translateCountPhrase = this.translateCountPhrase.bind(this)
    this.detectTense = this.detectTense.bind(this)
    this.detectVerb = this.detectVerb.bind(this)
    this.buildSentence = this.buildSentence.bind(this)
    this.buildVerb = this.buildVerb.bind(this)
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

      // Index vocabulary section
      const vocabularyRoot = this.dictionary?.vocabulary || {}
      this.indexSection(vocabularyRoot, 'vocabulary')

      // Index other sections that might contain vocabulary
      const sectionsToIndex = [
        'grammar_rules',
        'suffix_system',
        'classifiers',
        'numbers',
        'pronouns',
        'possessive_pronouns',
        'question_words',
        'verbs_present',
        'verb_conjugations',
        'grammar_patterns',
        'conversational_phrases',
        'ambiguous_words'
      ]

      sectionsToIndex.forEach(sectionName => {
        const section = this.dictionary?.[sectionName]
        if (section) {
          this.indexSection(section, sectionName)
        }
      })

    } catch (error) {

      console.error(
        'Dictionary build failed:',
        error
      )
    }
  }

  indexSection(section, sectionName) {
    const traverseNode = (node, currentPath = '') => {
      if (!node || typeof node !== 'object') {
        return
      }

      Object.entries(node).forEach(([key, value]) => {
        if (!key || String(key).startsWith('_')) {
          return
        }

        const categoryPath = currentPath
          ? `${currentPath}.${key}`
          : key

        // Handle direct key-value pairs (English -> Garo)
        if (typeof value === 'string') {
          // This is a direct English -> Garo mapping
          const english = String(key).toLowerCase().trim()
          const garo = String(value).toLowerCase().trim()

          // For vocabulary section, use subcategory names directly (remove 'vocabulary.' prefix)
          const effectiveCategory = sectionName === 'vocabulary' && currentPath.startsWith('vocabulary.') 
            ? currentPath.replace('vocabulary.', '') 
            : (currentPath || sectionName)

          if (english && garo && garo !== 'string') {
            this.englishToGaro[english] = garo
            this.garoToEnglish[garo] = english
            this.englishToCategory[english] = effectiveCategory
            this.categoryForWord[english] = effectiveCategory
            this.categoryIndex[effectiveCategory] = this.categoryIndex[effectiveCategory] || []
            this.categoryIndex[effectiveCategory].push({
              english,
              garo,
              category: effectiveCategory,
            })
          }
          return
        }

        // Handle objects with garo/hindi properties
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (value.garo || value.hindi) {
            const english = String(key).toLowerCase().trim()
            const garo = String(value.garo || '').toLowerCase().trim()

            if (english && garo) {
              this.englishToGaro[english] = garo
              this.garoToEnglish[garo] = english
              this.englishToCategory[english] = currentPath || sectionName
              this.categoryForWord[english] = currentPath || sectionName
              this.categoryIndex[currentPath || sectionName] = this.categoryIndex[currentPath || sectionName] || []
              this.categoryIndex[currentPath || sectionName].push({
                english,
                garo,
                category: currentPath || sectionName,
              })
            }
            return
          }

          // Handle nested objects
          traverseNode(value, categoryPath)
          return
        }

        // Handle arrays (legacy format)
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'object' && item.english && item.garo) {
              const english = String(item.english).toLowerCase().trim()
              const garo = String(item.garo).toLowerCase().trim()

              if (english && garo) {
                this.englishToGaro[english] = garo
                this.garoToEnglish[garo] = english
                this.englishToCategory[english] = currentPath || sectionName
                this.categoryForWord[english] = currentPath || sectionName
                this.categoryIndex[currentPath || sectionName] = this.categoryIndex[currentPath || sectionName] || []
                this.categoryIndex[currentPath || sectionName].push({
                  english,
                  garo,
                  category: currentPath || sectionName,
                })
              }
            }
          })
        }
      })
    }

    traverseNode(section, sectionName)
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

  normalize(text) {

    if (!text) return ''

    return String(text)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[.,!?‘’']/g, '')
      .replace(numberWordRegex, (match) => String(numberWords[match.toLowerCase()] || match))
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

    if (!Array.isArray(words)) {
      return 'unknown'
    }

    const text = words.join(' ').toLowerCase()

    if (
      words.includes('am') ||
      words.includes('is') ||
      words.includes('are')
    ) {
      return 'present_continuous'
    }

    if (
      words.includes('was') ||
      words.includes('were') ||
      words.includes('did') ||
      words.includes('ate') ||
      words.includes('went') ||
      words.includes('came')
    ) {
      return 'past'
    }

    if (
      words.includes('will') ||
      words.includes('shall') ||
      words.includes('going') ||
      words.includes('about')
    ) {
      return 'future'
    }

    if (text.includes('enga')) {
      return 'present_continuous'
    }

    if (text.includes('aha')) {
      return 'past'
    }

    if (text.includes('gen')) {
      return 'future'
    }

    return 'unknown'
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
  // DETECT VERB
  // =====================================================

  detectVerb(word = '') {

    if (!word) return null

    const normalized = String(word).toLowerCase().trim()

    return this.verbs[normalized] || null
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
  // BUILD VERB
  // =====================================================

  buildVerb(root = '', tense = 'unknown') {

    if (!root) return ''

    switch (tense) {

      case 'present_continuous':
        return root + 'enga'

      case 'past':
        return root + 'aha'

      case 'future':
        return root + 'gen'

      default:
        return root + 'enga'
    }
  }

  // =====================================================
  // HELPER WORDS
  // =====================================================

  get helperWords() {
    return [
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
      'shall',
      'do',
      'does',
      'did',
      'going',
      'about',
    ]
  }

  // =====================================================
  // ANALYZE GRAMMAR
  // =====================================================

  async analyzeGrammar(text = '') {

    try {

      const normalized =
        this.normalize(text)

      const words =
        this.tokenize(text)

      const quantities = words
        .map((word) => this.parseNumberWord(word))
        .filter((value) => value !== null)

      // Try Gemini analysis if available
      let geminiAnalysis = null
      try {
        const { analyzeSentence } = await import('./gemini.js')
        geminiAnalysis = await analyzeSentence(text)
      } catch (geminiError) {
        console.warn('Gemini analysis failed:', geminiError.message)
      }

      return {

        original: text,

        normalized,

        wordCount: words.length,

        words,

        tense: this.detectTense(words),

        isQuestion:
          normalized.endsWith('?') ||
          normalized.startsWith('what') ||
          normalized.startsWith('where') ||
          normalized.startsWith('how') ||
          normalized.startsWith('why') ||
          normalized.startsWith('when'),

        hasConversationPattern:
          !!this.conversationMap?.[normalized],

        translation:
          this.translate(text),

        gemini: geminiAnalysis,

        morphology: [],

        numbers: quantities,

        classifiers: quantities.length > 0 ? ['detected'] : [],
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

        gemini: null,

        morphology: [],

        numbers: [],

        classifiers: [],
      }
    }
  }

  // =====================================================
  // SEARCH VOCAB
  // =====================================================

  searchVocabulary(query = '') {

    const q =
      this.normalize(query)

    if (!q) return []

    const englishMatches = Object.entries(this.englishToGaro)
      .filter(([word, garo]) =>
        word.includes(q) ||
        String(garo).toLowerCase().includes(q)
      )
      .map(([word]) => ({
        english: word,
        garo: this.englishToGaro[word],
        category: this.categoryForWord[word] || 'vocabulary',
      }))

    return englishMatches
  }

  // =====================================================
  // GET CATEGORIES
  // =====================================================

  getAllCategories() {

    return Object.keys(this.categoryIndex)
  }

  // =====================================================
  // FIXED CATEGORY VOCAB
  // =====================================================

  getCategoryVocabulary(category) {
    if (!category || !this.categoryIndex) {
      return []
    }

    if (this.categoryIndex[category]) {
      return this.categoryIndex[category]
    }

    const normalized = String(category).toLowerCase().trim()

    return Object.entries(this.categoryIndex)
      .filter(([key]) => key.toLowerCase() === normalized)
      .flatMap(([, entries]) => entries)
  }
}

export default new GaroTranslationEngine()
