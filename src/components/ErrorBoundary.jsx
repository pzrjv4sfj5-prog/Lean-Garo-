import React from 'react'

/**
 * ErrorBoundary — catches render errors in child components
 * Prevents full-app crash when a single page/component fails
 * Phase 7: expanded with reload button, user-friendly UI, error logging hook
 */

// Error logging hook — replace with Sentry or similar in production
function logError(error, info) {
  console.error('[Lean-Garo Error]', {
    message: error.message,
    stack: error.stack,
    componentStack: info?.componentStack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
  // Future: send to logging service
  // fetch('/api/log-error', { method: 'POST', body: JSON.stringify({...}) })
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
    this.handleReload = this.handleReload.bind(this)
    this.handleRetry = this.handleRetry.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ errorInfo: info })
    logError(error, info)
  }

  handleReload() {
    window.location.reload()
  }

  handleRetry() {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const { label = 'This section' } = this.props

      return (
        <div className="flex flex-col items-center justify-center min-h-64 py-16 px-4 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {label} could not be loaded
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-md">
            Something went wrong while loading this page.
            The rest of the platform is still available.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 max-w-md">
            Try again below, or reload the page if the problem continues.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={this.handleReload}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Reload page
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-8 text-left max-w-lg w-full">
              <summary className="text-xs text-gray-400 cursor-pointer mb-2">
                Developer details
              </summary>
              <pre className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
