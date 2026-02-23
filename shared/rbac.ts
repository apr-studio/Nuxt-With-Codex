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

export function normalizeRole(value: string | undefined | null): AppRole {
  if (value === 'admin' || value === 'editor' || value === 'viewer') {
    return value
  }
  return 'viewer'
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}
