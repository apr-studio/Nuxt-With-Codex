import { getCookie, setCookie, deleteCookie, type H3Event } from 'h3'
import type { AppRole } from '#shared/rbac'

type SessionPayload = {
  userId: number
  role: AppRole
  createdAt: string
}

const SESSION_COOKIE = 'session'

function encodeSession(payload: SessionPayload): string {
  const json = JSON.stringify(payload)
  return btoa(encodeURIComponent(json))
}

function decodeSession(raw: string): SessionPayload | null {
  try {
    const decoded = decodeURIComponent(atob(raw))
    const parsed = JSON.parse(decoded) as SessionPayload
    if (!parsed?.role) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function getAuthSession(event: H3Event): SessionPayload | null {
  const raw = getCookie(event, SESSION_COOKIE)
  if (!raw) {
    return null
  }
  return decodeSession(raw)
}

export function setAuthSession(event: H3Event, userId: number, role: AppRole) {
  const payload: SessionPayload = {
    userId,
    role,
    createdAt: new Date().toISOString()
  }
  setCookie(event, SESSION_COOKIE, encodeSession(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/'
  })
}

export function clearAuthSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}
