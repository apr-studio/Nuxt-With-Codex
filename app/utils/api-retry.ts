export type RetryOptions = {
  count?: number
  delayMs?: number
  backoff?: 'fixed' | 'exponential'
  maxDelayMs?: number
  retryOnCodes?: string[]
}

// Compute retry delay based on backoff strategy.
export function getRetryDelay(attempt: number, options: RetryOptions) {
  const baseDelay = options.delayMs ?? 400
  if (options.backoff === 'exponential') {
    const maxDelay = options.maxDelayMs ?? 4000
    return Math.min(maxDelay, baseDelay * 2 ** attempt)
  }
  return baseDelay
}

// Check whether a given API error code should be retried.
export function shouldRetry(errorCode: string | undefined, options: RetryOptions) {
  if (!errorCode) {
    return true
  }
  if (!options.retryOnCodes || options.retryOnCodes.length === 0) {
    return true
  }
  return options.retryOnCodes.includes(errorCode)
}
