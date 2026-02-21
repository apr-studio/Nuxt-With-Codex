import { readBody, createError } from 'h3'
import { assertPermission } from '../utils/rbac'
import { prisma } from '../utils/prisma'

type CreatePayload = {
  name?: string
  email?: string
  role?: 'admin' | 'editor' | 'viewer'
  status?: 'active' | 'invited' | 'disabled'
}

function validatePayload(body: CreatePayload) {
  if (!body.name || body.name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters.' })
  }
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email format is invalid.' })
  }
  if (!body.role || !['admin', 'editor', 'viewer'].includes(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Role is invalid.' })
  }
  if (!body.status || !['active', 'invited', 'disabled'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status is invalid.' })
  }
}

export default defineEventHandler(async (event) => {
  assertPermission(event, 'users:create')
  const body = await readBody<CreatePayload>(event)
  validatePayload(body)

  const user = await prisma.user.create({
    data: {
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      role: body.role!.toUpperCase() as 'ADMIN' | 'EDITOR' | 'VIEWER',
      status: body.status!.toUpperCase() as 'ACTIVE' | 'INVITED' | 'DISABLED'
    }
  })

  return {
    user: {
      ...user,
      role: user.role.toLowerCase(),
      status: user.status.toLowerCase()
    }
  }
})
