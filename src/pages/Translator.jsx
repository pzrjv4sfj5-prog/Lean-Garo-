import React, { useState, useRef, useEffect } from 'react'
import translationEngine from '../translationEngine'

export default function Translator() {
  const [inputText, setInputText] = useState('')
  const [inputLang, setInputLang] = useState('en')
  const [outputLang, setOutputLang] = useState('garo')
  const [result, setResult] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [grammar, setGrammar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Manual translation function
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    // Prevent same language translation
    if (inputLang === outputLang) {
      setError('Please select different source and target languages')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Perform translation
      const translationResult = await translationEngine.translateSentence(
        inputText,
        inputLang,
        outputLang
      )

      if (!translationResult) {
        throw new Error('Translation returned null')
      }

      if (translationResult.error) {
        setError(translationResult.error)
        setResult(null)
      } else {
        setResult(translationResult)
        setBreakdown(translationResult.breakdown || [])
        setError(null)
      }

      // Analyze grammar
      const grammarAnalysis = await translationEngine.analyzeGrammar(inputText, inputLang)
      setGrammar(grammarAnalysis)
    } catch (err) {
      console.error('Translation error:', err)
      setError(`Translation failed: ${err.message}`)
      setResult(null)
      setBreakdown([])
    } finally {
      setLoading(false)
      // Move focus to the output region so screen reader users land on the
      // result (or error) immediately without hunting for it.
      outputRef.current?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    handleTranslate()
  }

  // Ctrl/Cmd+Enter submits without leaving the textarea (plain Enter still
  // inserts a newline, since multi-sentence input is a reasonable use case).
  // Escape clears the input for a fast retry.
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    } else if (e.key === 'Escape') {
      setInputText('')
      setError(null)
    }
  }

  const examples = [
    { en: 'hello', garo: 'Salam / Namengama' },
    { en: 'thank you', garo: 'Mittela' },
    { en: 'good morning', garo: 'Pringnam' },
    { en: 'i love you', garo: 'Ang·a nangna kasa·a' },
    { en: 'i want to eat', garo: 'Anga cha·na sikenga' },
    { en: "let's go to market", garo: 'Hai Bajal Anti Re·na' },
    { en: '2 dogs', garo: 'mang-gni achak' },
    { en: 'she went to buy rice', garo: 'Ua mi-ko brea-na re·anga' },
  ]

  const handleExample = (example) => {
    if (inputLang === 'en') {
      setInputText(example.en)
      textareaRef.current?.focus()
    }
  }

  const swapLanguages = () => {
    if (inputLang !== outputLang) {
      setInputLang(outputLang)
      setOutputLang(inputLang)
      setError(null)
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">🔄 Semantic Translator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time translation engine with grammar analysis and morphology detection
        </p>
      </div>

      {/* Main Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-bold mb-3">
              Input Language
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="en">English 🇬🇧</option>
                <option value="garo">Garo 🌍</option>
                <option value="hi">Hindi 🇮🇳</option>
              </select>
            </label>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type something to translate..."
              disabled={loading}
              aria-label="Text to translate"
              className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
            />

            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Ctrl+Enter to translate · Esc to clear
            </div>

            <div className="mt-3 flex flex-wrap gap-2 justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {inputText.length} characters
              </span>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Translating...
                    </div>
                  ) : (
                    'Translate'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  disabled={loading}
                  className="text-sm px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Output Section */}
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <label className="block text-sm font-bold mb-3">
            Output Language
            <select
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="garo">Garo 🌍</option>
              <option value="en">English 🇬🇧</option>
              <option value="hi">Hindi 🇮🇳</option>
            </select>
          </label>

          <div
            ref={outputRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white overflow-y-auto font-mono select-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {error ? (
              <div role="alert" className="text-red-600 dark:text-red-400 font-semibold">
                ⚠️ {error}
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-gray-500 dark:text-gray-400">Translating...</span>
                </div>
              </div>
            ) : result ? (
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {result.translated}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.original}
                </div>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">Translation will appear here...</span>
            )}
          </div>

          <button
            onClick={swapLanguages}
            disabled={loading}
            className="mt-3 w-full px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⇅ Swap Languages
          </button>
        </div>
      </div>

      {/* Word Breakdown */}
      {breakdown.length > 0 && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">📊 Sentence Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {breakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
              >
                <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                  {item.category}
                </div>
                <div className="font-bold text-gray-900 dark:text-white mt-1">
                  {item.english}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  → {item.garo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Analysis */}
      {grammar && grammar.subject && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-4">📝 Grammar Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tense</div>
              <div className="font-semibold text-gray-900 dark:text-white">{grammar.detectedTense}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Negative</div>
              <div className="font-semibold text-gray-900 dark:text-white">{grammar.isNegative ? 'Yes' : 'No'}</div>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Word Order</div>
              <div className="font-semibold text-gray-900 dark:text-white">{grammar.garoWordOrder}</div>
            </div>
          </div>
          {grammar.notes && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{grammar.notes}</div>
          )}
        </div>
      )}

      {/* Examples */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">💡 Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExample(example)}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all cursor-pointer text-left"
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {example.en}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {example.garo}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
