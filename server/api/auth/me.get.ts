import { getPermissions, getRole } from '../../utils/rbac'

export default defineEventHandler((event) => {
  const role = getRole(event)
  return {
    role,
    permissions: getPermissions(role)
  }
})
