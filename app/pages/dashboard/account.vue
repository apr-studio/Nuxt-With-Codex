<script setup lang="ts">
import { useDashboardRole } from '~/composables/useDashboardRole'
import type { AuthMeResponse, AuthProfileUpdateBody } from '#shared/schemas/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

const toast = useToast()
const { generatePassword, copyText } = usePasswordTools()
const { currentUser, refreshCurrentUser } = useDashboardRole()

const formState = reactive({
  name: '',
  avatarUrl: '',
  currentPassword: '',
  newPassword: ''
})

watch(currentUser, (user) => {
  formState.name = user?.name || ''
  formState.avatarUrl = user?.avatarUrl ?? ''
}, { immediate: true })

const profileMutation = useApiMutation<AuthMeResponse, AuthProfileUpdateBody>({
  url: useApiPath('/api/auth/profile'),
  method: 'PUT',
  toastOptions: {
    success: 'Profile updated',
    error: 'Profile update failed'
  }
})

const isSubmitting = computed(() => profileMutation.pending.value)
const avatarPreviewSrc = computed(() => formState.avatarUrl || undefined)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

function clearAvatar() {
  formState.avatarUrl = ''
}

function openAvatarFilePicker() {
  avatarInputRef.value?.click()
}

function onAvatarFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  if (!file.type.startsWith('image/')) {
    toast.add({
      color: 'warning',
      title: 'Invalid file type',
      description: 'Please select an image file.'
    })
    input.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      color: 'warning',
      title: 'File too large',
      description: 'Please select an image under 2MB.'
    })
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      formState.avatarUrl = reader.result
    }
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function fillGeneratedNewPassword() {
  formState.newPassword = generatePassword({ length: 14 })
}

async function copyCurrentPassword() {
  await copyText(formState.currentPassword, 'Current password')
}

async function copyNewPassword() {
  await copyText(formState.newPassword, 'New password')
}

async function submit() {
  const body: AuthProfileUpdateBody = {}
  if (formState.name.trim()) {
    body.name = formState.name.trim()
  }
  body.avatarUrl = formState.avatarUrl.trim() || null
  if (formState.currentPassword || formState.newPassword) {
    body.currentPassword = formState.currentPassword
    body.newPassword = formState.newPassword
  }
  const result = await profileMutation.mutate({ body })
  if (!result) {
    return
  }
  await refreshCurrentUser()
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
          Update your display name, avatar image, and password.
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

      <UFormField
        label="Avatar Image"
        description="Upload an image (max 2MB) or provide an image URL."
      >
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="formState.name || 'User'"
              :src="avatarPreviewSrc"
              :text="(formState.name || 'U').slice(0, 2).toUpperCase()"
              size="lg"
            />
            <div class="flex flex-wrap gap-2">
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarFileChange"
              >
              <UButton
                type="button"
                color="neutral"
                variant="outline"
                icon="i-lucide-upload"
                @click="openAvatarFilePicker"
              >
                Upload image
              </UButton>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="clearAvatar"
              >
                Remove
              </UButton>
            </div>
          </div>
          <UInput
            v-model="formState.avatarUrl"
            placeholder="https://example.com/avatar.png"
          />
        </div>
      </UFormField>

      <UFormField label="Email">
        <UInput
          :model-value="currentUser?.email || ''"
          disabled
        />
      </UFormField>

      <UFormField label="Current Password">
        <div class="space-y-2">
          <UInput
            v-model="formState.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            placeholder="Required if changing password"
          />
          <div class="flex flex-wrap gap-2">
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-copy"
              @click="copyCurrentPassword"
            >
              Copy
            </UButton>
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="ghost"
              :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              {{ showCurrentPassword ? 'Hide' : 'Show' }}
            </UButton>
          </div>
        </div>
      </UFormField>

      <UFormField label="New Password">
        <div class="space-y-2">
          <UInput
            v-model="formState.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="At least 8 characters"
          />
          <div class="flex flex-wrap gap-2">
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-wand-sparkles"
              @click="fillGeneratedNewPassword"
            >
              Generate
            </UButton>
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-copy"
              @click="copyNewPassword"
            >
              Copy
            </UButton>
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="ghost"
              :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showNewPassword = !showNewPassword"
            >
              {{ showNewPassword ? 'Hide' : 'Show' }}
            </UButton>
          </div>
        </div>
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
