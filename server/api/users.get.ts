import { getQuery } from 'h3'
import { assertPermission } from '../utils/rbac'
import { defineApiHandler } from '../utils/api-handler'
import { apiSuccess } from '../utils/api-response'
import { parseUsersListQuery, toUsersResponse, validateUsersResponse } from '../schemas/users'
import { prisma } from '../utils/prisma'

export default defineApiHandler((event) => {
  assertPermission(event, 'users:view')

  const query = parseUsersListQuery(getQuery(event))
  const q = query.q
  const status = query.status
  const page = query.page
  const pageSize = query.pageSize
  const statusMap: Record<string, 'ACTIVE' | 'INVITED' | 'DISABLED'> = {
    active: 'ACTIVE',
    invited: 'INVITED',
    disabled: 'DISABLED'
  }
  const prismaStatus = statusMap[status]

  return prisma.$transaction(async (tx) => {
    const where = {
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } }
            ]
          }
        : {}),
      ...(prismaStatus ? { status: prismaStatus } : {})
    }

    const [items, total] = await Promise.all([
      tx.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      tx.user.count({ where })
    ])

    const mappedItems = items.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role.toLowerCase() as 'admin' | 'editor' | 'viewer',
      status: item.status.toLowerCase() as 'active' | 'invited' | 'disabled',
      createdAt: item.createdAt.toISOString()
    }))

    const response = toUsersResponse(
      mappedItems,
      total,
      page,
      pageSize
    )

    validateUsersResponse(response)
    return apiSuccess(response)
  })
})
