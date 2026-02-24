<script setup lang="ts">
import { useUsersCrud } from '~/composables/useUsersCrud'

definePageMeta({
  middleware: ['dashboard-role'],
  permission: 'users:view'
})

const {
  actionError,
  canCreate,
  canDelete,
  canUpdate,
  editingUserId,
  formState,
  isMutating,
  modalOpen,
  modalTitle,
  normalizedRole,
  openCreateModal,
  openEditModal,
  page,
  pageSize,
  pending,
  query,
  removeUser,
  statusFilter,
  submitForm,
  usersData,
  validateForm
} = useUsersCrud()
</script>

<template>
  <DashboardStableShell>
    <div class="space-y-4">
      <DashboardUsersListCard
        :can-create="canCreate"
        :can-update="canUpdate"
        :can-delete="canDelete"
        :normalized-role="normalizedRole"
        :query="query"
        :status-filter="statusFilter"
        :page="page"
        :page-size="pageSize"
        :users-data="usersData"
        @update:query="query = $event"
        @update:status-filter="statusFilter = $event"
        @update:page="page = $event"
        @create="openCreateModal"
        @edit="openEditModal"
        @delete="removeUser"
      />

      <DashboardUsersStateAlerts
        :can-create="canCreate"
        :can-update="canUpdate"
        :can-delete="canDelete"
        :action-error="actionError"
        :pending="pending"
      />
    </div>

    <DashboardUsersUserFormModal
      :open="modalOpen"
      :title="modalTitle"
      :can-create="canCreate"
      :can-update="canUpdate"
      :is-editing="Boolean(editingUserId)"
      :is-mutating="isMutating"
      :form-state="formState"
      :validate-form="validateForm"
      @update:open="modalOpen = $event"
      @submit="submitForm($event)"
    />
  </DashboardStableShell>
</template>
