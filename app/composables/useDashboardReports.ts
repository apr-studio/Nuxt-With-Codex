import { useDashboardReportCharts } from '~/composables/useDashboardReportCharts'
import { useDashboardReportsData } from '~/composables/useDashboardReportsData'

// Orchestrates report data fetching and chart option generation.
export function useDashboardReports() {
  const data = useDashboardReportsData()
  const charts = useDashboardReportCharts({
    currentMetrics: data.currentMetrics,
    reportRange: data.reportRange
  })

  return {
    ...data,
    ...charts
  }
}
