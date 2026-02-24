import type { PageMeta } from '#app'
import { getDashboardGuardRedirect } from '~/utils/dashboard-guard'
import type { ApiResponse } from '#shared/api-response'
import type { AuthMeResponse } from '#shared/schemas/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const fetcher = useRequestFetch()
  let response: ApiResponse<AuthMeResponse>

  try {
    response = await fetcher<ApiResponse<AuthMeResponse>>(useApiPath('/api/auth/me'))
  } catch {
    return navigateTo('/login')
  }

  if (!response.success) {
    return navigateTo('/login')
  }

  const redirect = getDashboardGuardRedirect(
    response.data.role,
    to.path,
    to.meta as PageMeta
  )
  if (redirect) {
    return navigateTo(redirect)
  }
})
