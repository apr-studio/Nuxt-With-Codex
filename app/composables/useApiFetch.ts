import { computed, ref, watch } from 'vue'
import { extractApiError } from '~/utils/api-error'
import type { ApiResponse, ApiSuccess } from '#shared/api-response'

type UseApiFetchRequest<T> = Parameters<typeof useFetch<ApiResponse<T>>>[0]
type UseApiFetchOptions<T> = Parameters<typeof useFetch<ApiResponse<T>>>[1] & {
  defaultData?: T
  retryOptions?: RetryOptions
  toastOptions?: {
    error?: string | false
  }
}

type RetryOptions = {
  count?: number
  delayMs?: number
  backoff?: 'fixed' | 'exponential'
  maxDelayMs?: number
  retryOnCodes?: string[]
}

function getRetryDelay(attempt: number, options: RetryOptions) {
  const baseDelay = options.delayMs ?? 400
  if (options.backoff === 'exponential') {
    const maxDelay = options.maxDelayMs ?? 4000
    return Math.min(maxDelay, baseDelay * 2 ** attempt)
  }
  return baseDelay
}

function shouldRetry(errorCode: string | undefined, options: RetryOptions) {
  if (!errorCode) {
    return true
  }
  if (!options.retryOnCodes || options.retryOnCodes.length === 0) {
    return true
  }
  return options.retryOnCodes.includes(errorCode)
}

export function useApiFetch<T>(request: UseApiFetchRequest<T>, options: UseApiFetchOptions<T> = {}) {
  const { defaultData, retryOptions, toastOptions, ...fetchOptions } = options

  const { data, error, status, pending, refresh, execute, clear } = useFetch<ApiResponse<T>>(request, {
    ...(fetchOptions || {}),
    ...(defaultData !== undefined
      ? {
          default: (): ApiSuccess<T> => ({
            success: true as const,
            data: defaultData
          })
        }
      : {})
  })

  const toast = useToast()
  const payload = computed<T | undefined>(() =>
    data.value?.success ? data.value.data : undefined
  )
  const apiError = computed(() => {
    if (data.value && !data.value.success) {
      return data.value.error
    }
    return extractApiError(error.value)
  })
  const isSuccess = computed(() => Boolean(data.value?.success))

  const retryAttempts = ref(0)
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let lastToastMessage = ''

  function clearRetryTimer() {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  watch([apiError, pending, isSuccess], () => {
    if (isSuccess.value) {
      retryAttempts.value = 0
      lastToastMessage = ''
      clearRetryTimer()
      return
    }

    if (!apiError.value || pending.value) {
      return
    }

    const options = retryOptions
    if (!options || (options.count ?? 0) <= 0) {
      if (toastOptions?.error !== false && apiError.value.message !== lastToastMessage && process.client) {
        toast.add({
          title: toastOptions?.error || 'Request failed',
          description: apiError.value.message,
          color: 'error'
        })
        lastToastMessage = apiError.value.message
      }
      return
    }

    if (retryAttempts.value >= (options.count ?? 0)) {
      if (toastOptions?.error !== false && apiError.value.message !== lastToastMessage && process.client) {
        toast.add({
          title: toastOptions?.error || 'Request failed',
          description: apiError.value.message,
          color: 'error'
        })
        lastToastMessage = apiError.value.message
      }
      return
    }

    if (!shouldRetry(apiError.value.code, options)) {
      return
    }

    clearRetryTimer()
    const delay = getRetryDelay(retryAttempts.value, options)
    retryTimer = setTimeout(() => {
      retryAttempts.value += 1
      refresh()
    }, delay)
  })

  return {
    data,
    payload,
    apiError,
    isSuccess,
    error,
    status,
    pending,
    refresh,
    execute,
    clear
  }
}
