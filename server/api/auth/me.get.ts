import { createError } from 'h3'
import { getPermissions, getRole } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { validateAuthMeResponse } from '../../schemas/auth'
import { getAuthSession } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineApiHandler(async (event) => {
  const session = getAuthSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' })
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Session user not found.' })
  }
  const role = getRole(event)
  const response = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: null
    },
    role,
    permissions: getPermissions(role)
  }
  validateAuthMeResponse(response)
  return apiSuccess(response)
})
