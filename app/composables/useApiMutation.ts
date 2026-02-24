import { computed, ref, toValue } from 'vue'
import { extractApiError } from '~/utils/api-error'
import type { ApiResponse } from '#shared/api-response'

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type MaybeRefGetter<T> = T | Ref<T> | (() => T)
type MutationBody = Record<string, unknown> | BodyInit | null

type MutationDefaults = {
  url?: MaybeRefGetter<string>
  method?: Method
  baseURL?: string
}

type MutationInput<TBody extends MutationBody> = {
  url?: string
  method?: Method
  body?: TBody
}

export function useApiMutation<TPayload, TBody extends MutationBody = Record<string, unknown>>(defaults: MutationDefaults = {}) {
  const pending = ref(false)
  const apiError = ref<{ code: string, message: string } | null>(null)

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

    try {
      const response = await $fetch<ApiResponse<TPayload>>(resolvedUrl, {
        baseURL: defaults.baseURL || useRuntimeConfig().app.baseURL,
        method,
        body: input.body
      })

      if (!response.success) {
        apiError.value = response.error
        return undefined
      }

      return response.data
    } catch (error) {
      apiError.value = extractApiError(error)
        || { code: 'REQUEST_FAILED', message: 'Request failed.' }
      return undefined
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
