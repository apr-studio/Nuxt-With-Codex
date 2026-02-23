import { createError, getCookie, type H3Event } from 'h3'
import { hasPermission as hasPermissionByRole, normalizeRole, ROLE_PERMISSIONS } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'

export function getRole(event: H3Event): AppRole {
  return normalizeRole(getCookie(event, 'role'))
}

export function getPermissions(role: AppRole): Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return hasPermissionByRole(role, permission)
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
