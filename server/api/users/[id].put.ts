import { readBody, getRouterParam, createError } from 'h3'
import { Prisma } from '@prisma/client'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'
import { assertPermission, getRole } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { parseUpdateUserBody, parseUserId, validateUserMutationResponse } from '../../schemas/users'
import { prisma } from '../../utils/prisma'

export default defineApiHandler(async (event) => {
  assertPermission(event, 'users:update')
  const id = parseUserId(getRouterParam(event, 'id'))
  const body = parseUpdateUserBody(await readBody(event))

  const actorRole = getRole(event)
  if (actorRole !== 'admin' && body.role !== undefined) {
    throw createError({ statusCode: 403, statusMessage: 'Only admin can change user role.' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  let updated
  try {
    updated = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.email !== undefined ? { email: body.email.trim().toLowerCase() } : {}),
        ...(body.role !== undefined ? { role: body.role.toUpperCase() as 'ADMIN' | 'EDITOR' | 'VIEWER' } : {}),
        ...(body.status !== undefined ? { status: body.status.toUpperCase() as 'ACTIVE' | 'INVITED' | 'DISABLED' } : {})
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists.',
        data: { code: DOMAIN_ERROR_CODES.emailTaken }
      })
    }
    throw error
  }

  const response = {
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role.toLowerCase(),
      status: updated.status.toLowerCase(),
      createdAt: updated.createdAt.toISOString()
    }
  }

  validateUserMutationResponse(response)
  return apiSuccess(response)
}, {
  csrf: true,
  rateLimit: {
    key: 'users_update',
    limit: 40,
    windowMs: 60_000
  }
})
