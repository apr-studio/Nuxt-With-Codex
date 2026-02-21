<script setup lang="ts">
definePageMeta({
  middleware: ['dashboard-role'],
  requiresAdmin: true
})

const state = reactive({
  workspaceName: 'Nuxt Admin Workspace',
  timezone: 'Asia/Taipei',
  alertEmail: 'ops@example.com',
  digest: 'Weekly',
  channels: ['Email'],
  incidentMode: true
})

const timezoneOptions = ['Asia/Taipei', 'UTC', 'America/Los_Angeles', 'Europe/Berlin']
const digestOptions = ['Daily', 'Weekly', 'Monthly']
const channelOptions = ['Email', 'SMS', 'Push']
</script>

<template>
  <DashboardStableShell>
    <UCard>
      <template #header>
        <h2 class="font-semibold">
          Settings
        </h2>
      </template>

      <UForm
        :state="state"
        class="space-y-4"
      >
        <UFormField label="Workspace Name">
          <UInput v-model="state.workspaceName" />
        </UFormField>

        <UFormField label="Timezone">
          <USelect
            v-model="state.timezone"
            :items="timezoneOptions"
          />
        </UFormField>

        <UFormField label="Alert Email">
          <UInput
            v-model="state.alertEmail"
            type="email"
            placeholder="ops@example.com"
          />
        </UFormField>

        <UFormField label="Digest">
          <URadioGroup
            v-model="state.digest"
            :items="digestOptions"
          />
        </UFormField>

        <UFormField label="Notification Channels">
          <UCheckboxGroup
            v-model="state.channels"
            :items="channelOptions"
          />
        </UFormField>

        <USwitch
          v-model="state.incidentMode"
          label="Enable incident mode"
        />

        <USeparator />

        <div class="flex gap-2">
          <UButton icon="i-lucide-save">
            Save Settings
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
          >
            Reset
          </UButton>
        </div>
      </UForm>
    </UCard>
  </DashboardStableShell>
</template>
