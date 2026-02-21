import { readBody, createError } from 'h3'
import { assertAdmin } from '../utils/auth'
import { createUser, type Role, type UserStatus } from '../utils/mock-db'

type CreatePayload = {
  name?: string
  email?: string
  role?: Role
  status?: UserStatus
}

function validatePayload(body: CreatePayload) {
  if (!body.name || body.name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters.' })
  }
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email format is invalid.' })
  }
  if (!body.role || !['owner', 'admin', 'member'].includes(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Role is invalid.' })
  }
  if (!body.status || !['active', 'invited', 'disabled'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status is invalid.' })
  }
}

export default defineEventHandler(async (event) => {
  assertAdmin(event)
  const body = await readBody<CreatePayload>(event)
  validatePayload(body)

  const user = createUser({
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    role: body.role!,
    status: body.status!
  })

  return { user }
})
