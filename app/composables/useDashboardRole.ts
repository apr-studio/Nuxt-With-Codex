import { computed } from 'vue'
import { normalizeRole } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'
import type { AuthMeResponse } from '#shared/schemas/auth'

// Reads role from session-backed auth endpoint and exposes permission checks.
export function useDashboardRole() {
  const { payload } = useApiFetch<AuthMeResponse>(useApiPath('/api/auth/me'), {
    toastOptions: { error: false }
  })

  const normalizedRole = computed<AppRole>(() => normalizeRole(payload.value?.role))
  const permissions = computed<Permission[]>(() => payload.value?.permissions || [])

  function can(permission: Permission): boolean {
    return permissions.value.includes(permission)
  }

  return {
    normalizedRole,
    can
  }
}
