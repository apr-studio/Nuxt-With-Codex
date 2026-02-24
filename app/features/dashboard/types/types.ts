export type KpiItem = {
  title: string
  value: string
  trend: string
  icon: string
}

export type ActivityItem = {
  label: string
  content: string
}

export type AlertItem = {
  title: string
  description: string
  color: 'warning' | 'success'
}

export type ActivityResponse = {
  activityItems: ActivityItem[]
  alertItems: AlertItem[]
}

export type UserStatus = 'active' | 'invited' | 'disabled'
export type UserRole = 'admin' | 'editor' | 'viewer'

export type UserRow = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export type UsersResponse = {
  items: UserRow[]
  total: number
  page: number
  pageSize: number
}
