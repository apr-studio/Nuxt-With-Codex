<script setup lang="ts">
definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

type KpiItem = {
  title: string
  value: string
  trend: string
  icon: string
}

type ActivityResponse = {
  activityItems: { label: string, content: string }[]
  alertItems: { title: string, description: string, color: 'warning' | 'success' }[]
}

const { data: kpis } = await useFetch<KpiItem[]>(useApiPath('/api/dashboard/stats'))
const { data: activity } = await useFetch<ActivityResponse>(useApiPath('/api/dashboard/activity'))
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-6">
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
