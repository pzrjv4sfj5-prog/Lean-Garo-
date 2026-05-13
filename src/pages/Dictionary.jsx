import React, { useState, useMemo } from 'react'
import translationEngine from '../translationEngine'

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLanguage, setSearchLanguage] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('category')

  const categories = useMemo(() => translationEngine.getAllCategories(), [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !selectedCategory) {
      return []
    }

    let results = []

    if (searchQuery.trim()) {
      results = translationEngine.searchVocabulary(searchQuery, searchLanguage)
    } else if (selectedCategory) {
      results = translationEngine.getCategoryVocabulary(selectedCategory)
    }

    // Sort results
    if (sortBy === 'english') {
      results.sort((a, b) => a.english.localeCompare(b.english))
    } else if (sortBy === 'garo') {
      results.sort((a, b) => a.garo.localeCompare(b.garo))
    } else {
      results.sort((a, b) => a.category.localeCompare(b.category))
    }

    return results
  }, [searchQuery, searchLanguage, selectedCategory, sortBy])

  const categoryEmojis = {
    'pronouns': '👤',
    'possessive_pronouns': '🤝',
    'common_phrases': '💬',
    'question_words': '❓',
    'animals': '🦁',
    'birds': '🦅',
    'insects_and_aquatic': '🐠',
    'emotions_and_feelings': '😊',
    'family_members': '👨‍👩‍👧‍👦',
    'body_parts': '🏥',
    'colors': '🎨',
    'numbers': '🔢',
    'verbs_present': '🚶',
    'verbs_past': '✅',
    'verbs_future': '⏳',
    'adjectives_descriptors': '📝',
    'tastes_and_sensations': '👅',
    'nature_and_weather': '🌦️',
    'household_items': '🏠',
    'clothing_and_wearables': '👕',
    'places': '📍',
    'directions_and_positions': '🧭',
    'occupations': '💼',
    'education': '📚',
    'health_and_medical': '🏥',
    'kitchen_and_cooking': '🍳',
    'travel_and_transport': '🚗',
    'social_people': '👥',
    'materials_and_textures': '🪨',
    'religious_and_spiritual': '🙏',
    'government_and_law': '⚖️',
    'abstract_concepts': '💭',
    'quantity_and_degree': '📊',
    'conjunctions_and_connectors': '🔗',
    'at_the_market': '🛒',
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">📚 Dictionary</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive vocabulary with semantic categories and instant search
        </p>
      </div>

      {/* Search Section */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">🔍 Search Vocabulary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Search Query</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter word to search..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Search In</label>
            <select
              value={searchLanguage}
              onChange={(e) => setSearchLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Languages</option>
              <option value="english">English Only</option>
              <option value="garo">Garo Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryEmojis[cat] || '📋'} {cat.replace(/[._]/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="category">Category</option>
              <option value="english">English A-Z</option>
              <option value="garo">Garo A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {searchResults.length > 0 ? (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">
            📋 Results ({searchResults.length} found)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-bold text-sm">English</th>
                  <th className="text-left py-3 px-4 font-bold text-sm">Garo</th>
                  <th className="text-left py-3 px-4 font-bold text-sm">Category</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-gray-900 dark:text-white">
                        {item.english}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.garo}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                        {categoryEmojis[item.category] || '📋'} {item.category.replace(/[._]/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card dark:bg-gray-800 dark:border-gray-700 text-center py-12">
          {searchQuery || selectedCategory ? (
            <>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                No results found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Try a different search term or category
              </p>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                📚 Browse the Dictionary
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Search for words or select a category to get started
              </p>
            </>
          )}
        </div>
      )}

      {/* Category Overview */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">📂 Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const vocab = translationEngine.getCategoryVocabulary(cat)
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === cat
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <div className="text-2xl mb-2">{categoryEmojis[cat] || '📋'}</div>
                <div className="font-bold text-gray-900 dark:text-white capitalize">
                  {cat.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {vocab.length} words
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
