import { normalizeRole } from '#shared/rbac'
import type { AppRole } from '#shared/rbac'
import type { PageMeta } from '#app'
import { getDashboardGuardRedirect } from '~/utils/dashboard-guard'

export default defineNuxtRouteMiddleware((to) => {
  const role = useCookie<AppRole>('role', { default: () => 'admin' })
  const normalizedRole = normalizeRole(role.value)
  role.value = normalizedRole

  const redirect = getDashboardGuardRedirect(
    normalizedRole,
    to.path,
    to.meta as PageMeta
  )
  if (redirect) {
    return navigateTo(redirect)
  }
})
