import { createError, getCookie, getHeader, setCookie, type H3Event } from 'h3'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'

const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

function createCsrfToken() {
  return crypto.randomUUID().replace(/-/g, '')
}

export function getOrCreateCsrfToken(event: H3Event) {
  const existing = getCookie(event, CSRF_COOKIE_NAME)
  if (existing) {
    return existing
  }
  const token = createCsrfToken()
  setCookie(event, CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    path: '/'
  })
  return token
}

export function assertCsrfToken(event: H3Event) {
  const cookieToken = getCookie(event, CSRF_COOKIE_NAME)
  const headerToken = getHeader(event, CSRF_HEADER_NAME)

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid CSRF token.',
      data: { code: DOMAIN_ERROR_CODES.csrfInvalid }
    })
  }
}
