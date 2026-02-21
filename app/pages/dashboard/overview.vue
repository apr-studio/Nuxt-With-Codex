<script setup lang="ts">
const kpis = [
  {
    title: 'Monthly Revenue',
    value: '$128,450',
    trend: '+8.4%',
    icon: 'i-lucide-wallet'
  },
  {
    title: 'Active Users',
    value: '3,284',
    trend: '+5.1%',
    icon: 'i-lucide-users'
  },
  {
    title: 'Open Tickets',
    value: '42',
    trend: '-11.3%',
    icon: 'i-lucide-life-buoy'
  },
  {
    title: 'Error Rate',
    value: '0.18%',
    trend: '-0.04%',
    icon: 'i-lucide-shield-check'
  }
]

const activityItems = [
  { label: 'New plan upgrade by Acme Inc.', content: '2 minutes ago' },
  { label: 'Billing retry succeeded for order #A117', content: '11 minutes ago' },
  { label: 'New user invited to Analytics workspace', content: '35 minutes ago' }
]

const alertItems = [
  { title: 'API latency above target', description: '95th percentile crossed 380ms.', color: 'warning' as const },
  { title: 'Deploy checks healthy', description: 'All production monitors are green.', color: 'success' as const }
]
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UCard
          v-for="kpi in kpis"
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
          <UAccordion :items="activityItems" />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold">
              Alerts
            </h2>
          </template>

          <div class="space-y-3">
            <UAlert
              v-for="alert in alertItems"
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
