import type { ApiResponse } from '#shared/api-response'

type CsrfPayload = {
  token: string
}

export function useCsrfToken() {
  const token = useState<string>('csrf-token', () => '')

  async function ensureCsrfToken() {
    if (token.value) {
      return token.value
    }

    try {
      const response = await $fetch<ApiResponse<CsrfPayload>>(useApiPath('/api/auth/csrf'))
      if (response.success) {
        token.value = response.data.token
      }
    } catch {
      // CSRF validation on server is the source of truth; keep silent here.
    }

    return token.value
  }

  return {
    csrfToken: token,
    ensureCsrfToken
  }
}
