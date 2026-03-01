import { createError, sendRedirect, type H3Event } from 'h3'
import { prisma } from './prisma'
import { setAuthSession } from './session'
import {
  consumeOAuthState,
  fetchOAuthProfile,
  type OAuthProvider
} from './oauth'

export async function completeOAuthLogin(event: H3Event, provider: OAuthProvider, code: unknown, state: unknown) {
  const authCode = typeof code === 'string' ? code : ''
  const oauthState = consumeOAuthState(event, provider, state)

  if (!authCode) {
    throw createError({ statusCode: 400, statusMessage: 'OAuth code is missing.' })
  }

  const profile = await fetchOAuthProfile(event, provider, authCode)

  const existing = await prisma.user.findUnique({
    where: { email: profile.email.toLowerCase() }
  })

  if (existing?.status === 'DISABLED') {
    throw createError({ statusCode: 403, statusMessage: 'User is disabled.' })
  }

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: profile.name || existing.name,
          avatarUrl: profile.avatarUrl ?? existing.avatarUrl
        }
      })
    : await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email.toLowerCase(),
          avatarUrl: profile.avatarUrl,
          role: 'VIEWER',
          status: 'ACTIVE'
        }
      })

  const role = user.role.toLowerCase() as 'admin' | 'editor' | 'viewer'
  setAuthSession(event, user.id, role)
  return sendRedirect(event, oauthState.redirect, 302)
}
