import { computed, toValue } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ReportMetrics, ReportRange } from '#shared/dashboard-reports'
import { DASHBOARD_REPORT_GRIDS, DASHBOARD_REPORT_LABELS, DASHBOARD_REPORT_THEME } from '~/constants/dashboard-reports'

type MaybeRefOrGetter<T> = T | Ref<T> | ComputedRef<T> | (() => T)

export function useDashboardReportCharts(options: {
  currentMetrics: MaybeRefOrGetter<ReportMetrics>
  reportRange: MaybeRefOrGetter<ReportRange>
}) {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const palette = computed(() => {
    return isDark.value
      ? [...DASHBOARD_REPORT_THEME.palette.dark]
      : [...DASHBOARD_REPORT_THEME.palette.light]
  })
  const axisTextColor = computed(() => (isDark.value ? DASHBOARD_REPORT_THEME.axisText.dark : DASHBOARD_REPORT_THEME.axisText.light))
  const splitLineColor = computed(() => (isDark.value ? DASHBOARD_REPORT_THEME.splitLine.dark : DASHBOARD_REPORT_THEME.splitLine.light))
  const tooltipBg = computed(() => (isDark.value ? DASHBOARD_REPORT_THEME.tooltip.dark.background : DASHBOARD_REPORT_THEME.tooltip.light.background))
  const tooltipText = computed(() => (isDark.value ? DASHBOARD_REPORT_THEME.tooltip.dark.text : DASHBOARD_REPORT_THEME.tooltip.light.text))

  const trendLabels = computed(() => {
    const reportRange = toValue(options.reportRange)
    return DASHBOARD_REPORT_LABELS[reportRange]
  })

  const trendOption = computed<EChartsOption>(() => {
    const currentMetrics = toValue(options.currentMetrics)
    return {
      color: palette.value,
      textStyle: { color: axisTextColor.value },
      grid: DASHBOARD_REPORT_GRIDS.trend,
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
      grid: DASHBOARD_REPORT_GRIDS.revenue,
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
