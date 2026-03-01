<script setup lang="ts">
const { isRouteLoading, showLoadingRetryHint, retryCurrentRoute } = useRouteLoadingOverlay()
</script>

<template>
  <div
    v-if="isRouteLoading"
    class="fixed inset-0 z-[1100] flex items-center justify-center bg-default/10 backdrop-blur-sm px-4"
  >
    <div class="absolute inset-0 bg-[radial-gradient(65%_42%_at_50%_18%,rgb(var(--color-primary-500)/0.16),transparent)]" />

    <UCard class="relative w-full max-w-sm border border-default/65 shadow-2xl">
      <div class="flex items-start gap-3">
        <div class="mt-0.5 rounded-full bg-primary/12 p-2 ring-1 ring-primary/20">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-5 animate-spin text-primary"
          />
        </div>
        <div>
          <p class="font-semibold tracking-tight text-highlighted">
            Switching view
          </p>
          <p class="mt-0.5 text-sm text-toned">
            Preparing dashboard data and layout.
          </p>
        </div>
      </div>
      <div class="mt-4 space-y-2.5">
        <USkeleton class="h-2.5 w-full rounded-full" />
        <USkeleton class="h-2.5 w-4/5 rounded-full" />
        <USkeleton class="h-2.5 w-3/5 rounded-full" />
      </div>
      <div
        v-if="showLoadingRetryHint"
        class="mt-4 space-y-2.5"
      >
        <UAlert
          color="warning"
          variant="soft"
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
