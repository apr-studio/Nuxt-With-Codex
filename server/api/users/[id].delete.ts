import { getRouterParam, createError } from 'h3'
import { assertPermission } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { parseUserId, validateDeleteUserResponse } from '../../schemas/users'
import { prisma } from '../../utils/prisma'

export default defineApiHandler(async (event) => {
  assertPermission(event, 'users:delete')
  const id = parseUserId(getRouterParam(event, 'id'))

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  await prisma.user.delete({ where: { id } })

  const response = { ok: true }
  validateDeleteUserResponse(response)
  return apiSuccess(response)
}, {
  csrf: true,
  rateLimit: {
    key: 'users_delete',
    limit: 20,
    windowMs: 60_000
  }
})
