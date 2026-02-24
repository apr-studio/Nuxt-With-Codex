<script setup lang="ts">
import { useUsersCrud } from '~/composables/useUsersCrud'

// Role-guarded users management page.
definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'users:view'
})

// CRUD state + handlers for the users table and modal.
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
  <div>
    <div class="space-y-4">
      <!-- Users table + filters + pagination. -->
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

      <!-- Empty state / permission / error alerts. -->
      <DashboardUsersStateAlerts
        :can-create="canCreate"
        :can-update="canUpdate"
        :can-delete="canDelete"
        :action-error="actionError"
        :pending="pending"
      />
    </div>

    <!-- Create/edit modal. -->
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
  </div>
</template>
