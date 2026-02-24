import { computed, ref, toValue } from 'vue'
import { extractApiError } from '~/utils/api-error'
import type { ApiResponse } from '#shared/api-response'

// Generic mutation helper with retry + toast support.
type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type MaybeRefGetter<T> = T | Ref<T> | (() => T)
type MutationBody = Record<string, unknown> | BodyInit | null
type RetryOptions = {
  count?: number
  delayMs?: number
  backoff?: 'fixed' | 'exponential'
  maxDelayMs?: number
  retryOnCodes?: string[]
}

type MutationDefaults = {
  url?: MaybeRefGetter<string>
  method?: Method
  baseURL?: string
  retryOptions?: RetryOptions
  toastOptions?: {
    success?: string | false
    error?: string | false
  }
}

type MutationInput<TBody extends MutationBody> = {
  url?: string
  method?: Method
  body?: TBody
}

// Executes mutations via $fetch with unified error handling.
export function useApiMutation<TPayload, TBody extends MutationBody = Record<string, unknown>>(defaults: MutationDefaults = {}) {
  const pending = ref(false)
  const apiError = ref<{ code: string, message: string } | null>(null)
  const toast = useToast()

  // Compute retry delay based on backoff strategy.
  function getRetryDelay(attempt: number, options: RetryOptions) {
    const baseDelay = options.delayMs ?? 400
    if (options.backoff === 'exponential') {
      const maxDelay = options.maxDelayMs ?? 4000
      return Math.min(maxDelay, baseDelay * 2 ** attempt)
    }
    return baseDelay
  }

  // Check whether a given API error code should be retried.
  function shouldRetry(errorCode: string | undefined, options: RetryOptions) {
    if (!errorCode) {
      return true
    }
    if (!options.retryOnCodes || options.retryOnCodes.length === 0) {
      return true
    }
    return options.retryOnCodes.includes(errorCode)
  }

  // Execute the request with optional retry on recoverable errors.
  async function mutate(input: MutationInput<TBody> = {}) {
    const resolvedUrl = input.url || (defaults.url ? toValue(defaults.url) : '')
    if (!resolvedUrl) {
      apiError.value = {
        code: 'INVALID_URL',
        message: 'Mutation URL is required.'
      }
      return undefined
    }

    const method = input.method || defaults.method || 'POST'
    pending.value = true
    apiError.value = null

    const retryOptions = defaults.retryOptions
    const maxRetries = retryOptions?.count ?? 0

    try {
      // Attempt retries in a single loop.
      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const response = await $fetch<ApiResponse<TPayload>>(resolvedUrl, {
            baseURL: defaults.baseURL || useRuntimeConfig().app.baseURL,
            method,
            body: input.body
          })

          if (!response.success) {
            apiError.value = response.error
            if (retryOptions && attempt < maxRetries && shouldRetry(apiError.value?.code, retryOptions)) {
              const delay = getRetryDelay(attempt, retryOptions)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            if (defaults.toastOptions?.error !== false && import.meta.client) {
              toast.add({
                title: defaults.toastOptions?.error || 'Request failed',
                description: apiError.value.message,
                color: 'error'
              })
            }
            return undefined
          }

          if (defaults.toastOptions?.success && import.meta.client) {
            toast.add({
              title: defaults.toastOptions.success,
              color: 'success'
            })
          }
          return response.data
        } catch (error) {
          apiError.value = extractApiError(error)
            || { code: 'REQUEST_FAILED', message: 'Request failed.' }
          if (retryOptions && attempt < maxRetries && shouldRetry(apiError.value?.code, retryOptions)) {
            const delay = getRetryDelay(attempt, retryOptions)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
          if (defaults.toastOptions?.error !== false && import.meta.client) {
            toast.add({
              title: defaults.toastOptions?.error || 'Request failed',
              description: apiError.value.message,
              color: 'error'
            })
          }
          return undefined
        }
      }
    } finally {
      pending.value = false
    }
  }

  function clearError() {
    apiError.value = null
  }

  const errorMessage = computed(() => apiError.value?.message || '')

  return {
    mutate,
    pending,
    apiError,
    errorMessage,
    clearError
  }
}
