import { readBody, getRouterParam, createError } from 'h3'
import { assertPermission, getRole } from '../../utils/rbac'
import { prisma } from '../../utils/prisma'

type UpdatePayload = {
  name?: string
  email?: string
  role?: 'admin' | 'editor' | 'viewer'
  status?: 'active' | 'invited' | 'disabled'
}

export default defineEventHandler(async (event) => {
  assertPermission(event, 'users:update')
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user id.' })
  }

  const body = await readBody<UpdatePayload>(event)

  if (body.name !== undefined && body.name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters.' })
  }
  if (body.email !== undefined && !/^\S+@\S+\.\S+$/.test(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email format is invalid.' })
  }
  if (body.role !== undefined && !['admin', 'editor', 'viewer'].includes(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Role is invalid.' })
  }
  if (body.status !== undefined && !['active', 'invited', 'disabled'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status is invalid.' })
  }

  const actorRole = getRole(event)
  if (actorRole !== 'admin' && body.role !== undefined) {
    throw createError({ statusCode: 403, statusMessage: 'Only admin can change user role.' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
      ...(body.email !== undefined ? { email: body.email.trim().toLowerCase() } : {}),
      ...(body.role !== undefined ? { role: body.role.toUpperCase() as 'ADMIN' | 'EDITOR' | 'VIEWER' } : {}),
      ...(body.status !== undefined ? { status: body.status.toUpperCase() as 'ACTIVE' | 'INVITED' | 'DISABLED' } : {})
    }
  })

  return {
    user: {
      ...updated,
      role: updated.role.toLowerCase(),
      status: updated.status.toLowerCase()
    }
  }
})
