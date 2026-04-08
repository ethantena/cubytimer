'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useErrorHandler } from '@/utils/errorHandler'

interface Props {
  children: ReactNode
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to our error handler
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo)
      }

      return (
        <div className="min-h-screen bg-background text-foreground p-8 ascii-dots">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 ascii-interface">
              <div className="ascii-header">ERROR</div>
              <div className="mt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-error/20 rounded-full">
                    <AlertTriangle className="text-error" size={32} />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold mb-4 ascii-text">Something went wrong</h1>
                
                <p className="text-muted-foreground mb-6 ascii-muted">
                  An unexpected error occurred while rendering this component.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-secondary rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-medium mb-2 ascii-text">Error Details:</h3>
                    <pre className="text-sm text-error overflow-auto ascii-text">
                      {this.state.error.message}
                    </pre>
                    {this.state.error.stack && (
                      <pre className="text-xs text-muted-foreground mt-2 overflow-auto ascii-muted">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                )}

                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-colors mx-auto ascii-btn"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for functional components
export function useErrorBoundary() {
  const { logError } = useErrorHandler()

  const captureError = (error: Error | string, context?: string) => {
    logError(error, context)
  }

  return {
    captureError
  }
}
