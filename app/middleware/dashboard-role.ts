import { normalizeRole } from '#shared/rbac'
import { getDashboardGuardRedirect } from '~/utils/dashboard-guard'

export default defineNuxtRouteMiddleware((to) => {
  const role = useCookie<'admin' | 'editor' | 'viewer'>('role', { default: () => 'admin' })
  const normalizedRole = normalizeRole(role.value)
  role.value = normalizedRole

  const redirect = getDashboardGuardRedirect(
    normalizedRole,
    to.path,
    to.meta as Record<string, unknown>
  )
  if (redirect) {
    return navigateTo(redirect)
  }
})
