import { createError, getQuery, sendRedirect } from 'h3'
import { buildOAuthAuthorizationUrl, isOAuthProvider } from '../../../utils/oauth'
import { assertRateLimit } from '../../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    key: 'oauth_start',
    limit: 20,
    windowMs: 60_000
  })

  const providerValue = event.context.params?.provider || ''
  if (!isOAuthProvider(providerValue)) {
    throw createError({ statusCode: 404, statusMessage: 'OAuth provider not found.' })
  }

  try {
    const query = getQuery(event)
    const authorizationUrl = buildOAuthAuthorizationUrl(event, providerValue, query.redirect)
    return sendRedirect(event, authorizationUrl, 302)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'oauth_start_failed'
    return sendRedirect(event, `/login?oauth_error=${encodeURIComponent(message)}`, 302)
  }
})
