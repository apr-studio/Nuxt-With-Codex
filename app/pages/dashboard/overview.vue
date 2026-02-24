<script setup lang="ts">
import type { ActivityResponse, KpiItem } from '#shared/dashboard-types'

definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

const { payload: kpis, apiError: kpiApiError } = useApiFetch<KpiItem[]>(useApiPath('/api/dashboard/stats'), {
  defaultData: []
})
const { payload: activity, apiError: activityApiError } = useApiFetch<ActivityResponse>(useApiPath('/api/dashboard/activity'))
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-6">
      <DashboardApiErrorAlert
        v-if="kpiApiError || activityApiError"
        title="Dashboard API error"
        :message="kpiApiError?.message || activityApiError?.message || 'Failed to load dashboard data.'"
      />

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UCard
          v-for="kpi in (kpis || [])"
          :key="kpi.title"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted">
                {{ kpi.title }}
              </p>
              <p class="text-2xl font-semibold mt-1">
                {{ kpi.value }}
              </p>
              <UBadge
                color="primary"
                variant="subtle"
                class="mt-2"
              >
                {{ kpi.trend }}
              </UBadge>
            </div>
            <UAvatar
              :icon="kpi.icon"
              color="neutral"
              variant="soft"
            />
          </div>
        </UCard>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <UCard class="xl:col-span-2">
          <template #header>
            <h2 class="font-semibold">
              Recent Activity
            </h2>
          </template>
          <UAccordion :items="activity?.activityItems || []" />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold">
              Alerts
            </h2>
          </template>

          <div class="space-y-3">
            <UAlert
              v-for="alert in (activity?.alertItems || [])"
              :key="alert.title"
              :title="alert.title"
              :description="alert.description"
              :color="alert.color"
              variant="subtle"
            />
          </div>
        </UCard>
      </div>
    </div>
  </DashboardStableShell>
</template>
