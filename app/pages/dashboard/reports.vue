<script setup lang="ts">
import { DASHBOARD_REPORT_CHART_HEIGHTS } from '~/constants/dashboard-reports'
import { useDashboardReports } from '~/composables/useDashboardReports'

// Role-guarded reports page.
definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'reports:view'
})

// Combined data + chart options for the report UI.
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
      <!-- Full-screen overlay shown on first load only. -->
      <DashboardReportsInitialOverlay v-if="isInitialLoading" />

      <UCard>
        <template #header>
          <!-- Filters + range switcher. -->
          <DashboardReportsFiltersHeader
            :range="reportRange"
            :ranges="availableRanges"
            :is-using-fallback="isUsingFallback"
            @update:range="reportRange = $event"
            @refresh="showSectionLoading(refresh)"
          />
        </template>

        <!-- Inline status and fallback hints. -->
        <DashboardReportsStatusAlert
          :error-message="apiError?.message || ''"
          :has-any-data="hasAnyData"
          :is-using-fallback="isUsingFallback"
        />

        <!-- Summary KPI cards for the active range. -->
        <DashboardReportsSummaryCards
          :cards="currentMetrics.summary"
          :is-loading="isSectionLoading"
        />
      </UCard>

      <!-- Trend + revenue charts. -->
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

      <!-- Acquisition mix chart. -->
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
