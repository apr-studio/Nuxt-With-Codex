<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import EChartClient from '~/components/charts/EChartClient.vue'

defineProps<{
  title: string
  option: EChartsOption
  isLoading: boolean
  isUsingFallback: boolean
  heightClass: string
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-semibold">
          {{ title }}
        </h3>
        <UBadge
          v-if="isUsingFallback"
          color="warning"
          variant="outline"
          size="sm"
        >
          Fallback
        </UBadge>
      </div>
    </template>
    <USkeleton
      v-if="isLoading"
      :class="heightClass"
    />
    <ClientOnly v-else>
      <EChartClient
        :option="option"
        :class="heightClass"
      />
    </ClientOnly>
  </UCard>
</template>
