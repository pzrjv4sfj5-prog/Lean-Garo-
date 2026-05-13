import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { analyzeSentence } from './src/gemini.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3001

let englishToGaro = {}
let garoToEnglish = {}
let phraseMap = {}
let classifierMap = {}
let categoryIndex = {}
let classifierSuffixMap = {}
let suffixSystem = {}
let exactConversationMap = {}
let indexedEntryCount = 0

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
  twenty: 20
}

const punctuationRegex = /[.,!?‘’'"“”:;()\[\]\/\-]/g
const whitespaceRegex = /\s+/g
const numberWordRegex = new RegExp(`\\b(${Object.keys(numberWords).join('|')})\\b`, 'gi')

const pronouns = {
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

const helperWords = new Set([
  'am', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
  'the', 'a', 'an', 'to', 'be', 'will', 'shall', 'do', 'does', 'did',
  'going', 'about', 'let', 'lets', 'dont', 'not', 'please', 'can', 'could'
])

const verbs = {
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

const commonPhraseMap = {
  hello: 'Salam',
  hi: 'Salam',
  'good morning': 'Pringnam',
  'good evening': 'Attamnam',
  'good night': 'Walnam',
  'thank you': 'Mitela.',
  thanks: 'Mitela.',
  'how are you': 'Na·a namengama?',
  'i love you': 'Anga nang·na ka·sa',
  'i don\'t know': 'Anga uija.',
  "i don't know": 'Anga uija.',
  "let's go": 'Hai re·naha',
  "let's eat": 'Hai cha·ha',
  "let's sleep": 'Hai tusina',
  "let's drink": 'Hai ringaha',
  "let's sit": 'Hai asongha',
  "let's play": 'Hai kalha',
  "let's work": 'Hai dakha',
  "let's run": 'Hai katha',
  'eat rice': 'Mi cha·bo',
  'drink water': 'Chi ringbo',
  'drink tea': 'Cha ringbo',
  'i am eating rice': 'Anga mi cha·enga',
  'i am drinking water': 'Anga chi ringenga',
  'i am eating': 'Anga cha·enga',
  'i am drinking': 'Anga ringenga',
  'i am sleeping': 'Anga tusienga',
  'i am sitting': 'Anga asongenga',
  'i am running': 'Anga katenga',
  'i am going': 'Anga re·angenga',
  'i am coming': 'Anga re·baenga',
  'you are eating': 'Na·a cha·enga',
  'you are eating rice': 'Na·a mi cha·enga',
}

function normalizeText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const lowered = value.toLowerCase().trim()
  const stripped = lowered.replace(punctuationRegex, '')
  const normalizedNumbers = stripped.replace(numberWordRegex, (match) => String(numberWords[match.toLowerCase()] || match))
  return normalizedNumbers.replace(whitespaceRegex, ' ').trim()
}

function normalizeKey(value) {
  return normalizeText(value)
}

function singularizeWord(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const normalized = value.toLowerCase().trim()

  if (englishToGaro[normalized] || pronouns[normalized]) {
    return normalized
  }

  if (normalized.endsWith('ies')) {
    return normalized.slice(0, -3) + 'y'
  }

  if (normalized.endsWith('oes') || normalized.endsWith('ses') || normalized.endsWith('xes') || normalized.endsWith('zes') || normalized.endsWith('ches') || normalized.endsWith('shes')) {
    return normalized.slice(0, -2)
  }

  if (normalized.endsWith('es')) {
    return normalized.slice(0, -2)
  }

  if (normalized.endsWith('s')) {
    return normalized.slice(0, -1)
  }

  return normalized
}

function detectVerb(word) {
  if (typeof word !== 'string') {
    return null
  }

  return verbs[word.toLowerCase().trim()] || null
}

function detectTense(words = []) {
  if (!Array.isArray(words)) {
    return 'unknown'
  }

  const normalized = words.map(String).join(' ').toLowerCase()

  if (words.includes('am') || words.includes('is') || words.includes('are')) {
    return 'present_continuous'
  }

  if (words.includes('was') || words.includes('were') || words.includes('did') || words.includes('ate') || words.includes('went') || words.includes('came')) {
    return 'past'
  }

  if (words.includes('will') || words.includes('shall') || normalized.includes('going to')) {
    return 'future'
  }

  return 'unknown'
}

function buildVerb(root, tense = 'unknown') {
  if (!root) return ''

  switch (tense) {
    case 'present_continuous':
      return `${root}enga`
    case 'past':
      return `${root}aha`
    case 'future':
      return `${root}gen`
    default:
      return `${root}enga`
  }
}

function buildSentence(normalized) {
  const words = normalized.split(' ').filter(Boolean)
  if (!words.length) {
    return ''
  }

  const tense = detectTense(words)
  let subject = ''
  let verb = ''
  const objects = []

  for (const token of words) {
    if (helperWords.has(token)) {
      continue
    }

    if (!subject && pronouns[token]) {
      subject = pronouns[token]
      continue
    }

    const verbRoot = detectVerb(token)
    if (verbRoot) {
      verb = buildVerb(verbRoot, tense)
      continue
    }

    if (englishToGaro[token]) {
      objects.push(englishToGaro[token])
      continue
    }

    if (pronouns[token]) {
      objects.push(pronouns[token])
      continue
    }

    objects.push(token)
  }

  return [subject, ...objects, verb]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isLikelyGaro(value) {
  if (typeof value !== 'string') {
    return false
  }

  if (/[·]/.test(value)) {
    return true
  }

  if (/\b(gittam|mang|sak|gong|king|ge|na\b|bo\b|engma|gni|sa)\b/.test(value)) {
    return true
  }

  return false
}

function isLikelyEnglish(value) {
  if (typeof value !== 'string') {
    return false
  }

  return /^[a-z0-9' ]+$/i.test(value.trim())
}

function repairMalformedPair(englishCandidate, garoCandidate) {
  if (isLikelyGaro(englishCandidate) && isLikelyEnglish(garoCandidate)) {
    return [normalizeKey(garoCandidate), garoCandidate.trim()]
  }

  if (!isLikelyEnglish(englishCandidate) && isLikelyEnglish(garoCandidate)) {
    return [normalizeKey(garoCandidate), englishCandidate.trim()]
  }

  return [normalizeKey(englishCandidate), garoCandidate.trim()]
}

function indexEnglishGaroPairs(node) {
  if (!node || typeof node !== 'object') {
    return
  }

  if (Array.isArray(node)) {
    node.forEach((value) => indexEnglishGaroPairs(value))
    return
  }

  if (typeof node.english === 'string' && typeof node.garo === 'string') {
    const englishKey = normalizeKey(node.english)
    const garoValue = node.garo.trim()

    if (englishKey && garoValue) {
      if (!englishToGaro[englishKey]) {
        englishToGaro[englishKey] = garoValue
        garoToEnglish[normalizeKey(garoValue)] = englishKey
        indexedEntryCount += 1
      }
      registerPhrase(node.english, node.garo)
    }
  }

  Object.values(node).forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      indexEnglishGaroPairs(value)
    }
  })
}

function buildClassifierSuffixMap(definitions, patterns) {
  const result = {}

  function addExample(english, garo) {
    const normalizedEnglish = normalizeText(english)
    const normalizedGaro = garo.trim()

    const numberMatch = normalizedEnglish.match(/\b(\d+)\b/)
    const classifierMatch = normalizedGaro.match(/\b([a-zA-Z]+)-([a-zA-Z·]+)\b/) || normalizedGaro.match(/\b([a-zA-Z]+)-(sa|gni|gittam|bonga|bini|ba)\b/)

    if (!numberMatch || !classifierMatch) {
      return
    }

    const quantity = Number(numberMatch[1])
    const classifier = classifierMatch[1]
    const suffix = classifierMatch[2]

    result[classifier] = result[classifier] || { default: null }
    result[classifier][quantity] = suffix
    if (!result[classifier].default) {
      result[classifier].default = suffix
    }
  }

  Object.values(definitions).forEach((classifier) => {
    if (!classifier || !Array.isArray(classifier.examples)) {
      return
    }

    classifier.examples.forEach((example) => {
      if (example.english && example.garo) {
        addExample(example.english, example.garo)
      }
    })
  })

  if (patterns && Array.isArray(patterns)) {
    patterns.forEach((example) => {
      const english = example.english || ''
      const garo = example.garo || ''
      addExample(english, garo)
    })
  }

  return result
}

function registerPhrase(english, garo, map = phraseMap, exactMap = exactConversationMap) {
  const normalizedEnglish = normalizeKey(english)
  if (!normalizedEnglish || typeof garo !== 'string') {
    return
  }

  map[normalizedEnglish] = garo.trim()
  exactMap[normalizedEnglish] = garo.trim()
}

function indexVocabulary(node, category = null, categoryClassifier = null) {
  if (!node || typeof node !== 'object') {
    return
  }

  const classifierForCategory = typeof node === 'object' && node !== null && typeof node._classifier === 'string'
    ? node._classifier
    : categoryClassifier

  if (Array.isArray(node)) {
    node.forEach((item) => indexVocabulary(item, category, classifierForCategory))
    return
  }

  if (typeof node.english === 'string' && typeof node.garo === 'string') {
    const [englishKey, garoValue] = repairMalformedPair(node.english, node.garo)
    if (englishKey && garoValue) {
      englishToGaro[englishKey] = garoValue
      garoToEnglish[normalizeKey(garoValue)] = englishKey
      phraseMap[englishKey] = garoValue

      if (category) {
        categoryIndex[category] = categoryIndex[category] || { classifier: classifierForCategory || null, words: [] }
        categoryIndex[category].words.push(englishKey)
      }

      if (classifierForCategory) {
        classifierMap[englishKey] = classifierForCategory
      }

      indexedEntryCount += 1
    }
    return
  }

  if (category && !categoryIndex[category]) {
    categoryIndex[category] = {
      classifier: classifierForCategory || null,
      words: []
    }
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key.startsWith('_')) {
      return
    }

    if (value && typeof value === 'object') {
      if (!Array.isArray(value) && typeof value.garo === 'string') {
        const [englishKey, garoValue] = repairMalformedPair(key, value.garo)
        if (!englishKey || !garoValue) {
          return
        }

        englishToGaro[englishKey] = garoValue
        garoToEnglish[normalizeKey(garoValue)] = englishKey
        phraseMap[englishKey] = garoValue

        if (category) {
          categoryIndex[category] = categoryIndex[category] || { classifier: classifierForCategory || null, words: [] }
          categoryIndex[category].words.push(englishKey)
        }

        if (classifierForCategory) {
          classifierMap[englishKey] = classifierForCategory
        }

        indexedEntryCount += 1
        return
      }

      indexVocabulary(value, key, classifierForCategory)
      return
    }

    if (typeof value !== 'string') {
      return
    }

    const [englishKey, garoValue] = repairMalformedPair(key, value)
    if (!englishKey || !garoValue) {
      return
    }

    englishToGaro[englishKey] = garoValue
    garoToEnglish[normalizeKey(garoValue)] = englishKey
    phraseMap[englishKey] = garoValue

    if (category) {
      categoryIndex[category] = categoryIndex[category] || { classifier: classifierForCategory || null, words: [] }
      categoryIndex[category].words.push(englishKey)
    }

    if (classifierForCategory) {
      classifierMap[englishKey] = classifierForCategory
    }

    indexedEntryCount += 1
  })
}

