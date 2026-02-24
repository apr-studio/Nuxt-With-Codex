<script setup lang="ts">
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
