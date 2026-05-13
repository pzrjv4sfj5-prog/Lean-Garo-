import compiledDict from './compiled_dict.json' with { type: 'json' };

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText?key=${encodeURIComponent(API_KEY)}`;

function sanitizeInput(text) {
  return String(text || '').toLowerCase().trim();
}

export async function translateText(inputText) {
  const cleanInput = sanitizeInput(inputText);
  if (!cleanInput) return '';

  const localTranslation = compiledDict[cleanInput];
  if (localTranslation) {
    return localTranslation;
  }

  if (!API_KEY) {
    return `Translation not found: ${inputText}`;
  }

  const prompt = `Translate to Garo (A·chikku) using SOV order. Return only the clean Garo output string.`;
  const requestBody = {
    prompt: {
      text: `${prompt}\n\nEnglish: ${inputText}`
    },
    maxOutputTokens: 128
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed ${response.status}`);
    }

    const payload = await response.json();
    const outputText = payload?.candidates?.[0]?.output || payload?.output?.[0]?.content || '';
    return String(outputText).trim();
  } catch (error) {
    console.warn('Gemini failover error:', error?.message || error);
    return `Translation not found: ${inputText}`;
  }
}