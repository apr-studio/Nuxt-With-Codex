import { computed, ref, toValue } from 'vue'
import { extractApiError } from '~/utils/api-error'
import { getRetryDelay, shouldRetry, type RetryOptions } from '~/utils/api-retry'
import { emitErrorToast, emitSuccessToast } from '~/utils/api-toast'
import type { ApiResponse } from '#shared/api-response'

// Generic mutation helper with retry + toast support.
type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type MaybeRefGetter<T> = T | Ref<T> | (() => T)
type MutationBody = Record<string, unknown> | BodyInit | null

type MutationDefaults = {
  url?: MaybeRefGetter<string>
  method?: Method
  baseURL?: string
  headers?: HeadersInit
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
  headers?: HeadersInit
}

// Executes mutations via $fetch with unified error handling.
export function useApiMutation<TPayload, TBody extends MutationBody = Record<string, unknown>>(defaults: MutationDefaults = {}) {
  const pending = ref(false)
  const apiError = ref<{ code: string, message: string } | null>(null)
  const toast = useToast()
  const { ensureCsrfToken } = useCsrfToken()

  // Compute retry delay based on backoff strategy.
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
    const isUnsafeMethod = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
    pending.value = true
    apiError.value = null

    const retryOptions = defaults.retryOptions
    const maxRetries = retryOptions?.count ?? 0

    try {
      // Attempt retries in a single loop.
      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const mergedHeaders = new Headers(defaults.headers || {})
          if (input.headers) {
            const dynamicHeaders = new Headers(input.headers)
            dynamicHeaders.forEach((value, key) => {
              mergedHeaders.set(key, value)
            })
          }

          if (import.meta.client && isUnsafeMethod) {
            const csrfToken = await ensureCsrfToken()
            if (csrfToken) {
              mergedHeaders.set('x-csrf-token', csrfToken)
            }
          }

          const response = await $fetch<ApiResponse<TPayload>>(resolvedUrl, {
            baseURL: defaults.baseURL || useRuntimeConfig().app.baseURL,
            method,
            body: input.body,
            headers: mergedHeaders
          })

          if (!response.success) {
            apiError.value = response.error
            if (retryOptions && attempt < maxRetries && shouldRetry(apiError.value?.code, retryOptions)) {
              const delay = getRetryDelay(attempt, retryOptions)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            if (defaults.toastOptions?.error !== false && import.meta.client) {
              emitErrorToast(
                toast,
                defaults.toastOptions?.error || 'Request failed',
                apiError.value.message
              )
            }
            return undefined
          }

          if (defaults.toastOptions?.success) {
            emitSuccessToast(toast, defaults.toastOptions.success)
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
          if (defaults.toastOptions?.error !== false) {
            emitErrorToast(
              toast,
              defaults.toastOptions?.error || 'Request failed',
              apiError.value.message
            )
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
