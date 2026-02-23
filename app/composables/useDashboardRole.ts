import { computed } from 'vue'
import { hasPermission, normalizeRole } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'

export function useDashboardRole() {
  const roleCookie = useCookie<AppRole>('role', { default: () => 'admin' })

  const normalizedRole = computed<AppRole>(() => normalizeRole(roleCookie.value))

  const role = computed<AppRole>({
    get: () => normalizedRole.value,
    set: (value) => {
      roleCookie.value = normalizeRole(value)
    }
  })

  watch(roleCookie, (value) => {
    roleCookie.value = normalizeRole(value)
  })

  function can(permission: Permission): boolean {
    return hasPermission(normalizedRole.value, permission)
  }

  return {
    role,
    normalizedRole,
    can
  }
}
