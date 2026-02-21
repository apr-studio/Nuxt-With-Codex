<script setup lang="ts">
definePageMeta({
  middleware: ['dashboard-role']
})

await navigateTo('/dashboard/overview', { redirectCode: 302 })
</script>

<template>
  <div />
</template>
