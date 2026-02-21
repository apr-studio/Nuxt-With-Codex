import { getCookie, type H3Event, createError } from 'h3'

export type DashboardRole = 'admin' | 'member'

export function getRole(event: H3Event): DashboardRole {
  const role = getCookie(event, 'role')
  return role === 'admin' ? 'admin' : 'member'
}

export function assertAdmin(event: H3Event) {
  if (getRole(event) !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin role required.' })
  }
}
