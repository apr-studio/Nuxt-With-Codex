<script setup lang="ts">
type UserStatus = 'active' | 'invited' | 'disabled'
type UserRole = 'owner' | 'admin' | 'member'

type UserRow = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

type UsersResponse = {
  items: UserRow[]
  total: number
  page: number
  pageSize: number
}

type FormError = {
  name?: string
  message: string
}

definePageMeta({
  middleware: ['dashboard-role']
})

const role = useCookie<'admin' | 'member'>('role', { default: () => 'admin' })
const isAdmin = computed(() => role.value === 'admin')
const usersApi = useApiPath('/api/users')

const query = ref('')
const statusFilter = ref<'all' | UserStatus>('all')
const page = ref(1)
const pageSize = 5

const queryParams = computed(() => ({
  q: query.value,
  status: statusFilter.value,
  page: page.value,
  pageSize
}))

const { data, pending, refresh } = await useFetch<UsersResponse>(usersApi, {
  query: queryParams
})

watch([query, statusFilter], () => {
  page.value = 1
})

const modalOpen = ref(false)
const editingUserId = ref<number | null>(null)
const actionError = ref('')

const formState = reactive({
  name: '',
  email: '',
  role: 'member' as UserRole,
  status: 'active' as UserStatus
})

const modalTitle = computed(() => editingUserId.value ? 'Edit User' : 'Create User')

function resetForm() {
  editingUserId.value = null
  formState.name = ''
  formState.email = ''
  formState.role = 'member'
  formState.status = 'active'
  actionError.value = ''
}

function openCreateModal() {
  resetForm()
  modalOpen.value = true
}

function openEditModal(user: UserRow) {
  editingUserId.value = user.id
  formState.name = user.name
  formState.email = user.email
  formState.role = user.role
  formState.status = user.status
  actionError.value = ''
  modalOpen.value = true
}

function validateForm(state: typeof formState): FormError[] {
  const errors: FormError[] = []

  if (!state.name || state.name.trim().length < 2) {
    errors.push({ name: 'name', message: 'Name must be at least 2 characters.' })
  }
  if (!state.email || !/^\S+@\S+\.\S+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Email format is invalid.' })
  }
  if (!['owner', 'admin', 'member'].includes(state.role)) {
    errors.push({ name: 'role', message: 'Role is invalid.' })
  }
  if (!['active', 'invited', 'disabled'].includes(state.status)) {
    errors.push({ name: 'status', message: 'Status is invalid.' })
  }

  return errors
}

async function submitForm() {
  actionError.value = ''
  try {
    if (editingUserId.value) {
      await $fetch(useApiPath(`/api/users/${editingUserId.value}`), {
        baseURL: useRuntimeConfig().app.baseURL,
        method: 'PUT',
        body: formState
      })
    } else {
      await $fetch(usersApi, {
        baseURL: useRuntimeConfig().app.baseURL,
        method: 'POST',
        body: formState
      })
    }

    modalOpen.value = false
    resetForm()
    await refresh()
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Failed to save user.'
  }
}

async function removeUser(id: number) {
  actionError.value = ''
  try {
    await $fetch(useApiPath(`/api/users/${id}`), {
      baseURL: useRuntimeConfig().app.baseURL,
      method: 'DELETE'
    })
    await refresh()
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Failed to delete user.'
  }
}
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-4">
      <UCard>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="font-semibold">
              Users
            </h2>
            <UButton
              icon="i-lucide-plus"
              :disabled="!isAdmin"
              @click="openCreateModal"
            >
              New User
            </UButton>
          </div>
        </template>

        <div class="flex flex-wrap items-center gap-3">
          <UInput
            v-model="query"
            icon="i-lucide-search"
            placeholder="Search name or email"
            class="w-full sm:max-w-sm"
          />
          <USelect
            v-model="statusFilter"
            :items="['all', 'active', 'invited', 'disabled']"
            class="w-40"
          />
          <UBadge
            color="neutral"
            variant="subtle"
          >
            Role: {{ role }}
          </UBadge>
        </div>

        <div class="mt-4 space-y-2">
          <UCard
            v-for="user in (data?.items || [])"
            :key="user.id"
            class="bg-elevated/30"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="space-y-1">
                <p class="font-medium">
                  {{ user.name }}
                </p>
                <p class="text-sm text-muted">
                  {{ user.email }}
                </p>
                <div class="flex items-center gap-2 text-xs text-muted">
                  <UBadge
                    color="neutral"
                    variant="outline"
                  >
                    {{ user.role }}
                  </UBadge>
                  <UBadge
                    color="primary"
                    variant="subtle"
                  >
                    {{ user.status }}
                  </UBadge>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-pencil"
                  :disabled="!isAdmin"
                  @click="openEditModal(user)"
                >
                  Edit
                </UButton>
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  :disabled="!isAdmin"
                  @click="removeUser(user.id)"
                >
                  Delete
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-muted">
              Total matched: {{ data?.total || 0 }}
            </p>
            <UPagination
              v-model:page="page"
              :total="data?.total || 0"
              :items-per-page="pageSize"
            />
          </div>
        </template>
      </UCard>

      <UAlert
        v-if="!isAdmin"
        color="warning"
        variant="subtle"
        title="Read-only mode"
        description="Switch role to admin in dashboard header to enable CRUD actions."
      />

      <UAlert
        v-if="actionError"
        color="error"
        variant="subtle"
        title="Action failed"
        :description="actionError"
      />

      <UAlert
        v-if="pending"
        color="neutral"
        variant="subtle"
        title="Loading users..."
      />
    </div>

    <UModal
      v-model:open="modalOpen"
      :title="modalTitle"
      :description="isAdmin ? 'Submit to save this user record.' : 'Only admin can save changes.'"
    >
      <template #body>
        <UForm
          :state="formState"
          :validate="validateForm"
          class="space-y-4"
          @submit="submitForm"
        >
          <UFormField
            label="Name"
            name="name"
          >
            <UInput v-model="formState.name" />
          </UFormField>

          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="formState.email"
              type="email"
            />
          </UFormField>

          <UFormField
            label="Role"
            name="role"
          >
            <USelect
              v-model="formState.role"
              :items="['owner', 'admin', 'member']"
            />
          </UFormField>

          <UFormField
            label="Status"
            name="status"
          >
            <USelect
              v-model="formState.status"
              :items="['active', 'invited', 'disabled']"
            />
          </UFormField>

          <div class="flex items-center gap-2 pt-2">
            <UButton
              type="submit"
              :disabled="!isAdmin"
              icon="i-lucide-save"
            >
              Save
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              @click="modalOpen = false"
            >
              Cancel
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </DashboardStableShell>
</template>
