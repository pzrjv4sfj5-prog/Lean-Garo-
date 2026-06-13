import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    ? import.meta.env.VITE_GEMINI_API_KEY
    : process.env.VITE_GEMINI_API_KEY || ''

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * Analyze English sentence using Gemini AI
 * Returns structured JSON for translation pipeline
 */
export async function analyzeSentence(text) {
  if (!text || !text.trim()) {
    return {
      quantity: null,
      noun: null,
      tense: 'unknown',
      counting: false,
      correctedInput: text || ''
    }
  }

  try {
    const prompt = `
Analyze this English sentence for Garo language translation.
Return ONLY valid JSON with this exact structure:
{
  "quantity": number or null,
  "noun": string or null,
  "tense": "present" | "past" | "future" | "present_continuous" | "unknown",
  "counting": boolean,
  "correctedInput": string
}

Rules:
- quantity: extract number if counting nouns (e.g., 2, 3, five -> 5)
- noun: main noun being counted or described
- tense: detect verb tense
- counting: true if sentence involves counting nouns
- correctedInput: spell-corrected version of input

Examples:
"two dogs" -> {"quantity": 2, "noun": "dog", "tense": "unknown", "counting": true, "correctedInput": "two dogs"}
"I am eating" -> {"quantity": null, "noun": null, "tense": "present_continuous", "counting": false, "correctedInput": "I am eating"}
"five books" -> {"quantity": 5, "noun": "book", "tense": "unknown", "counting": true, "correctedInput": "five books"}

Sentence: "${text}"
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()

    // Clean the response to ensure it's valid JSON
    const cleaned = textResponse.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '')

    try {
      const parsed = JSON.parse(cleaned)

      // Validate structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          quantity: typeof parsed.quantity === 'number' ? parsed.quantity : null,
          noun: typeof parsed.noun === 'string' ? parsed.noun : null,
          tense: typeof parsed.tense === 'string' ? parsed.tense : 'unknown',
          counting: typeof parsed.counting === 'boolean' ? parsed.counting : false,
          correctedInput: typeof parsed.correctedInput === 'string' ? parsed.correctedInput : text
        }
      }
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError, 'Response:', textResponse)
    }

    // Fallback
    return {
      quantity: null,
      noun: null,
      tense: 'unknown',
      counting: false,
      correctedInput: text
    }

  } catch (error) {
    console.error('Gemini analysis failed:', error)
    return {
      quantity: null,
      noun: null,
      tense: 'unknown',
      counting: false,
      correctedInput: text
    }
  }
}

/**
 * Get grammar explanation from Gemini
 */
export async function explainGrammar(text) {
  try {
    const prompt = `
Explain the grammar of this Garo sentence in simple English.
Be concise and focus on tense, structure, and classifiers if present.

Sentence: "${text}"
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()

  } catch (error) {
    console.error('Grammar explanation failed:', error)
    return 'Unable to analyze grammar.'
  }
}

export default {
  analyzeSentence,
  explainGrammar
}