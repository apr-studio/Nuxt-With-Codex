<script setup lang="ts">
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

const props = defineProps<{
  option: EChartsOption
}>()

const rootEl = ref<HTMLElement | null>(null)
let chart: ECharts | null = null
let observer: ResizeObserver | null = null
const errorMessage = ref('')
let retryTimer: ReturnType<typeof setTimeout> | null = null

function getSize(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return {
    width: Math.floor(rect.width),
    height: Math.floor(rect.height)
  }
}

function scheduleRetry(attempt: number) {
  if (retryTimer) {
    clearTimeout(retryTimer)
  }
  retryTimer = setTimeout(() => {
    renderChart(attempt + 1)
  }, 80)
}

function renderChart(attempt = 0) {
  if (!rootEl.value) {
    return
  }
  const { width, height } = getSize(rootEl.value)
  if (width < 10 || height < 10) {
    if (attempt < 40) {
      scheduleRetry(attempt)
    }
    return
  }

  try {
    if (!chart) {
      chart = echarts.init(rootEl.value, undefined, {
        renderer: 'canvas',
        width,
        height
      })
    } else {
      chart.resize({ width, height })
    }
    chart.setOption(props.option, true)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Chart render failed'
  }
}

onMounted(() => {
  renderChart()

  if (rootEl.value) {
    observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        renderChart()
      })
    })
    observer.observe(rootEl.value)
  }
})

watch(
  () => props.option,
  () => {
    renderChart()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
  observer?.disconnect()
  observer = null
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div class="h-full w-full">
    <div
      ref="rootEl"
      class="h-full w-full min-h-[220px]"
    />
    <p
      v-if="errorMessage"
      class="mt-2 text-xs text-error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
