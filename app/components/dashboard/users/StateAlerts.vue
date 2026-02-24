<script setup lang="ts">
// Helper alerts for permissions, errors, and loading state.
defineProps<{
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  actionError: string
  pending: boolean
}>()
</script>

<template>
  <UAlert
    v-if="!(canCreate || canUpdate || canDelete)"
    color="warning"
    variant="subtle"
    title="Read-only mode"
    description="Current role only has view permission."
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
</template>
