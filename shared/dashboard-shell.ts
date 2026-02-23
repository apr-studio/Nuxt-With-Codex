import type { Permission } from './rbac'

export type DashboardNavItem = {
  label: string
  icon: string
  to: string
  permission: Permission
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Overview', icon: 'i-lucide-home', to: '/dashboard/overview', permission: 'dashboard:view' },
  { label: 'Users', icon: 'i-lucide-users', to: '/dashboard/users', permission: 'users:view' },
  { label: 'Reports', icon: 'i-lucide-bar-chart-3', to: '/dashboard/reports', permission: 'reports:view' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/dashboard/settings', permission: 'settings:view' }
]

export function getDashboardPageTitle(path: string): string {
  const match = DASHBOARD_NAV_ITEMS.find(item => path.startsWith(item.to))
  return match?.label || 'Overview'
}
