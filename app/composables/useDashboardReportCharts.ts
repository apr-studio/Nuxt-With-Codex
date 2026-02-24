import { computed, toValue } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ReportMetrics, ReportRange } from '#shared/dashboard-reports'

type MaybeRefOrGetter<T> = T | Ref<T> | ComputedRef<T> | (() => T)

export function useDashboardReportCharts(options: {
  currentMetrics: MaybeRefOrGetter<ReportMetrics>
  reportRange: MaybeRefOrGetter<ReportRange>
}) {
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

  const trendLabels = computed(() => {
    const reportRange = toValue(options.reportRange)
    if (reportRange === 'Last 7 days') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
    if (reportRange === 'Last 90 days') {
      return ['W1', 'W3', 'W5', 'W7', 'W9', 'W11', 'W13']
    }
    return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
  })

  const trendOption = computed<EChartsOption>(() => {
    const currentMetrics = toValue(options.currentMetrics)
    return {
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
          data: currentMetrics.trend,
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
    }
  })

  const revenueBarOption = computed<EChartsOption>(() => {
    const currentMetrics = toValue(options.currentMetrics)
    return {
      color: palette.value,
      textStyle: { color: axisTextColor.value },
      grid: { left: 36, right: 12, top: 20, bottom: 24 },
      xAxis: {
        type: 'category',
        data: currentMetrics.revenueByChannel.map(item => item.name),
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
          data: currentMetrics.revenueByChannel.map(item => item.value),
          barMaxWidth: 36
        }
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg.value,
        borderWidth: 0,
        textStyle: { color: tooltipText.value }
      }
    }
  })

  const acquisitionPieOption = computed<EChartsOption>(() => {
    const currentMetrics = toValue(options.currentMetrics)
    return {
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
          data: currentMetrics.acquisitionMix
        }
      ]
    }
  })

  return {
    trendOption,
    revenueBarOption,
    acquisitionPieOption
  }
}
