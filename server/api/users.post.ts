import { readBody, createError } from 'h3'
import { Prisma } from '@prisma/client'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'
import { assertPermission } from '../utils/rbac'
import { defineApiHandler } from '../utils/api-handler'
import { apiSuccess } from '../utils/api-response'
import { parseCreateUserBody, validateUserMutationResponse } from '../schemas/users'
import { prisma } from '../utils/prisma'
import { hashPassword } from '../utils/password'

export default defineApiHandler(async (event) => {
  assertPermission(event, 'users:create')
  const body = parseCreateUserBody(await readBody(event))

  let user
  try {
    const passwordHash = await hashPassword('1111111111')
    user = await prisma.user.create({
      data: {
        name: body.name!.trim(),
        email: body.email!.trim().toLowerCase(),
        role: body.role!.toUpperCase() as 'ADMIN' | 'EDITOR' | 'VIEWER',
        status: body.status!.toUpperCase() as 'ACTIVE' | 'INVITED' | 'DISABLED',
        passwordHash
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
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      status: user.status.toLowerCase(),
      createdAt: user.createdAt.toISOString()
    }
  }

  validateUserMutationResponse(response)
  return apiSuccess(response)
})
