import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 py-24 text-center px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        This page does not exist. Try one of the links below.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
          🔄 Translator
        </Link>
        <Link to="/dictionary" className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          📚 Dictionary
        </Link>
        <Link to="/phrases" className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          💬 Phrases
        </Link>
        <Link to="/grammar" className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          📖 Grammar
        </Link>
      </div>
    </div>
  )
}
