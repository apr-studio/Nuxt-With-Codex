import { assertPermission } from '../../utils/rbac'
import { defineApiHandler } from '../../utils/api-handler'
import { apiSuccess } from '../../utils/api-response'
import { toDashboardActivity, validateDashboardActivityResponse } from '../../schemas/dashboard'

export default defineApiHandler((event) => {
  assertPermission(event, 'dashboard:view')

  const response = toDashboardActivity({
    activityItems: [
      { label: 'New plan upgrade by Acme Inc.', content: '2 minutes ago' },
      { label: 'Billing retry succeeded for order #A117', content: '11 minutes ago' },
      { label: 'New user invited to Analytics workspace', content: '35 minutes ago' }
    ],
    alertItems: [
      { title: 'API latency above target', description: '95th percentile crossed 380ms.', color: 'warning' },
      { title: 'Deploy checks healthy', description: 'All production monitors are green.', color: 'success' }
    ]
  })

  validateDashboardActivityResponse(response)
  return apiSuccess(response)
})
