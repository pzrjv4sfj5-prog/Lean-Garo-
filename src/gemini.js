import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  ''

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function analyzeSentence(text) {
  if (!text || !text.trim()) {
    return { quantity: null, noun: null, tense: 'unknown', counting: false, correctedInput: text || '' }
  }
  try {
    const prompt = `Analyze this English sentence for Garo language translation.
Return ONLY valid JSON: {"quantity":number|null,"noun":string|null,"tense":"present"|"past"|"future"|"unknown","counting":boolean,"correctedInput":string}
Sentence: "${text}"`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const cleaned = response.text().trim().replace(/^```json\s*/,'').replace(/\s*```$/,'')
    try {
      const parsed = JSON.parse(cleaned)
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          quantity: typeof parsed.quantity === 'number' ? parsed.quantity : null,
          noun: typeof parsed.noun === 'string' ? parsed.noun : null,
          tense: typeof parsed.tense === 'string' ? parsed.tense : 'unknown',
          counting: typeof parsed.counting === 'boolean' ? parsed.counting : false,
          correctedInput: typeof parsed.correctedInput === 'string' ? parsed.correctedInput : text
        }
      }
    } catch(e) { console.error('Gemini parse error:', e) }
    return { quantity: null, noun: null, tense: 'unknown', counting: false, correctedInput: text }
  } catch(error) {
    console.error('Gemini analysis failed:', error.message)
    return { quantity: null, noun: null, tense: 'unknown', counting: false, correctedInput: text }
  }
}

export async function explainGrammar(text) {
  try {
    const result = await model.generateContent(`Explain this Garo sentence grammar briefly: "${text}"`)
    return (await result.response).text().trim()
  } catch(error) {
    console.error('Grammar explanation failed:', error.message)
    return 'Unable to analyze grammar.'
  }
}

export default { analyzeSentence, explainGrammar }
