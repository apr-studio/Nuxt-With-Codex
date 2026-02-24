import { computed, ref, watch } from 'vue'
import { extractApiError } from '~/utils/api-error'
import { getRetryDelay, shouldRetry, type RetryOptions } from '~/utils/api-retry'
import { emitErrorToast } from '~/utils/api-toast'
import type { ApiResponse, ApiSuccess } from '#shared/api-response'

// Wrapper around useFetch with unified API response handling, retry, and toast.
type UseApiFetchRequest<T> = Parameters<typeof useFetch<ApiResponse<T>>>[0]
type UseApiFetchOptions<T> = Parameters<typeof useFetch<ApiResponse<T>>>[1] & {
  defaultData?: T
  retryOptions?: RetryOptions
  toastOptions?: {
    error?: string | false
  }
}

// Returns payload + derived error state; auto-retries based on options.
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

  // Toasts are only shown on client.
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
  const lastToastMessage = ref('')

  function clearRetryTimer() {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  // Retry and toast handling whenever error/pending/success changes.
  watch([apiError, pending, isSuccess], () => {
    if (isSuccess.value) {
      retryAttempts.value = 0
      lastToastMessage.value = ''
      clearRetryTimer()
      return
    }

    if (!apiError.value || pending.value) {
      return
    }

    const options = retryOptions
    if (!options || (options.count ?? 0) <= 0) {
      if (toastOptions?.error !== false) {
        emitErrorToast(
          toast,
          toastOptions?.error || 'Request failed',
          apiError.value.message,
          lastToastMessage
        )
      }
      return
    }

    if (retryAttempts.value >= (options.count ?? 0)) {
      if (toastOptions?.error !== false) {
        emitErrorToast(
          toast,
          toastOptions?.error || 'Request failed',
          apiError.value.message,
          lastToastMessage
        )
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
