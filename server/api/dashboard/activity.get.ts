export default defineEventHandler(() => {
  return {
    activityItems: [
      { label: 'New plan upgrade by Acme Inc.', content: '2 minutes ago' },
      { label: 'Billing retry succeeded for order #A117', content: '11 minutes ago' },
      { label: 'New user invited to Analytics workspace', content: '35 minutes ago' }
    ],
    alertItems: [
      { title: 'API latency above target', description: '95th percentile crossed 380ms.', color: 'warning' },
      { title: 'Deploy checks healthy', description: 'All production monitors are green.', color: 'success' }
    ]
  }
})
