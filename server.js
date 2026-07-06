import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3001

let englishToGaro = {}
let garoToEnglish = {}
let phraseMap = {}
let exactConversationMap = {}
let indexedEntryCount = 0

const numberWords = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20
}

const punctuationRegex = /[.,!?‘’'"“”:;()/-]/g
const whitespaceRegex = /\s+/g
const numberWordRegex = new RegExp(`\\b(${Object.keys(numberWords).join('|')})\\b`, 'gi')

const pronouns = {
  i: 'Anga', me: 'Angko', you: 'Na·a', he: 'Ua', she: 'Ua',
  we: 'An·ching', they: 'Bisong', my: 'Angni', your: 'Nangni', our: 'An·chingni',
}

const helperWords = new Set([
  'am', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
  'the', 'a', 'an', 'to', 'be', 'will', 'shall', 'do', 'does', 'did',
  'going', 'about', 'let', 'lets', 'dont', 'not', 'please', 'can', 'could'
])

const verbs = {
  eat: 'cha·', drink: 'ring', go: 're·ang', come: 're·ba', sleep: 'tusi',
  sit: 'asong', run: 'kat', walk: 'song', read: 'porai', write: 'se·',
  work: 'dak', speak: 'agan', play: 'kal', wash: 'rong', see: 'ni',
  help: 'dakchak', buy: 'bre', sell: 'pal', cook: 'soa', learn: 'skie', teach: 'skia',
}

const commonPhraseMap = {
  hello: 'Salam', hi: 'Salam', 'good morning': 'Pringnam', 'good evening': 'Attamnam',
  'good night': 'Walnam', 'thank you': 'Mitela.', thanks: 'Mitela.', 'how are you': 'Na·a namengama?',
  'i love you': 'Anga nang·na ka·sa', 'i don\'t know': 'Anga uija.', "let's go": 'Hai re·naha',
  "let's eat": 'Hai cha·ha', "let's sleep": 'Hai tusina', "let's drink": 'Hai ringaha',
  "let's sit": 'Hai asongha', "let's play": 'Hai kalha', "let's work": 'Hai dakha',
  "let's run": 'Hai katha', 'eat rice': 'Mi cha·bo', 'drink water': 'Chi ringbo',
  'drink tea': 'Cha ringbo', 'i am eating rice': 'Anga mi cha·enga',
  'i am drinking water': 'Anga chi ringenga', 'i am eating': 'Anga cha·enga',
  'i am drinking': 'Anga ringenga', 'i am sleeping': 'Anga tusienga',
  'i am sitting': 'Anga asongenga', 'i am running': 'Anga katenga',
  'i am going': 'Anga re·angenga', 'i am coming': 'Anga re·baenga',
  'you are eating': 'Na·a cha·enga', 'you are eating rice': 'Na·a mi cha·enga',
}

function normalizeText(value) {
  if (typeof value !== 'string') return ''
  const lowered = value.toLowerCase().trim()
  const stripped = lowered.replace(punctuationRegex, '')
  const normalizedNumbers = stripped.replace(numberWordRegex, (match) => String(numberWords[match.toLowerCase()] || match))
  return normalizedNumbers.replace(whitespaceRegex, ' ').trim()
}

function normalizeKey(value) { return normalizeText(value) }

function isGaroLinguisticMatch(str) {
  if (/[·]/.test(str)) return true;
  if (/\b(gittam|mang|sak|gong|king|ge|na\b|bo\b|engma|gni|sa|ko\b|ni\b|ha\b|ma\b)\b/i.test(str)) return true;
  return false;
}

function registerValidatedPair(englishCandidate, garoCandidate) {
  let finalEng = englishCandidate.trim();
  let finalGaro = garoCandidate.trim();

  // Enforce rigid linguistic direction to keep Dictionary columns correct
  if (isGaroLinguisticMatch(finalEng) && !isGaroLinguisticMatch(finalGaro)) {
    let temp = finalEng;
    finalEng = finalGaro;
    finalGaro = temp;
  }

  const normalizedEngKey = normalizeKey(finalEng);
  const normalizedGaroKey = normalizeKey(finalGaro);

  if (normalizedEngKey && finalGaro) {
    if (!englishToGaro[normalizedEngKey]) {
      englishToGaro[normalizedEngKey] = finalGaro;
      garoToEnglish[normalizedGaroKey] = normalizedEngKey;
      indexedEntryCount += 1;

      if (normalizedEngKey.includes(' ')) {
        phraseMap[normalizedEngKey] = finalGaro;
      }
    }
  }
}

function buildSentence(normalized) {
  const words = normalized.split(' ').filter(Boolean)
  if (!words.length) return ''
  let subject = '', verb = ''
  const objects = []

  for (const token of words) {
    if (helperWords.has(token)) continue
    if (!subject && pronouns[token]) { subject = pronouns[token]; continue }
    if (verbs[token]) { verb = verbs[token] + 'enga'; continue }
    if (englishToGaro[token]) { objects.push(englishToGaro[token]); continue }
    objects.push(token)
  }
  return [subject, ...objects, verb].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function ultimateDataCrawler(obj) {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    obj.forEach(item => ultimateDataCrawler(item));
    return;
  }

  // Structural parsing route for items containing standardized attributes
  if (typeof obj.english === 'string' && typeof obj.garo === 'string') {
    registerValidatedPair(obj.english, obj.garo);
  }

  // Deep scanning route across raw key-value blocks
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key.startsWith('_') || key === 'sources') continue;
      const value = obj[key];

      if (typeof value === 'string' && isNaN(key) && !isGaroLinguisticMatch(key)) {
        registerValidatedPair(key, value);
      } else if (typeof value === 'object' && value !== null) {
        ultimateDataCrawler(value);
      }
    }
  }
}

async function initializePlatform() {
  try {
    const dataPath = path.join(__dirname, 'garo_dictionary.json')
    const rawData = await fs.readFile(dataPath, 'utf8')
    const db = JSON.parse(rawData)

    // Run the unconstrained deep crawler through the entire data layout object
    ultimateDataCrawler(db);

    const convSource = db.vocabulary?.conversations || db.conversations || db.conversation_patterns;
    if (convSource && typeof convSource === 'object') {
      Object.keys(convSource).forEach(k => {
        const val = convSource[k];
        if (typeof val === 'string') exactConversationMap[normalizeKey(k)] = val.trim();
      });
    }

    console.log("📚 Garo Language Platform ready!")
    console.log(`Successfully indexed ${indexedEntryCount} master entries!`)
  } catch (err) {
    console.error("Initialization anomaly:", err.message)
  }
}

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/api/dictionary', (req, res) => {
  res.json({ englishToGaro, garoToEnglish, total: indexedEntryCount });
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: "Missing source text parameters" })
    const clean = normalizeText(text)

    if (exactConversationMap[clean]) return res.json({ translation: exactConversationMap[clean], method: "exact_conversation" })
    if (commonPhraseMap[clean]) return res.json({ translation: commonPhraseMap[clean], method: "common_phrase" })
    if (phraseMap[clean]) return res.json({ translation: phraseMap[clean], method: "phrase_map" })

    const structuralOutput = buildSentence(clean)
    if (structuralOutput && structuralOutput !== clean) return res.json({ translation: structuralOutput, method: "structural_lookup" })

    // Gemini fallback removed — analyzeSentence() returns corrected English,
    // not Garo, so always-truthy check was returning raw English as translation.
    // Consistent with translationEngine.js step-10 removal.
    res.json({ translation: text, method: "identity_fallback" })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'dist', 'index.html')) })

app.listen(port, () => { initializePlatform() })
