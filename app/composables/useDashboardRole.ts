import { computed } from 'vue'
import { normalizeRole } from '#shared/rbac'
import type { AppRole, Permission } from '#shared/rbac'
import type { AuthMeResponse } from '#shared/schemas/auth'

// Reads role from session-backed auth endpoint and exposes permission checks.
export function useDashboardRole() {
  const { payload, refresh } = useApiFetch<AuthMeResponse>(useApiPath('/api/auth/me'), {
    toastOptions: { error: false }
  })

  const normalizedRole = computed<AppRole>(() => normalizeRole(payload.value?.role))

  const updateRoleMutation = useApiMutation<AuthMeResponse, { role: AppRole }>({
    url: useApiPath('/api/auth/login'),
    method: 'POST',
    toastOptions: {
      success: 'Role updated',
      error: 'Failed to update role'
    }
  })

  const role = computed<AppRole>({
    get: () => normalizedRole.value,
    set: (value) => {
      void updateRole(value)
    }
  })

  const permissions = computed<Permission[]>(() => payload.value?.permissions || [])

  function can(permission: Permission): boolean {
    return permissions.value.includes(permission)
  }

  async function updateRole(nextRole: AppRole) {
    const normalized = normalizeRole(nextRole)
    const result = await updateRoleMutation.mutate({
      body: { role: normalized }
    })
    if (result) {
      await refresh()
    }
  }

  return {
    role,
    normalizedRole,
    can
  }
}