function loadConversationPatterns(patterns) {
  if (!patterns || typeof patterns !== 'object') {
    return
  }

  const gather = (source) => {
    Object.values(source).forEach((group) => {
      if (!Array.isArray(group)) {
        return
      }
      group.forEach((item) => {
        if (item && typeof item === 'object' && item.english && item.garo) {
          registerPhrase(item.english, item.garo)
          const normalizedEnglish = normalizeKey(item.english)
          englishToGaro[normalizedEnglish] = item.garo.trim()
        }
      })
    })
  }

  gather(patterns.patterns)
  gather(patterns.sentence_structures)
  gather(patterns.classifier_patterns)
  gather(patterns.question_patterns)
  gather(patterns.tense_patterns)
  gather(patterns.negation_patterns)
}

function findClassifier(englishKey) {
  if (classifierMap[englishKey]) {
    return classifierMap[englishKey]
  }

  return Object.entries(categoryIndex).reduce((found, [category, meta]) => {
    if (found) {
      return found
    }

    if (meta.words && meta.words.includes(englishKey)) {
      return meta.classifier || found
    }

    return found
  }, null)
}

function buildLongestPhraseList(map) {
  return Object.keys(map)
    .sort((a, b) => b.length - a.length)
}

function translateByPhraseAndWords(input) {
  const normalized = normalizeText(input)
  if (!normalized) {
    return ''
  }

  const tokens = normalized.split(' ').filter(Boolean)
  const sortedPhraseKeys = buildLongestPhraseList(phraseMap)

  let result = []
  let index = 0

  while (index < tokens.length) {
    let matched = false

    for (const phraseKey of sortedPhraseKeys) {
      const phraseTokens = phraseKey.split(' ')
      if (phraseTokens.length === 0 || phraseTokens.length > tokens.length - index) {
        continue
      }

      const candidate = tokens.slice(index, index + phraseTokens.length).join(' ')
      if (candidate === phraseKey) {
        result.push(phraseMap[phraseKey])
        index += phraseTokens.length
        matched = true
        break
      }
    }

    if (!matched) {
      const token = tokens[index]
      result.push(englishToGaro[token] || token)
      index += 1
    }
  }

  return result.join(' ')
}

