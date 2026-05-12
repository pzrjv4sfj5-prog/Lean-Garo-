import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Translator from './pages/Translator'
import Dictionary from './pages/Dictionary'
import Phrases from './pages/Phrases'
import VerbsGrammar from './pages/VerbsGrammar'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Translator', icon: '🔄' },
    { path: '/dictionary', label: 'Dictionary', icon: '📚' },
    { path: '/phrases', label: 'Phrases', icon: '💬' },
    { path: '/grammar', label: 'Grammar & Verbs', icon: '📖' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Navigation */}
        <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="text-2xl">🌍</span>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none">Garo</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">A&apos;chik Language</span>
                </div>
              </Link>

              {/* Nav Items */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600'
                        : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex flex-wrap gap-2 pb-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive(item.path)
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Translator />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/phrases" element={<Phrases />} />
            <Route path="/grammar" element={<VerbsGrammar />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className={`mt-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-2">About</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  A semantic translation platform for A&apos;chik Garo language, designed to preserve and promote the indigenous language of Meghalaya.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Features</h3>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Real-time translation</li>
                  <li>Grammar analysis</li>
                  <li>Morphology parsing</li>
                  <li>Classifier detection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Language</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  English ↔ Garo ↔ Hindi
                </p>
              </div>
            </div>
            <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                © 2024 A&apos;chik Garo Platform. Preserving indigenous languages.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}
