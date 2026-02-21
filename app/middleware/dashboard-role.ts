export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  const role = useCookie<'admin' | 'member'>('role', { default: () => 'member' })
  const normalizedRole = role.value === 'admin' ? 'admin' : 'member'
  role.value = normalizedRole

  if ((to.meta as Record<string, unknown>).requiresAdmin && normalizedRole !== 'admin') {
    return navigateTo('/dashboard/overview?forbidden=1')
  }
})
