<script setup lang="ts">
import { useDashboardReports } from '~/composables/useDashboardReports'

definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'reports:view'
})

const {
  availableRanges,
  acquisitionPieOption,
  currentMetrics,
  error,
  hasAnyData,
  isInitialLoading,
  isSectionLoading,
  isUsingFallback,
  refresh,
  reportRange,
  revenueBarOption,
  showSectionLoading,
  trendOption
} = useDashboardReports()
</script>

<template>
  <DashboardStableShell>
    <div class="relative space-y-4">
      <DashboardReportsInitialOverlay v-if="isInitialLoading" />

      <UCard>
        <template #header>
          <DashboardReportsFiltersHeader
            :range="reportRange"
            :ranges="availableRanges"
            :is-using-fallback="isUsingFallback"
            @update:range="reportRange = $event"
            @refresh="showSectionLoading(refresh)"
          />
        </template>

        <DashboardReportsStatusAlert
          :error="error"
          :has-any-data="hasAnyData"
          :is-using-fallback="isUsingFallback"
        />

        <DashboardReportsSummaryCards
          :cards="currentMetrics.summary"
          :is-loading="isSectionLoading"
        />
      </UCard>

      <div class="grid gap-4 xl:grid-cols-2">
        <DashboardReportsChartCard
          title="Traffic Trend"
          :option="trendOption"
          :is-loading="isSectionLoading"
          :is-using-fallback="isUsingFallback"
          height-class="h-72 w-full"
        />

        <DashboardReportsChartCard
          title="Revenue by Channel"
          :option="revenueBarOption"
          :is-loading="isSectionLoading"
          :is-using-fallback="isUsingFallback"
          height-class="h-72 w-full"
        />
      </div>

      <DashboardReportsChartCard
        title="Acquisition Mix"
        :option="acquisitionPieOption"
        :is-loading="isSectionLoading"
        :is-using-fallback="isUsingFallback"
        height-class="h-80 w-full"
      />
    </div>
  </DashboardStableShell>
</template>
