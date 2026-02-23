import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { createDefaultReportResponse, DEFAULT_REPORT_METRICS, REPORT_RANGES } from '#shared/dashboard-reports'
import type { ReportMetrics, ReportRange, ReportResponse } from '#shared/dashboard-reports'

const fallbackMetrics: Record<ReportRange, ReportMetrics> = DEFAULT_REPORT_METRICS

export function useDashboardReports() {
  const { data, error, refresh } = useFetch<ReportResponse>(useApiPath('/api/dashboard/reports'), {
    default: () => createDefaultReportResponse()
  })

  const isInitialLoading = ref(true)
  const isSectionLoading = ref(false)
  const reportRange = ref<ReportRange>('Last 30 days')
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const palette = computed(() => {
    if (isDark.value) {
      return ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']
    }
    return ['#2563eb', '#059669', '#d97706', '#db2777', '#7c3aed']
  })
  const axisTextColor = computed(() => (isDark.value ? '#cbd5e1' : '#334155'))
  const splitLineColor = computed(() => (isDark.value ? 'rgba(148,163,184,0.25)' : 'rgba(51,65,85,0.18)'))
  const tooltipBg = computed(() => (isDark.value ? '#0f172a' : '#ffffff'))
  const tooltipText = computed(() => (isDark.value ? '#e2e8f0' : '#0f172a'))

  const currentMetrics = computed<ReportMetrics>(() => {
    const source = data.value?.metrics?.[reportRange.value] || fallbackMetrics[reportRange.value]
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
  const isUsingFallback = computed(() => !data.value?.metrics?.[reportRange.value])

  async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  async function showInitialLoading(task: () => Promise<unknown>) {
    isInitialLoading.value = true
    try {
      const start = Date.now()
      await task()
      const elapsed = Date.now() - start
      if (elapsed < 600) {
        await sleep(600 - elapsed)
      }
    } finally {
      isInitialLoading.value = false
    }
  }

  async function showSectionLoading(task?: () => Promise<unknown>) {
    isSectionLoading.value = true
    try {
      const start = Date.now()
      if (task) {
        await task()
      }
      const elapsed = Date.now() - start
      if (elapsed < 350) {
        await sleep(350 - elapsed)
      }
    } finally {
      isSectionLoading.value = false
    }
  }

  onMounted(async () => {
    await nextTick()
    await showInitialLoading(async () => {})
  })

  watch(reportRange, async () => {
    await showSectionLoading()
  })

  const trendLabels = computed(() => {
    if (reportRange.value === 'Last 7 days') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
    if (reportRange.value === 'Last 90 days') {
      return ['W1', 'W3', 'W5', 'W7', 'W9', 'W11', 'W13']
    }
    return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
  })

  const trendOption = computed<EChartsOption>(() => ({
    color: palette.value,
    textStyle: { color: axisTextColor.value },
    grid: { left: 36, right: 20, top: 28, bottom: 28 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendLabels.value,
      axisLabel: { color: axisTextColor.value },
      axisLine: { lineStyle: { color: splitLineColor.value } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: axisTextColor.value },
      splitLine: { lineStyle: { color: splitLineColor.value } }
    },
    series: [
      {
        type: 'line',
        data: currentMetrics.value.trend,
        smooth: true,
        areaStyle: { opacity: 0.15 }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg.value,
      borderWidth: 0,
      textStyle: { color: tooltipText.value }
    }
  }))

  const revenueBarOption = computed<EChartsOption>(() => ({
    color: palette.value,
    textStyle: { color: axisTextColor.value },
    grid: { left: 36, right: 12, top: 20, bottom: 24 },
    xAxis: {
      type: 'category',
      data: currentMetrics.value.revenueByChannel.map(item => item.name),
      axisLabel: { color: axisTextColor.value },
      axisLine: { lineStyle: { color: splitLineColor.value } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: axisTextColor.value },
      splitLine: { lineStyle: { color: splitLineColor.value } }
    },
    series: [
      {
        type: 'bar',
        data: currentMetrics.value.revenueByChannel.map(item => item.value),
        barMaxWidth: 36
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg.value,
      borderWidth: 0,
      textStyle: { color: tooltipText.value }
    }
  }))

  const acquisitionPieOption = computed<EChartsOption>(() => ({
    color: palette.value,
    legend: { bottom: 0 },
    textStyle: { color: axisTextColor.value },
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg.value,
      borderWidth: 0,
      textStyle: { color: tooltipText.value }
    },
    series: [
      {
        type: 'pie',
        radius: ['46%', '72%'],
        avoidLabelOverlap: true,
        data: currentMetrics.value.acquisitionMix
      }
    ]
  }))

  const availableRanges = computed(() => data.value?.ranges || REPORT_RANGES)

  return {
    availableRanges,
    currentMetrics,
    error,
    hasAnyData,
    isInitialLoading,
    isSectionLoading,
    isUsingFallback,
    refresh,
    reportRange,
    showSectionLoading,
    trendOption,
    revenueBarOption,
    acquisitionPieOption
  }
}
