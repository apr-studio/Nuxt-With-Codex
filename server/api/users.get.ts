import { getQuery } from 'h3'
import { listUsers, type UserStatus } from '../utils/mock-db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim().toLowerCase()
  const status = String(query.status || 'all') as UserStatus | 'all'
  const page = Math.max(1, Number(query.page || 1))
  const pageSize = Math.max(1, Math.min(50, Number(query.pageSize || 5)))

  const filtered = listUsers().filter((user) => {
    const matchesQ = !q || `${user.name} ${user.email}`.toLowerCase().includes(q)
    const matchesStatus = status === 'all' || user.status === status
    return matchesQ && matchesStatus
  })

  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return {
    items,
    total: filtered.length,
    page,
    pageSize
  }
})
