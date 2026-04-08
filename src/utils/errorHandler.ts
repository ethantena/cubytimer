export interface AppError {
  message: string
  code?: string
  timestamp: number
  context?: string
  stack?: string
}

export class ErrorHandler {
  private static errors: AppError[] = []
  private static maxErrors = 100

  static log(error: AppError | Error | string, context?: string): void {
    const appError: AppError = {
      message: typeof error === 'string' ? error : error.message,
      timestamp: Date.now(),
      context,
      stack: error instanceof Error ? error.stack : undefined
    }

    if (error instanceof Error && 'code' in error) {
      appError.code = (error as any).code
    }

    this.errors.push(appError)
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'APP'}] ${appError.message}`, appError)
    }
  }

  static getErrors(): AppError[] {
    return [...this.errors]
  }

  static clearErrors(): void {
    this.errors = []
  }

  static getRecentErrors(count: number = 10): AppError[] {
    return this.errors.slice(-count)
  }

  static getErrorsByContext(context: string): AppError[] {
    return this.errors.filter(error => error.context === context)
  }
}

// React hook for error handling
export function useErrorHandler() {
  const logError = (error: AppError | Error | string, context?: string) => {
    ErrorHandler.log(error, context)
  }

  const getErrors = () => ErrorHandler.getErrors()
  const clearErrors = () => ErrorHandler.clearErrors()
  const getRecentErrors = (count?: number) => ErrorHandler.getRecentErrors(count)

  return {
    logError,
    getErrors,
    clearErrors,
    getRecentErrors
  }
}

