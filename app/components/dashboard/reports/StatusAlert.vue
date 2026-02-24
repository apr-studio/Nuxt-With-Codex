<script setup lang="ts">
// Status messaging for report API state and fallback usage.
defineProps<{
  errorMessage: string
  hasAnyData: boolean
  isUsingFallback: boolean
}>()
</script>

<template>
  <DashboardApiErrorAlert
    v-if="errorMessage"
    title="Report API error"
    :message="errorMessage"
    class="mb-3"
  />
  <UAlert
    v-else-if="!hasAnyData"
    color="warning"
    variant="subtle"
    title="No report data loaded"
    description="Please click Refresh once, or verify /api/dashboard/reports returns data."
    class="mb-3"
  />
  <UAlert
    v-else-if="isUsingFallback"
    color="warning"
    variant="subtle"
    title="Showing fallback metrics"
    description="Live report API data is unavailable for the selected range, so fallback data is displayed."
    class="mb-3"
  />
</template>
