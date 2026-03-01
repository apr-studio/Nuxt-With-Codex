export const API_ERROR_CODES = {
  badRequest: 'BAD_REQUEST',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  unprocessableEntity: 'UNPROCESSABLE_ENTITY',
  tooManyRequests: 'TOO_MANY_REQUESTS',
  internalError: 'INTERNAL_ERROR',
  requestFailed: 'REQUEST_FAILED'
} as const

export const DOMAIN_ERROR_CODES = {
  emailTaken: 'EMAIL_TAKEN',
  userNotFound: 'USER_NOT_FOUND',
  rateLimited: 'RATE_LIMITED',
  csrfInvalid: 'CSRF_INVALID'
} as const

export function getDefaultApiErrorCode(statusCode: number): string {
  if (statusCode === 400) {
    return API_ERROR_CODES.badRequest
  }
  if (statusCode === 401) {
    return API_ERROR_CODES.unauthorized
  }
  if (statusCode === 403) {
    return API_ERROR_CODES.forbidden
  }
  if (statusCode === 404) {
    return API_ERROR_CODES.notFound
  }
  if (statusCode === 409) {
    return API_ERROR_CODES.conflict
  }
  if (statusCode === 422) {
    return API_ERROR_CODES.unprocessableEntity
  }
  if (statusCode === 429) {
    return API_ERROR_CODES.tooManyRequests
  }
  if (statusCode >= 500) {
    return API_ERROR_CODES.internalError
  }
  return API_ERROR_CODES.requestFailed
}
