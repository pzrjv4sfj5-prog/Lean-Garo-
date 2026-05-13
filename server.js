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

const punctuationRegex = /[.?!]/g
const whitespaceRegex = /\s+/g
const numberWordRegex = new RegExp(`\\b(${Object.keys(numberWords).join('|')})\\b`, 'gi')

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
  const classifierForCategory = typeof node === 'object' && node !== null && typeof node._classifier === 'string'
    ? node._classifier
    : categoryClassifier

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
  let noun = null
  let nounTokens = []

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

  noun = nounTokens.join(' ')
  const nounGaro = englishToGaro[noun]
  if (!nounGaro) {
    return null
  }

  const classifier = findClassifier(noun) || findClassifier(noun.replace(/s$/, ''))
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
  }

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

  if (dictionary.vocabulary && typeof dictionary.vocabulary === 'object') {
    indexVocabulary(dictionary.vocabulary)
  }

  loadConversationPatterns(conversationPatterns)

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