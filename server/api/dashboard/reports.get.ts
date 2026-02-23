import { assertPermission } from '../../utils/rbac'
import { createDefaultReportResponse } from '#shared/dashboard-reports'

export default defineEventHandler((event) => {
  assertPermission(event, 'reports:view')

  return createDefaultReportResponse()
})
