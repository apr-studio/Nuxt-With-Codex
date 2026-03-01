import { createError, getCookie, getRequestURL, setCookie, deleteCookie, type H3Event } from 'h3'

export type OAuthProvider = 'google' | 'facebook' | 'apple'

type OAuthTokenResponse = {
  access_token?: string
  id_token?: string
}

type OAuthProfile = {
  email: string
  name: string
  avatarUrl: string | null
}

type OAuthState = {
  nonce: string
  redirect: string
}

const OAUTH_STATE_PREFIX = 'oauth_state_'

function toBasePath(baseURL: string) {
  if (baseURL === '/' || !baseURL) {
    return ''
  }
  return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
}

function resolveRedirectPath(value: unknown): string {
  if (typeof value !== 'string') {
    return '/dashboard/overview'
  }
  if (!value.startsWith('/')) {
    return '/dashboard/overview'
  }
  if (value.startsWith('//')) {
    return '/dashboard/overview'
  }
  return value
}

function encodeState(state: OAuthState) {
  return btoa(encodeURIComponent(JSON.stringify(state)))
}

function decodeState(value: string): OAuthState | null {
  try {
    const decoded = decodeURIComponent(atob(value))
    const parsed = JSON.parse(decoded) as OAuthState
    if (!parsed?.nonce || !parsed?.redirect) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function buildCallbackUrl(event: H3Event, provider: OAuthProvider) {
  const runtimeConfig = useRuntimeConfig()
  const origin = getRequestURL(event).origin
  const basePath = toBasePath(runtimeConfig.app.baseURL)
  return `${origin}${basePath}/api/auth/oauth/callback/${provider}`
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return value === 'google' || value === 'facebook' || value === 'apple'
}

function getProviderConfig(provider: OAuthProvider) {
  const runtimeConfig = useRuntimeConfig()

  if (provider === 'google') {
    return {
      clientId: runtimeConfig.oauthGoogleClientId,
      clientSecret: runtimeConfig.oauthGoogleClientSecret,
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['openid', 'email', 'profile']
    }
  }

  if (provider === 'facebook') {
    return {
      clientId: runtimeConfig.oauthFacebookClientId,
      clientSecret: runtimeConfig.oauthFacebookClientSecret,
      authorizeUrl: 'https://www.facebook.com/v20.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v20.0/oauth/access_token',
      scopes: ['email', 'public_profile']
    }
  }

  return {
    clientId: runtimeConfig.oauthAppleClientId,
    clientSecret: runtimeConfig.oauthAppleClientSecret,
    authorizeUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scopes: ['name', 'email']
  }
}

export function buildOAuthAuthorizationUrl(event: H3Event, provider: OAuthProvider, requestedRedirect: unknown) {
  const config = getProviderConfig(provider)
  if (!config.clientId || !config.clientSecret) {
    throw createError({
      statusCode: 501,
      statusMessage: `${provider} OAuth is not configured on this server.`
    })
  }

  const state: OAuthState = {
    nonce: crypto.randomUUID(),
    redirect: resolveRedirectPath(requestedRedirect)
  }

  const stateKey = `${OAUTH_STATE_PREFIX}${provider}`
  setCookie(event, stateKey, encodeState(state), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: `/api/auth/oauth/callback/${provider}`,
    maxAge: 60 * 10
  })

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: buildCallbackUrl(event, provider),
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: state.nonce
  })

  if (provider === 'facebook') {
    params.set('auth_type', 'rerequest')
  }

  if (provider === 'apple') {
    params.set('response_mode', 'form_post')
  }

  return `${config.authorizeUrl}?${params.toString()}`
}

export function consumeOAuthState(event: H3Event, provider: OAuthProvider, incomingState: unknown) {
  const stateKey = `${OAUTH_STATE_PREFIX}${provider}`
  const raw = getCookie(event, stateKey)
  deleteCookie(event, stateKey, { path: `/api/auth/oauth/callback/${provider}` })

  const stored = raw ? decodeState(raw) : null
  const incoming = typeof incomingState === 'string' ? incomingState : ''
  if (!stored || !incoming || stored.nonce !== incoming) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OAuth state validation failed.'
    })
  }
  return stored
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split('.')
  if (segments.length < 2) {
    return null
  }
  try {
    const segment = (segments[1] || '').replace(/-/g, '+').replace(/_/g, '/')
    const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4)
    const payload = atob(padded)
    return JSON.parse(payload) as Record<string, unknown>
  } catch {
    return null
  }
}

async function exchangeCode(event: H3Event, provider: OAuthProvider, code: string): Promise<OAuthTokenResponse> {
  const config = getProviderConfig(provider)
  if (!config.clientId || !config.clientSecret) {
    throw createError({
      statusCode: 501,
      statusMessage: `${provider} OAuth is not configured on this server.`
    })
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: buildCallbackUrl(event, provider),
    grant_type: 'authorization_code'
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  if (!response.ok) {
    throw createError({
      statusCode: 401,
      statusMessage: `OAuth token exchange failed for ${provider}.`
    })
  }
  return await response.json() as OAuthTokenResponse
}

async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) {
    throw createError({ statusCode: 401, statusMessage: 'Failed to fetch Google profile.' })
  }
  const profile = await response.json() as {
    email?: string
    name?: string
    picture?: string
  }

  if (!profile.email) {
    throw createError({ statusCode: 400, statusMessage: 'Google account did not provide email.' })
  }

  return {
    email: profile.email.toLowerCase(),
    name: profile.name || profile.email.split('@')[0] || 'Google User',
    avatarUrl: profile.picture || null
  }
}

async function fetchFacebookProfile(accessToken: string): Promise<OAuthProfile> {
  const url = new URL('https://graph.facebook.com/me')
  url.searchParams.set('fields', 'id,name,email,picture.type(large)')
  url.searchParams.set('access_token', accessToken)
  const response = await fetch(url)
  if (!response.ok) {
    throw createError({ statusCode: 401, statusMessage: 'Failed to fetch Facebook profile.' })
  }
  const profile = await response.json() as {
    name?: string
    email?: string
    picture?: { data?: { url?: string } }
  }

  if (!profile.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Facebook account did not provide email permission.'
    })
  }

  return {
    email: profile.email.toLowerCase(),
    name: profile.name || profile.email.split('@')[0] || 'Facebook User',
    avatarUrl: profile.picture?.data?.url || null
  }
}

function fetchAppleProfile(idToken: string): OAuthProfile {
  const payload = parseJwtPayload(idToken)
  const email = typeof payload?.email === 'string' ? payload.email : ''
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Apple account did not provide email.'
    })
  }

  return {
    email: email.toLowerCase(),
    name: email.split('@')[0] || 'Apple User',
    avatarUrl: null
  }
}

export async function fetchOAuthProfile(event: H3Event, provider: OAuthProvider, code: string): Promise<OAuthProfile> {
  const token = await exchangeCode(event, provider, code)

  if (provider === 'google') {
    if (!token.access_token) {
      throw createError({ statusCode: 401, statusMessage: 'Google access token missing.' })
    }
    return await fetchGoogleProfile(token.access_token)
  }

  if (provider === 'facebook') {
    if (!token.access_token) {
      throw createError({ statusCode: 401, statusMessage: 'Facebook access token missing.' })
    }
    return await fetchFacebookProfile(token.access_token)
  }

  if (!token.id_token) {
    throw createError({ statusCode: 401, statusMessage: 'Apple id_token missing.' })
  }
  return fetchAppleProfile(token.id_token)
}
