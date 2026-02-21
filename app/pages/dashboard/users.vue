<script setup lang="ts">
type UserStatus = 'active' | 'invited' | 'disabled'

type UserRow = {
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: UserStatus
}

const users = ref<UserRow[]>([
  { name: 'Ava Lin', email: 'ava@example.com', role: 'owner', status: 'active' },
  { name: 'Noah Chen', email: 'noah@example.com', role: 'admin', status: 'active' },
  { name: 'Mia Tsai', email: 'mia@example.com', role: 'member', status: 'invited' },
  { name: 'Ethan Wu', email: 'ethan@example.com', role: 'member', status: 'active' },
  { name: 'Lucas Ho', email: 'lucas@example.com', role: 'member', status: 'disabled' },
  { name: 'Emma Kao', email: 'emma@example.com', role: 'admin', status: 'active' },
  { name: 'Leo Hsu', email: 'leo@example.com', role: 'member', status: 'invited' },
  { name: 'Ivy Lin', email: 'ivy@example.com', role: 'member', status: 'active' }
])

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' }
]

const query = ref('')
const statusFilter = ref<'all' | UserStatus>('all')
const page = ref(1)
const pageSize = 5

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value
    return matchesQuery && matchesStatus
  })
})

const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

watch([query, statusFilter], () => {
  page.value = 1
})
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-4">
      <UCard>
        <template #header>
          <h2 class="font-semibold">
            Users
          </h2>
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
        </div>

        <div class="mt-4">
          <UTable
            :columns="columns"
            :data="pagedUsers"
          />
        </div>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-muted">
              Total matched: {{ filteredUsers.length }}
            </p>
            <UPagination
              v-model:page="page"
              :total="filteredUsers.length"
              :items-per-page="pageSize"
            />
          </div>
        </template>
      </UCard>
    </div>
  </DashboardStableShell>
</template>
