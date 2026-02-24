import { readBody } from 'h3'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { parseAuthLoginBody, validateAuthMeResponse } from '../../schemas/auth'
import { getPermissions } from '../../utils/rbac'
import { setAuthSession } from '../../utils/session'

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const payload = parseAuthLoginBody(body)

  setAuthSession(event, payload.role)

  const response = {
    role: payload.role,
    permissions: getPermissions(payload.role)
  }
  validateAuthMeResponse(response)
  return apiSuccess(response)
})
