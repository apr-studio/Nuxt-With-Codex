<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserRole, UserStatus } from '~/features/dashboard/types/types'

type FormError = {
  name?: string
  message: string
}

// User create/edit modal with form validation.
const props = defineProps<{
  open: boolean
  title: string
  canCreate: boolean
  canUpdate: boolean
  isEditing: boolean
  isMutating: boolean
  formState: {
    name: string
    email: string
    role: UserRole
    status: UserStatus
  }
  validateForm: (state: {
    name: string
    email: string
    role: UserRole
    status: UserStatus
  }) => FormError[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [value: {
    name: string
    email: string
    role: UserRole
    status: UserStatus
  }]
}>()

// Local copy of form state to avoid mutating props directly.
const localForm = reactive({
  name: '',
  email: '',
  role: 'viewer' as UserRole,
  status: 'active' as UserStatus
})

// Sync local form whenever modal opens or parent form state changes.
watch(
  () => [props.open, props.formState.name, props.formState.email, props.formState.role, props.formState.status] as const,
  () => {
    localForm.name = props.formState.name
    localForm.email = props.formState.email
    localForm.role = props.formState.role
    localForm.status = props.formState.status
  },
  { immediate: true }
)
</script>

<template>
  <UModal
    :open="props.open"
    :title="props.title"
    :description="props.canCreate || props.canUpdate ? 'Submit to save this user record.' : 'You do not have permission to save changes.'"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        :state="localForm"
        :validate="props.validateForm"
        class="space-y-4"
        @submit="emit('submit', { ...localForm })"
      >
        <UFormField
          label="Name"
          name="name"
        >
          <UInput v-model="localForm.name" />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="localForm.email"
            type="email"
          />
        </UFormField>

        <UFormField
          label="Role"
          name="role"
        >
          <USelect
            v-model="localForm.role"
            :items="['admin', 'editor', 'viewer']"
          />
        </UFormField>

        <UFormField
          label="Status"
          name="status"
        >
          <USelect
            v-model="localForm.status"
            :items="['active', 'invited', 'disabled']"
          />
        </UFormField>

        <div class="flex items-center gap-2 pt-2">
          <UButton
            type="submit"
            :disabled="props.isEditing ? !props.canUpdate : !props.canCreate"
            :loading="props.isMutating"
            icon="i-lucide-save"
          >
            Save
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            @click="emit('update:open', false)"
          >
            Cancel
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
