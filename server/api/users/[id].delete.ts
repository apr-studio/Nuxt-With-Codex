import { getRouterParam, createError } from 'h3'
import { assertAdmin } from '../../utils/auth'
import { deleteUser } from '../../utils/mock-db'

export default defineEventHandler((event) => {
  assertAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user id.' })
  }

  const deleted = deleteUser(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  return { ok: true }
})
