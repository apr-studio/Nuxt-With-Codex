<script setup lang="ts">
import { DASHBOARD_REPORT_CHART_HEIGHTS } from '~/constants/dashboard-reports'
import { useDashboardReports } from '~/composables/useDashboardReports'

definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'reports:view'
})

const {
  availableRanges,
  apiError,
  acquisitionPieOption,
  currentMetrics,
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
          :error-message="apiError?.message || ''"
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
          :height-class="DASHBOARD_REPORT_CHART_HEIGHTS.trend"
        />

        <DashboardReportsChartCard
          title="Revenue by Channel"
          :option="revenueBarOption"
          :is-loading="isSectionLoading"
          :is-using-fallback="isUsingFallback"
          :height-class="DASHBOARD_REPORT_CHART_HEIGHTS.revenue"
        />
      </div>

      <DashboardReportsChartCard
        title="Acquisition Mix"
        :option="acquisitionPieOption"
        :is-loading="isSectionLoading"
        :is-using-fallback="isUsingFallback"
        :height-class="DASHBOARD_REPORT_CHART_HEIGHTS.acquisition"
      />
    </div>
  </DashboardStableShell>
</template>
