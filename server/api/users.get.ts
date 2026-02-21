import { getQuery } from 'h3'
import { assertPermission } from '../utils/rbac'
import { prisma } from '../utils/prisma'

export default defineEventHandler((event) => {
  assertPermission(event, 'users:view')

  const query = getQuery(event)
  const q = String(query.q || '').trim().toLowerCase()
  const status = String(query.status || 'all').toLowerCase()
  const page = Math.max(1, Number(query.page || 1))
  const pageSize = Math.max(1, Math.min(50, Number(query.pageSize || 5)))
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

    return {
      items: items.map(item => ({
        ...item,
        role: item.role.toLowerCase(),
        status: item.status.toLowerCase()
      })),
      total,
      page,
      pageSize
    }
  })
})