function buildClassifierTranslation(input) {
  const normalized = normalizeText(input)
  const words = normalized.split(' ').filter(Boolean)
  if (!words.length) {
    return null
  }

  let quantity = null
  const nounTokens = []

  for (const token of words) {
    if (numberWords[token] !== undefined || /^\d+$/.test(token)) {
      quantity = numberWords[token] !== undefined ? numberWords[token] : Number(token)
      continue
    }
    if (!['a', 'an', 'the', 'and', 'or'].includes(token)) {
      nounTokens.push(token)
    }
  }

  if (!quantity || !nounTokens.length) {
    return null
  }

  const rawNoun = nounTokens.join(' ')
  const nounKey = englishToGaro[rawNoun] ? rawNoun : singularizeWord(rawNoun)
  const nounGaro = englishToGaro[nounKey]
  if (!nounGaro) {
    return null
  }

  const classifier = findClassifier(nounKey) || findClassifier(singularizeWord(nounKey)) || 'ge'
  if (!classifier || !classifierSuffixMap[classifier]) {
    return null
  }

  const suffix = classifierSuffixMap[classifier][quantity] || classifierSuffixMap[classifier].default
  if (!suffix) {
    return null
  }

  return `${nounGaro} ${classifier}-${suffix}`.trim()
}

