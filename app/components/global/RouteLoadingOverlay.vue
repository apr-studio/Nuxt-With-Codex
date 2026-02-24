<script setup lang="ts">
const { isRouteLoading, showLoadingRetryHint, retryCurrentRoute } = useRouteLoadingOverlay()
</script>

<template>
  <div
    v-if="isRouteLoading"
    class="fixed inset-0 z-[1100] flex items-center justify-center bg-default/25 backdrop-blur-sm"
  >
    <UCard class="w-[320px]">
      <div class="flex items-center gap-3">
        <UIcon
          name="i-lucide-loader-circle"
          class="size-5 animate-spin text-primary"
        />
        <div>
          <p class="font-medium">
            Loading dashboard...
          </p>
          <p class="text-sm text-muted">
            Please wait while switching tabs
          </p>
        </div>
      </div>
      <div
        v-if="showLoadingRetryHint"
        class="mt-3 space-y-2"
      >
        <UAlert
          color="warning"
          variant="subtle"
          title="Taking longer than expected"
          description="Loading has exceeded 8 seconds. You can retry."
        />
        <UButton
          block
          color="warning"
          variant="soft"
          icon="i-lucide-rotate-cw"
          @click="retryCurrentRoute"
        >
          Retry
        </UButton>
      </div>
    </UCard>
  </div>
</template>
