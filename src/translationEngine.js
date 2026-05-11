import garoDictionary from '../garo_dictionary.json'
import { countNoun, validatePhrase, NUMBERS as NUMBER_WORDS } from './garo_classifier.js'

/**
 * Semantic Translation Engine for Garo Language
 * Handles morphology, classifiers, fuzzy matching, and semantic understanding
 */

class GaroTranslationEngine {

  constructor() {

    this.dictionary = garoDictionary

    this.englishToGaro = {}
    this.garoToEnglish = {}
    this.englishToHindi = {}
    this.hindiToGaro = {}

    // =====================================================
    // AI LANGUAGE ENGINES
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

    this.NOUN_LOCATIONS = [
      'market',
      'school',
      'house',
      'forest',
      'church',
      'village',
    ]

    this.CONJUNCTIONS = {
      and: 'aro',
      but: 'indiba',
      because: 'maina',
      or: 'ba',
      while: 'somoio',
      then: 'unon',
    }

    this.VERBS = {

      go: 're·ang',
      come: 're·ba',
      eat: 'cha·',
      drink: 'ring',
      sleep: 'tusi',
      sit: 'asong',
      work: 'dak',
      give: 'on·',
      take: 'ra·',
      see: 'ni',
      watch: 'ni',
      write: 'se·',
      buy: 'bre',
      sell: 'pal',
      know: 'ui',
      love: 'ka·sa',
      help: 'dakchak',
      play: 'kal',
      speak: 'agan',
      pray: 'bi·',
    }

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

      knew: 'know',
      knowing: 'know',

      bought: 'buy',
      buying: 'buy',

      sold: 'sell',
      selling: 'sell',
    }

    this.SUFFIX = {

      continuous: 'enga',
      future: 'gen',
      imperative: 'bo',
      past: 'a',
      questionPast: 'ama?',
      questionPresent: 'engma?',
      negation: 'ja',
      location: 'chi',
    }

    // =====================================================
    // PHRASE ENGINE
    // =====================================================

    this.phraseDictionary = {

      'hi': 'Salam',
      'hello': 'Salam',
      'thank you': 'Mitela',
      'thanks': 'Mitela',
      'good morning': 'Pringnam',
      'good night': 'Walnam',

      "let's go": 'Hai re·angha',
      'lets go': 'Hai re·angha',

      'i love you': 'Anga nang·na ka·sa',
      'i dont know': 'Anga uija',
      "i don't know": 'Anga uija',
    }

