import { createError, getQuery, sendRedirect } from 'h3'
import { isOAuthProvider } from '../../../../utils/oauth'
import { completeOAuthLogin } from '../../../../utils/oauth-login'
import { assertRateLimit } from '../../../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    key: 'oauth_callback_get',
    limit: 30,
    windowMs: 60_000
  })

  const providerValue = event.context.params?.provider || ''
  if (!isOAuthProvider(providerValue)) {
    throw createError({ statusCode: 404, statusMessage: 'OAuth provider not found.' })
  }

  try {
    const query = getQuery(event)
    return await completeOAuthLogin(event, providerValue, query.code, query.state)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'oauth_callback_failed'
    return sendRedirect(event, `/login?oauth_error=${encodeURIComponent(message)}`, 302)
  }
})
