import { listUsers } from '../../utils/mock-db'

export default defineEventHandler(() => {
  const users = listUsers()
  const activeUsers = users.filter(user => user.status === 'active').length
  const invitedUsers = users.filter(user => user.status === 'invited').length
  const disabledUsers = users.filter(user => user.status === 'disabled').length

  return [
    { title: 'Monthly Revenue', value: '$128,450', trend: '+8.4%', icon: 'i-lucide-wallet' },
    { title: 'Active Users', value: String(activeUsers), trend: `+${Math.max(1, Math.floor(activeUsers / 10))}%`, icon: 'i-lucide-users' },
    { title: 'Invited Users', value: String(invitedUsers), trend: '+2.0%', icon: 'i-lucide-user-plus' },
    { title: 'Disabled Users', value: String(disabledUsers), trend: '-1.2%', icon: 'i-lucide-user-x' }
  ]
})