    this.buildIndexes()
  }

  // =====================================================
  // NORMALIZATION
  // =====================================================

  normalize(text) {

    if (!text) return ''

    return text
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[^\w\s'·?!-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  tokenize(text) {
    return this.normalize(text)
      .split(' ')
      .filter(Boolean)
  }

  // =====================================================
  // INDEX BUILDER
  // =====================================================

  buildIndexes() {

    Object.keys(this.dictionary).forEach(category => {

      const section = this.dictionary[category]

      if (!section || typeof section !== 'object') {
        return
      }

      if (category.startsWith('_')) {
        return
      }

      Object.entries(section).forEach(([key, value]) => {

        if (key.startsWith('_')) {
          return
        }

        const english = key.toLowerCase().trim()

        let garo = ''
        let hindi = ''

        if (typeof value === 'object') {

          garo = (value.garo || '')
            .toLowerCase()
            .trim()

          hindi = (value.hindi || '')
            .toLowerCase()
            .trim()

        } else {

          garo = String(value)
            .toLowerCase()
            .trim()
        }

        if (english && garo) {

          this.englishToGaro[english] = {
            garo,
            hindi,
            category,
          }

          this.garoToEnglish[garo] = {
            english,
            hindi,
            category,
          }
        }
      })
    })
  }

  // =====================================================
  // AI TENSE DETECTOR
  // =====================================================

  detectTense(words) {

    if (words.includes('will')) {
      return 'future'
    }

    if (
      words.includes('did') ||
      words.includes('went') ||
      words.includes('ate') ||
      words.includes('came')
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
  // NEGATION DETECTOR
  // =====================================================

  isNegative(words) {

    return (
      words.includes('not') ||
      words.includes("don't") ||
      words.includes('dont') ||
      words.includes("didn't") ||
      words.includes("can't")
    )
  }

  // =====================================================
  // QUESTION DETECTOR
  // =====================================================

  isQuestion(input) {
    return input.trim().endsWith('?')
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
  // CONJUGATION ENGINE
  // =====================================================

  conjugateVerb(verbKey, tense, negative = false) {

    const root = this.VERBS[verbKey]

    if (!root) return verbKey

    let output = root

    switch (tense) {

      case 'continuous':
        output += this.SUFFIX.continuous
        break

      case 'future':
        output += this.SUFFIX.future
        break

      case 'past':
        output += this.SUFFIX.past
        break

      case 'imperative':
        output += this.SUFFIX.imperative
        break

      default:
        output = root
    }

    if (negative) {

      if (verbKey === 'know') {
        return 'uija'
      }

      output += this.SUFFIX.negation
    }

    return output
  }

  // =====================================================
  // SUBJECT DETECTOR
  // =====================================================

  detectSubject(words) {

    for (const word of words) {

      if (this.PRONOUNS[word]) {
        return this.PRONOUNS[word]
      }
    }

    return null
  }

  // =====================================================
  // OBJECT DETECTOR
  // =====================================================

  detectObjects(words) {

    const objects = []

    for (const word of words) {

      const translation = this.englishToGaro[word]

      if (translation) {
        objects.push(translation.garo)
      }
    }

    return objects
  }

  // =====================================================
  // LOCATION ENGINE
  // =====================================================

  applyLocation(noun) {
    return noun + this.SUFFIX.location
  }

  // =====================================================
  // QUESTION BUILDER
  // =====================================================

  buildQuestion(words) {

    const tense = this.detectTense(words)

    const subject = this.detectSubject(words)

    if (!subject) return null

    let verbKey = null

    for (const word of words) {

      const resolved = this.resolveVerb(word)

      if (resolved) {
        verbKey = resolved
        break
      }
    }

    if (!verbKey) return null

    const objects = this.detectObjects(words)

    const processed = objects.map(obj => {

      if (
        obj === 'bajal' ||
        obj === 'skul' ||
        obj === 'nok'
      ) {
        return this.applyLocation(obj)
      }

      return obj
    })

    const root = this.VERBS[verbKey]

    if (tense === 'past') {

      return `${subject} ${processed.join(' ')} ${root}${this.SUFFIX.questionPast}`
        .replace(/\s+/g, ' ')
        .trim()
    }

    return `${subject} ${processed.join(' ')} ${root}${this.SUFFIX.questionPresent}`
      .replace(/\s+/g, ' ')
      .trim()
  }

  // =====================================================
  // COMMAND ENGINE
  // =====================================================

  buildCommand(words) {

    let verbKey = null

    for (const word of words) {

      const resolved = this.resolveVerb(word)

      if (resolved) {
        verbKey = resolved
        break
      }
    }

    if (!verbKey) return null

    return this.conjugateVerb(
      verbKey,
      'imperative'
    )
  }

  // =====================================================
  // SENTENCE ENGINE
  // =====================================================

  buildSentence(words) {

    const tense = this.detectTense(words)

    const negative = this.isNegative(words)

    const subject = this.detectSubject(words)

    if (!subject) return null

    let verbKey = null

    for (const word of words) {

      const resolved = this.resolveVerb(word)

      if (resolved) {
        verbKey = resolved
        break
      }
    }

    if (!verbKey) return null

    const verb = this.conjugateVerb(
      verbKey,
      tense,
      negative
    )

    const objects = this.detectObjects(words)

    const processed = objects.map(obj => {

      if (
        obj === 'bajal' ||
        obj === 'skul' ||
        obj === 'nok'
      ) {
        return this.applyLocation(obj)
      }

      return obj
    })

    return `${subject} ${processed.join(' ')} ${verb}`
      .replace(/\s+/g, ' ')
      .trim()
  }

  // =====================================================
  // COMPLEX SENTENCE ENGINE
  // =====================================================

  splitClauses(text) {

    return text
      .split(/\b(and|but|because|or|while|then)\b/)
      .map(x => x.trim())
      .filter(Boolean)
  }

  translateComplex(text) {

    const parts = this.splitClauses(text)

    const translated = []

    for (const part of parts) {

      if (this.CONJUNCTIONS[part]) {

        translated.push(
          this.CONJUNCTIONS[part]
        )

        continue
      }

      translated.push(
        this.translate(part)
      )
    }

    return translated.join(' ')
  }

  // =====================================================
  // MAIN AI TRANSLATOR
  // =====================================================

  translate(text) {

    if (!text) return ''

    const normalized = this.normalize(text)

    // PHRASE ENGINE
    if (this.phraseDictionary[normalized]) {
      return this.phraseDictionary[normalized]
    }

    // COMPLEX SENTENCE
    if (
      /\b(and|but|because|or|while|then)\b/
        .test(normalized)
    ) {
      return this.translateComplex(normalized)
    }

    const words = this.tokenize(normalized)

    // QUESTION ENGINE
    if (this.isQuestion(text)) {

      const question = this.buildQuestion(words)

      if (question) {
        return question
      }
    }

    // COMMAND ENGINE
    if (
      words.length <= 3 &&
      !this.detectSubject(words)
    ) {

      const command = this.buildCommand(words)

      if (command) {
        return command
      }
    }

    // SENTENCE ENGINE
    const sentence = this.buildSentence(words)

    if (sentence) {
      return sentence
    }

    // FALLBACK ENGINE
    return words.map(word => {

      const entry = this.englishToGaro[word]

      if (entry) {
        return entry.garo
      }

      return `[${word}: unknown]`

    }).join(' ')
  }

  // =====================================================
  // PUBLIC TRANSLATOR
  // =====================================================

  translateSentence(text) {

    return {
      original: text,
      translated: this.translate(text),
      language: 'garo',
    }
  }
}
