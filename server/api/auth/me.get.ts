import { getPermissions, getRole } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { validateAuthMeResponse } from '../../schemas/auth'

export default defineApiHandler((event) => {
  const role = getRole(event)
  const response = {
    role,
    permissions: getPermissions(role)
  }
  validateAuthMeResponse(response)
  return apiSuccess(response)
})
