import { assertPermission } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { toDashboardReports, validateDashboardReportsResponse } from '../../schemas/dashboard'
import { createDefaultReportResponse } from '#shared/dashboard-reports'

export default defineApiHandler((event) => {
  assertPermission(event, 'reports:view')

  const response = toDashboardReports(createDefaultReportResponse())
  validateDashboardReportsResponse(response)
  return apiSuccess(response)
})
