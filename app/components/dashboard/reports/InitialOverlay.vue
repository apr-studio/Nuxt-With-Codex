<template>
  <!-- Full-page overlay shown during initial report load. -->
  <div class="absolute inset-0 z-20 rounded-lg bg-default/30 backdrop-blur-sm p-4 md:p-6">
    <div class="absolute inset-0 rounded-lg bg-[radial-gradient(75%_48%_at_50%_0%,rgb(var(--color-primary-500)/0.14),transparent)]" />

    <UCard class="relative mx-auto mt-6 max-w-3xl border border-default/65 shadow-2xl">
      <template #header>
        <div class="flex items-center gap-2">
          <div class="rounded-full bg-primary/12 p-1.5 ring-1 ring-primary/20">
            <UIcon
              name="i-lucide-loader-circle"
              class="size-4 animate-spin text-primary"
            />
          </div>
          <div>
            <p class="font-semibold tracking-tight">
              Loading report data
            </p>
            <p class="text-xs text-muted mt-0.5">
              Calculating trends and channel distribution.
            </p>
          </div>
        </div>
      </template>
      <div class="space-y-4">
        <div class="grid gap-3 md:grid-cols-3">
          <USkeleton class="h-24 w-full rounded-xl" />
          <USkeleton class="h-24 w-full rounded-xl" />
          <USkeleton class="h-24 w-full rounded-xl" />
        </div>
        <div class="space-y-2.5">
          <USkeleton class="h-2.5 w-2/3 rounded-full" />
          <USkeleton class="h-2.5 w-full rounded-full" />
          <USkeleton class="h-2.5 w-5/6 rounded-full" />
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <USkeleton class="h-48 w-full rounded-xl" />
          <USkeleton class="h-48 w-full rounded-xl" />
        </div>
        <div class="flex items-center gap-2 text-xs text-toned">
          <UIcon
            name="i-lucide-clock-3"
            class="size-3.5"
          />
          <p>
            This usually completes within a second.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
