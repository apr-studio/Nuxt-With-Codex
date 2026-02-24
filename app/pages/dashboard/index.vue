<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

await navigateTo('/dashboard/overview', { redirectCode: 302 })
</script>

<template>
  <div />
</template>
