import { assertPermission } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { toDashboardStats, validateDashboardStatsResponse } from '../../schemas/dashboard'
import { prisma } from '../../utils/prisma'

export default defineApiHandler(async (event) => {
  assertPermission(event, 'dashboard:view')

  const [activeUsers, invitedUsers, disabledUsers] = await Promise.all([
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { status: 'INVITED' } }),
    prisma.user.count({ where: { status: 'DISABLED' } })
  ])

  const response = toDashboardStats([
    { title: 'Monthly Revenue', value: '$128,450', trend: '+8.4%', icon: 'i-lucide-wallet' },
    { title: 'Active Users', value: String(activeUsers), trend: `+${Math.max(1, Math.floor(activeUsers / 10))}%`, icon: 'i-lucide-users' },
    { title: 'Invited Users', value: String(invitedUsers), trend: '+2.0%', icon: 'i-lucide-user-plus' },
    { title: 'Disabled Users', value: String(disabledUsers), trend: '-1.2%', icon: 'i-lucide-user-x' }
  ])

  validateDashboardStatsResponse(response)
  return apiSuccess(response)
})
