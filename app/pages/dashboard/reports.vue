<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'

definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'reports:view'
})

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent
])

type SummaryCard = {
  name: string
  value: string
  change: string
}

type DataPoint = {
  name: string
  value: number
}

type ReportMetrics = {
  summary: SummaryCard[]
  trend: number[]
  revenueByChannel: DataPoint[]
  acquisitionMix: DataPoint[]
}

type ReportResponse = {
  ranges: string[]
  metrics: Record<string, ReportMetrics>
}

const { data } = await useFetch<ReportResponse>(useApiPath('/api/dashboard/reports'))
const reportRange = ref('Last 30 days')

const currentMetrics = computed<ReportMetrics>(() => {
  const source = data.value?.metrics?.[reportRange.value]
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
  tooltip: { trigger: 'axis' },
  grid: { left: 36, right: 20, top: 28, bottom: 28 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: trendLabels.value
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { opacity: 0.25 } }
  },
  series: [
    {
      type: 'line',
      data: currentMetrics.value.trend,
      smooth: true,
      areaStyle: { opacity: 0.15 }
    }
  ]
}))

const revenueBarOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 36, right: 12, top: 20, bottom: 24 },
  xAxis: {
    type: 'category',
    data: currentMetrics.value.revenueByChannel.map(item => item.name)
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { opacity: 0.25 } }
  },
  series: [
    {
      type: 'bar',
      data: currentMetrics.value.revenueByChannel.map(item => item.value),
      barMaxWidth: 36
    }
  ]
}))

const acquisitionPieOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['46%', '72%'],
      avoidLabelOverlap: true,
      data: currentMetrics.value.acquisitionMix
    }
  ]
}))
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-4">
      <UCard>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-semibold">
              Reports
            </h2>
            <USelect
              v-model="reportRange"
              :items="data?.ranges || ['Last 7 days', 'Last 30 days', 'Last 90 days']"
              class="w-44"
            />
          </div>
        </template>

        <div class="grid gap-4 md:grid-cols-3">
          <UCard
            v-for="card in currentMetrics.summary"
            :key="card.name"
            class="bg-elevated/40"
          >
            <p class="text-sm text-muted">
              {{ card.name }}
            </p>
            <p class="text-2xl font-semibold mt-1">
              {{ card.value }}
            </p>
            <UBadge
              color="success"
              variant="subtle"
              class="mt-2"
            >
              {{ card.change }}
            </UBadge>
          </UCard>
        </div>
      </UCard>

      <div class="grid gap-4 xl:grid-cols-2">
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              Traffic Trend
            </h3>
          </template>
          <ClientOnly>
            <VChart
              :option="trendOption"
              class="h-72 w-full"
              autoresize
            />
          </ClientOnly>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="font-semibold">
              Revenue by Channel
            </h3>
          </template>
          <ClientOnly>
            <VChart
              :option="revenueBarOption"
              class="h-72 w-full"
              autoresize
            />
          </ClientOnly>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <h3 class="font-semibold">
            Acquisition Mix
          </h3>
        </template>
        <ClientOnly>
          <VChart
            :option="acquisitionPieOption"
            class="h-80 w-full"
            autoresize
          />
        </ClientOnly>
      </UCard>
    </div>
  </DashboardStableShell>
</template>
