import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { clearAuthSession } from '../../utils/session'

export default defineApiHandler((event) => {
  clearAuthSession(event)
  return apiSuccess({ ok: true })
})