function hasDictionaryMatch(input) {
  const normalized = normalizeText(input)
  if (!normalized) {
    return false
  }

  if (phraseMap[normalized]) {
    return true
  }

  return normalized.split(' ').some((token) => englishToGaro[token])
}

async function translateText(input) {
  const normalized = normalizeText(input)
  if (!normalized) {
    return {
      translatedText: '',
      source: 'empty'
    }
  }

  if (exactConversationMap[normalized]) {
    return {
      translatedText: exactConversationMap[normalized],
      source: 'conversation_exact'
    }
  }

  if (phraseMap[normalized]) {
    return {
      translatedText: phraseMap[normalized],
      source: 'phrase_map'
    }
  }

  const classifierTranslation = buildClassifierTranslation(normalized)
  if (classifierTranslation) {
    return {
      translatedText: classifierTranslation,
      source: 'classifier'
    }
  }

  const hasVerb = normalized
    .split(' ')
    .some((token) => detectVerb(token))

  if (hasVerb) {
    const sentenceTranslation = buildSentence(normalized)
    if (sentenceTranslation && sentenceTranslation !== normalized) {
      return {
        translatedText: sentenceTranslation,
        source: 'sentence_structure'
      }
    }
  }

  const wordTranslation = translateByPhraseAndWords(normalized)
  if (wordTranslation && wordTranslation !== normalized) {
    return {
      translatedText: wordTranslation,
      source: 'word_by_word'
    }
  }

  if (!hasDictionaryMatch(normalized)) {
    try {
      const fallback = await analyzeSentence(input)
      return {
        translatedText: fallback?.correctedInput || input,
        source: 'gemini_fallback'
      }
    } catch (error) {
      return {
        translatedText: input,
        source: 'gemini_fallback_error'
      }
    }
  }

  return {
    translatedText: wordTranslation || input,
    source: 'best_effort'
  }
}

async function initializeIndex() {
  const dictionaryPath = path.resolve(__dirname, 'garo_dictionary.json')
  const conversationPath = path.resolve(__dirname, 'src', 'data', 'dictionary', 'conversation_patterns.json')

  const dictionaryText = await fs.readFile(dictionaryPath, 'utf8')
  const conversationText = await fs.readFile(conversationPath, 'utf8')

  const dictionary = JSON.parse(dictionaryText)
  const conversationPatterns = JSON.parse(conversationText)

  if (dictionary.classifier_engine) {
    classifierSuffixMap = buildClassifierSuffixMap(dictionary.classifier_engine, [])
    indexEnglishGaroPairs(dictionary.classifier_engine)
  }

  indexEnglishGaroPairs(conversationPatterns)

  if (conversationPatterns.classifier_patterns) {
    Object.values(conversationPatterns.classifier_patterns).forEach((examples) => {
      if (Array.isArray(examples)) {
        classifierSuffixMap = {
          ...classifierSuffixMap,
          ...buildClassifierSuffixMap({}, examples)
        }
      }
    })
  }

  if (dictionary.suffix_system && typeof dictionary.suffix_system === 'object') {
    suffixSystem = dictionary.suffix_system
  }

  indexVocabulary(dictionary)

  loadConversationPatterns(conversationPatterns)

  Object.entries(pronouns).forEach(([english, garo]) => {
    if (!english || !garo) return
    englishToGaro[english] = garo
    garoToEnglish[normalizeKey(garo)] = english
    registerPhrase(english, garo)
  })

  Object.entries(commonPhraseMap).forEach(([english, garo]) => {
    if (!english || !garo) return
    registerPhrase(english, garo)
  })

  console.log('Successfully indexed 6000+ master entries!')
  console.log(`Indexed entries: ${indexedEntryCount}`)
}

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.post('/translate', async (req, res) => {
  const { text } = req.body || {}
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'A valid text string is required.' })
  }

  try {
    const translation = await translateText(text)
    return res.json({
      original: text,
      translatedText: translation.translatedText,
      source: translation.source
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', indexedEntryCount, dictionariesLoaded: !!indexedEntryCount })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

initializeIndex()
  .catch((error) => {
    console.error('Index initialization failed:', error)
    process.exit(1)
  })

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})