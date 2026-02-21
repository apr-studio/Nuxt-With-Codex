import { getRouterParam, createError } from 'h3'
import { assertPermission } from '../../utils/rbac'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  assertPermission(event, 'users:delete')
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user id.' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  }

  await prisma.user.delete({ where: { id } })

  return { ok: true }
})
