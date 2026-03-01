import { readBody, createError } from 'h3'
import { Prisma } from '@prisma/client'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import {
  parseAuthRegisterBody,
  validateAuthMeResponse
} from '../../schemas/auth'
import { getPermissions } from '../../utils/rbac'
import { setAuthSession } from '../../utils/session'
import { prisma } from '../../utils/prisma'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'
import { hashPassword } from '../../utils/password'

export default defineApiHandler(async (event) => {
  const body = parseAuthRegisterBody(await readBody(event))

  let user
  try {
    const passwordHash = await hashPassword(body.password)
    user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        passwordHash,
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists.',
        data: { code: DOMAIN_ERROR_CODES.emailTaken }
      })
    }
    throw error
  }

  const role = user.role.toLowerCase() as 'admin' | 'editor' | 'viewer'
  setAuthSession(event, user.id, role)

  const response = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl
    },
    role,
    permissions: getPermissions(role)
  }
  validateAuthMeResponse(response)
  return apiSuccess(response)
}, {
  csrf: true,
  rateLimit: {
    key: 'auth_register',
    limit: 5,
    windowMs: 60_000
  }
})
