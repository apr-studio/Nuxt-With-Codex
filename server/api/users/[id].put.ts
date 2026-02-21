import { readBody, getRouterParam, createError } from 'h3'
import { assertAdmin } from '../../utils/auth'
import { updateUser, type Role, type UserStatus } from '../../utils/mock-db'

type UpdatePayload = {
  name?: string
  email?: string
  role?: Role
  status?: UserStatus
}

export default defineEventHandler(async (event) => {
  assertAdmin(event)
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
  if (body.role !== undefined && !['owner', 'admin', 'member'].includes(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Role is invalid.' })
  }
  if (body.status !== undefined && !['active', 'invited', 'disabled'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status is invalid.' })
  }

  const updated = updateUser(id, {
    ...(body.name !== undefined ? { name: body.name.trim() } : {}),
    ...(body.email !== undefined ? { email: body.email.trim().toLowerCase() } : {}),
    ...(body.role !== undefined ? { role: body.role } : {}),
    ...(body.status !== undefined ? { status: body.status } : {})
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  return { user: updated }
})
