import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { createDefaultReportResponse, DEFAULT_REPORT_METRICS, REPORT_RANGES } from '#shared/dashboard-reports'
import { DASHBOARD_REPORT_LOADING } from '~/constants/dashboard-loading'
import { useApiFetch } from '~/composables/useApiFetch'
import type { ReportMetrics, ReportRange, ReportResponse } from '#shared/dashboard-reports'

// Report data source fallback for missing ranges.
const fallbackMetrics: Record<ReportRange, ReportMetrics> = DEFAULT_REPORT_METRICS

type UseDashboardReportsDataOptions = {
  initialMinLoadingMs?: number
  sectionMinLoadingMs?: number
}

// Manages report data, loading states, and range changes.
export function useDashboardReportsData(options: UseDashboardReportsDataOptions = {}) {
  const { payload, apiError, refresh } = useApiFetch<ReportResponse>(useApiPath('/api/dashboard/reports'), {
    defaultData: createDefaultReportResponse()
  })
  const initialMinLoadingMs = options.initialMinLoadingMs ?? DASHBOARD_REPORT_LOADING.initialMinMs
  const sectionMinLoadingMs = options.sectionMinLoadingMs ?? DASHBOARD_REPORT_LOADING.sectionMinMs

  // Loading states for first load vs. range switching.
  const isInitialLoading = ref(true)
  const isSectionLoading = ref(false)
  const reportRange = ref<ReportRange>('Last 30 days')

  // Current range metrics, falling back to defaults when missing.
  const currentMetrics = computed<ReportMetrics>(() => {
    const source = payload.value?.metrics?.[reportRange.value] || fallbackMetrics[reportRange.value]
    if (source) {
      return source
    }
    return {
      summary: [],
      trend: [],
      revenueByChannel: [],
      acquisitionMix: []
    }
  })

  const hasAnyData = computed(() => currentMetrics.value.summary.length > 0)
  const isUsingFallback = computed(() => !payload.value?.metrics?.[reportRange.value])

  async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  // Show full-page loading for at least the configured duration.
  async function showInitialLoading(task: () => Promise<unknown>) {
    isInitialLoading.value = true
    try {
      const start = Date.now()
      await task()
      const elapsed = Date.now() - start
      if (elapsed < initialMinLoadingMs) {
        await sleep(initialMinLoadingMs - elapsed)
      }
    } finally {
      isInitialLoading.value = false
    }
  }

  // Show partial loading while switching ranges or refreshing.
  async function showSectionLoading(task?: () => Promise<unknown>) {
    isSectionLoading.value = true
    try {
      const start = Date.now()
      if (task) {
        await task()
      }
      const elapsed = Date.now() - start
      if (elapsed < sectionMinLoadingMs) {
        await sleep(sectionMinLoadingMs - elapsed)
      }
    } finally {
      isSectionLoading.value = false
    }
  }

  // Ensure initial overlay runs once on mount.
  onMounted(async () => {
    await nextTick()
    await showInitialLoading(async () => {})
  })

  // Range changes trigger a section-level loading state.
  watch(reportRange, async () => {
    await showSectionLoading()
  })

  const availableRanges = computed(() => payload.value?.ranges || REPORT_RANGES)

  return {
    availableRanges,
    currentMetrics,
    apiError,
    hasAnyData,
    isInitialLoading,
    isSectionLoading,
    isUsingFallback,
    refresh,
    reportRange,
    showSectionLoading
  }
}
