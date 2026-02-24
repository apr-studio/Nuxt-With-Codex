<script setup lang="ts">
import type { AppRole } from '#shared/rbac'
import type { UserRow, UsersResponse, UserStatus } from '#shared/dashboard-types'

// Users list card: filters, list, and pagination controls.
const props = defineProps<{
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  normalizedRole: AppRole
  query: string
  statusFilter: 'all' | UserStatus
  page: number
  pageSize: number
  usersData?: UsersResponse
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:statusFilter': [value: 'all' | UserStatus]
  'update:page': [value: number]
  'create': []
  'edit': [user: UserRow]
  'delete': [id: number]
}>()
</script>

<template>
  <UCard>
    <template #header>
      <!-- Title + create action. -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-semibold">
          Users
        </h2>
        <UButton
          icon="i-lucide-plus"
          :disabled="!props.canCreate"
          @click="emit('create')"
        >
          New User
        </UButton>
      </div>
    </template>

    <!-- Filters row. -->
    <div class="flex flex-wrap items-center gap-3">
      <UInput
        :model-value="props.query"
        icon="i-lucide-search"
        placeholder="Search name or email"
        class="w-full sm:max-w-sm"
        @update:model-value="emit('update:query', String($event))"
      />
      <USelect
        :model-value="props.statusFilter"
        :items="['all', 'active', 'invited', 'disabled']"
        class="w-40"
        @update:model-value="emit('update:statusFilter', $event as 'all' | UserStatus)"
      />
      <UBadge
        color="neutral"
        variant="subtle"
      >
        Role: {{ props.normalizedRole }}
      </UBadge>
    </div>

    <!-- Users list. -->
    <div class="mt-4 space-y-2">
      <UCard
        v-for="user in (props.usersData?.items || [])"
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
              :disabled="!props.canUpdate"
              @click="emit('edit', user)"
            >
              Edit
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              :disabled="!props.canDelete"
              @click="emit('delete', user.id)"
            >
              Delete
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <template #footer>
      <!-- Pagination footer. -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-muted">
          Total matched: {{ props.usersData?.total || 0 }}
        </p>
        <UPagination
          :page="props.page"
          :total="props.usersData?.total || 0"
          :items-per-page="props.pageSize"
          @update:page="emit('update:page', Number($event))"
        />
      </div>
    </template>
  </UCard>
</template>
