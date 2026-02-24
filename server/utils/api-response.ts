import type { ApiFailure, ApiMeta, ApiSuccess } from '#shared/api-response'

export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data
  }
}

export function apiSuccessWithMeta<T, M extends ApiMeta>(data: T, meta: M): ApiSuccess<T, M> {
  return {
    success: true,
    data,
    meta
  }
}

export function apiFailure(code: string, message: string): ApiFailure {
  return {
    success: false,
    error: {
      code,
      message
    }
  }
}
