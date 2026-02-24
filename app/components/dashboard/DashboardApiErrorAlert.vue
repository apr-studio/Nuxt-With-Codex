<script setup lang="ts">
// Lightweight wrapper for consistent API error alerts.
defineProps<{
  message: string
  title?: string
}>()
</script>

<template>
  <UAlert
    v-if="message"
    color="error"
    variant="subtle"
    :title="title || 'API error'"
    :description="message"
  />
</template>
