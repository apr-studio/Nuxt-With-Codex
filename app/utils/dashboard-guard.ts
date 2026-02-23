import { hasPermission } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'

export const DASHBOARD_FORBIDDEN_REDIRECT = '/dashboard/overview?forbidden=1'

export function getRoutePermission(meta: Record<string, unknown>): Permission | undefined {
  return meta.permission as Permission | undefined
}

export function getDashboardGuardRedirect(
  role: AppRole,
  path: string,
  meta: Record<string, unknown>
): string | undefined {
  if (!path.startsWith('/dashboard')) {
    return
  }

  const permission = getRoutePermission(meta)
  if (permission && !hasPermission(role, permission)) {
    return DASHBOARD_FORBIDDEN_REDIRECT
  }
}
