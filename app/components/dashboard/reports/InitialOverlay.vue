<template>
  <!-- Full-page overlay shown during initial report load. -->
  <div class="absolute inset-0 z-20 rounded-lg bg-default/80 backdrop-blur-[1px] p-4">
    <UCard class="max-w-xl mx-auto mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-4 animate-spin text-primary"
          />
          <p class="font-medium">
            Loading report data...
          </p>
        </div>
      </template>
      <div class="space-y-3">
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-4 w-1/2" />
        <div class="grid gap-3 md:grid-cols-3">
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
          <USkeleton class="h-24 w-full" />
        </div>
      </div>
    </UCard>
  </div>
</template>
