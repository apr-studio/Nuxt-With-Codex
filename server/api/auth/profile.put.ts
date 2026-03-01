import { readBody, createError } from 'h3'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { parseAuthProfileUpdateBody, validateAuthMeResponse } from '../../schemas/auth'
import { getAuthSession } from '../../utils/session'
import { getPermissions, getRole } from '../../utils/rbac'
import { prisma } from '../../utils/prisma'
import { hashPassword, verifyPassword } from '../../utils/password'

export default defineApiHandler(async (event) => {
  const session = getAuthSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' })
  }

  const body = parseAuthProfileUpdateBody(await readBody(event))
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  const wantsPasswordChange = Boolean(body.currentPassword || body.newPassword)
  if (wantsPasswordChange) {
    if (!body.currentPassword || !body.newPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Both currentPassword and newPassword are required.' })
    }
    if (!user.passwordHash) {
      throw createError({ statusCode: 401, statusMessage: 'Password not set for this user.' })
    }
    const currentPasswordOk = await verifyPassword(body.currentPassword, user.passwordHash)
    if (!currentPasswordOk) {
      throw createError({ statusCode: 401, statusMessage: 'Current password is invalid.' })
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
      ...(body.newPassword ? { passwordHash: await hashPassword(body.newPassword) } : {})
    }
  })

  const role = getRole(event)
  const response = {
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatarUrl: updated.avatarUrl
    },
    role,
    permissions: getPermissions(role)
  }
  validateAuthMeResponse(response)
  return apiSuccess(response)
})
