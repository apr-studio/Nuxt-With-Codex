import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { getOrCreateCsrfToken } from '../../utils/csrf'

export default defineApiHandler((event) => {
  const token = getOrCreateCsrfToken(event)
  return apiSuccess({ token })
})
