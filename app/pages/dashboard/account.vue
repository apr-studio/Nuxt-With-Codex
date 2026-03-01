<script setup lang="ts">
import { useDashboardRole } from '~/composables/useDashboardRole'

definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

const { currentUser } = useDashboardRole()

const formState = reactive({
  name: '',
  currentPassword: '',
  newPassword: ''
})

watch(currentUser, (user) => {
  formState.name = user?.name || ''
}, { immediate: true })

const profileMutation = useApiMutation({
  url: useApiPath('/api/auth/profile'),
  method: 'PUT',
  toastOptions: {
    success: 'Profile updated',
    error: 'Profile update failed'
  }
})

const isSubmitting = computed(() => profileMutation.pending.value)

async function submit() {
  const body: { name?: string, currentPassword?: string, newPassword?: string } = {}
  if (formState.name.trim()) {
    body.name = formState.name.trim()
  }
  if (formState.currentPassword || formState.newPassword) {
    body.currentPassword = formState.currentPassword
    body.newPassword = formState.newPassword
  }
  const result = await profileMutation.mutate({ body })
  if (!result) {
    return
  }
  formState.currentPassword = ''
  formState.newPassword = ''
}
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="font-semibold">
          Account Settings
        </h2>
        <p class="text-sm text-muted mt-1">
          Update your display name and password.
        </p>
      </div>
    </template>

    <UForm
      :state="formState"
      class="space-y-4"
      @submit="submit"
    >
      <UFormField label="Name">
        <UInput
          v-model="formState.name"
          placeholder="Your display name"
        />
      </UFormField>

      <UFormField label="Email">
        <UInput
          :model-value="currentUser?.email || ''"
          disabled
        />
      </UFormField>

      <UFormField label="Current Password">
        <UInput
          v-model="formState.currentPassword"
          type="password"
          placeholder="Required if changing password"
        />
      </UFormField>

      <UFormField label="New Password">
        <UInput
          v-model="formState.newPassword"
          type="password"
          placeholder="At least 8 characters"
        />
      </UFormField>

      <UButton
        type="submit"
        icon="i-lucide-save"
        :loading="isSubmitting"
      >
        Save Changes
      </UButton>
    </UForm>
  </UCard>
</template>
