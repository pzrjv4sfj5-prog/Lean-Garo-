import React from 'react'

/**
 * ErrorBoundary — catches render errors in child components
 * Prevents full-app crash when a single page/component fails
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Lean-Garo ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64 py-16 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            This section could not be loaded. The rest of the platform is still available.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 text-left text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-lg overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
