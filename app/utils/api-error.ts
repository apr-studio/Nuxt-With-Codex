import { API_ERROR_CODES } from '#shared/api-error-codes'
import type { ApiFailure } from '#shared/api-response'

type ApiFailureLike = {
  success?: unknown
  error?: {
    code?: unknown
    message?: unknown
  }
}

export function isApiFailure(value: unknown): value is ApiFailure {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as ApiFailureLike
  return candidate.success === false
    && typeof candidate.error?.code === 'string'
    && typeof candidate.error?.message === 'string'
}

export function extractApiError(error: unknown): ApiFailure['error'] | null {
  if (isApiFailure(error)) {
    return error.error
  }

  const payload = (error as { data?: unknown })?.data
  if (isApiFailure(payload)) {
    return payload.error
  }

  if (error instanceof Error && error.message) {
    return {
      code: API_ERROR_CODES.requestFailed,
      message: error.message
    }
  }

  return null
}
