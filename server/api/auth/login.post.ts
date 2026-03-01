import { readBody, createError } from 'h3'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { parseAuthLoginBody, validateAuthMeResponse } from '../../schemas/auth'
import { getPermissions } from '../../utils/rbac'
import { setAuthSession } from '../../utils/session'
import { prisma } from '../../utils/prisma'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'
import { verifyPassword } from '../../utils/password'

export default defineApiHandler(async (event) => {
  const body = await readBody(event)
  const payload = parseAuthLoginBody(body)

  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase() }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found.',
      data: { code: DOMAIN_ERROR_CODES.userNotFound }
    })
  }

  if (!user.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Password not set for this user.'
    })
  }

  const passwordOk = await verifyPassword(payload.password, user.passwordHash)
  if (!passwordOk) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials.'
    })
  }

  if (user.status === 'DISABLED') {
    throw createError({
      statusCode: 403,
      statusMessage: 'User is disabled.'
    })
  }

  const role = user.role.toLowerCase() as 'admin' | 'editor' | 'viewer'
  setAuthSession(event, user.id, role)

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
