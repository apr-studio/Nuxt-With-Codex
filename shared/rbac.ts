export const APP_ROLES = ['admin', 'editor', 'viewer'] as const

export type AppRole = typeof APP_ROLES[number]

export type Permission
  = | 'dashboard:view'
    | 'reports:view'
    | 'users:view'
    | 'users:create'
    | 'users:update'
    | 'users:delete'
    | 'settings:view'
    | 'settings:write'

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
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

export function isAppRole(value: string | undefined | null): value is AppRole {
  return APP_ROLES.includes(value as AppRole)
}

export function normalizeRole(value: string | undefined | null): AppRole {
  return isAppRole(value) ? value : 'viewer'
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}
