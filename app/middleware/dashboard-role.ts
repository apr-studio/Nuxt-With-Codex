export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  const role = useCookie<'admin' | 'editor' | 'viewer'>('role', { default: () => 'admin' })
  const normalizedRole = role.value === 'admin' || role.value === 'editor' || role.value === 'viewer'
    ? role.value
    : 'viewer'
  role.value = normalizedRole

  const rolePermissions: Record<'admin' | 'editor' | 'viewer', string[]> = {
    admin: ['dashboard:view', 'reports:view', 'users:view', 'users:create', 'users:update', 'users:delete', 'settings:view', 'settings:write'],
    editor: ['dashboard:view', 'reports:view', 'users:view', 'users:update', 'settings:view'],
    viewer: ['dashboard:view', 'reports:view', 'users:view']
  }

  const permission = (to.meta as Record<string, unknown>).permission as string | undefined
  if (permission && !rolePermissions[normalizedRole].includes(permission)) {
    return navigateTo('/dashboard/overview?forbidden=1')
  }
})
