<script setup lang="ts">
// Dashboard root: redirect to the default overview page.
definePageMeta({
  layout: 'dashboard',
  middleware: ['dashboard-role'],
  permission: 'dashboard:view'
})

// Server-side redirect to keep /dashboard clean.
await navigateTo('/dashboard/overview', { redirectCode: 302 })
</script>

<template>
  <div />
</template>
