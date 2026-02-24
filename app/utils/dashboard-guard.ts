import { hasPermission } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'

export const DASHBOARD_FORBIDDEN_REDIRECT = '/unauthorized'

type DashboardPageMeta = {
  permission?: Permission
}

export function getRoutePermission(meta: DashboardPageMeta): Permission | undefined {
  return meta.permission
}

export function getDashboardGuardRedirect(
  role: AppRole,
  path: string,
  meta: DashboardPageMeta
): string | undefined {
  if (!path.startsWith('/dashboard')) {
    return
  }

  const permission = getRoutePermission(meta)
  if (permission && !hasPermission(role, permission)) {
    return DASHBOARD_FORBIDDEN_REDIRECT
  }
}
