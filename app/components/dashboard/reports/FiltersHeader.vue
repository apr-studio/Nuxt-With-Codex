<script setup lang="ts">
import type { ReportRange } from '#shared/dashboard-reports'

const props = defineProps<{
  ranges: readonly ReportRange[]
  range: ReportRange
  isUsingFallback: boolean
}>()

const emit = defineEmits<{
  'update:range': [value: ReportRange]
  'refresh': []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <h2 class="font-semibold">
        Reports
      </h2>
      <UBadge
        v-if="isUsingFallback"
        color="warning"
        variant="subtle"
      >
        Fallback Data
      </UBadge>
    </div>
    <div class="flex items-center gap-2">
      <USelect
        :model-value="props.range"
        :items="[...props.ranges]"
        class="w-44"
        @update:model-value="emit('update:range', $event as ReportRange)"
      />
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        @click="emit('refresh')"
      >
        Refresh
      </UButton>
    </div>
  </div>
</template>
