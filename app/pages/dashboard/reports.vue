<script setup lang="ts">
definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'reports:view'
})

const reportRange = ref('Last 30 days')

const summaryCards = [
  { name: 'Conversion Rate', value: '4.8%', change: '+0.6%' },
  { name: 'Avg Session', value: '06:21', change: '+0:42' },
  { name: 'Retention D30', value: '39%', change: '+2.1%' }
]

const channels = [
  { name: 'Organic Search', value: 61 },
  { name: 'Paid Ads', value: 22 },
  { name: 'Referral', value: 11 },
  { name: 'Direct', value: 6 }
]
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
              :items="['Last 7 days', 'Last 30 days', 'Last 90 days']"
              class="w-44"
            />
          </div>
        </template>

        <div class="grid gap-4 md:grid-cols-3">
          <UCard
            v-for="card in summaryCards"
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

      <UCard>
        <template #header>
          <h3 class="font-semibold">
            Acquisition Mix
          </h3>
        </template>

        <div class="space-y-4">
          <div
            v-for="channel in channels"
            :key="channel.name"
            class="space-y-1"
          >
            <div class="flex items-center justify-between text-sm">
              <span>{{ channel.name }}</span>
              <span class="text-muted">{{ channel.value }}%</span>
            </div>
            <UProgress :model-value="channel.value" />
          </div>
        </div>
      </UCard>
    </div>
  </DashboardStableShell>
</template>
