<script setup lang="ts">
// Summary KPI cards with loading skeleton state.
defineProps<{
  isLoading: boolean
  cards: Array<{
    name: string
    value: string
    change: string
  }>
}>()
</script>

<template>
  <!-- Skeletons while loading. -->
  <div
    v-if="isLoading"
    class="grid gap-4 md:grid-cols-3"
  >
    <USkeleton class="h-28 w-full" />
    <USkeleton class="h-28 w-full" />
    <USkeleton class="h-28 w-full" />
  </div>

  <!-- Render KPI cards when data is ready. -->
  <div
    v-else
    class="grid gap-4 md:grid-cols-3"
  >
    <UCard
      v-for="card in cards"
      :key="card.name"
      class="bg-elevated/40"
    >
      <p class="text-sm text-muted">
        {{ card.name }}
      </p>
      <p class="text-2xl font-semibold mt-1">
        {{ card.value }}
      </p>
      <UBadge
        color="success"
        variant="subtle"
        class="mt-2"
      >
        {{ card.change }}
      </UBadge>
    </UCard>
  </div>
</template>
