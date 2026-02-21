import { createError, getCookie, type H3Event } from 'h3'

export type AppRole = 'admin' | 'editor' | 'viewer'

export type Permission
  = | 'dashboard:view'
    | 'reports:view'
    | 'users:view'
    | 'users:create'
    | 'users:update'
    | 'users:delete'
    | 'settings:view'
    | 'settings:write'

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  admin: [
    'dashboard:view',
    'reports:view',
    'users:view',
    'users:create',
    'users:update',
    'users:delete',
    'settings:view',
    'settings:write'
  ],
  editor: [
    'dashboard:view',
    'reports:view',
    'users:view',
    'users:update',
    'settings:view'
  ],
  viewer: [
    'dashboard:view',
    'reports:view',
    'users:view'
  ]
}

export function normalizeRole(value: string | undefined | null): AppRole {
  if (value === 'admin' || value === 'editor' || value === 'viewer') {
    return value
  }
  return 'viewer'
}

export function getRole(event: H3Event): AppRole {
  return normalizeRole(getCookie(event, 'role'))
}

export function getPermissions(role: AppRole): Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function assertPermission(event: H3Event, permission: Permission) {
  const role = getRole(event)
  if (!hasPermission(role, permission)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Permission denied. Missing: ${permission}`
    })
  }
}
