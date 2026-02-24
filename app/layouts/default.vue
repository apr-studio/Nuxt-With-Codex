<script setup lang="ts">
import { APP_TOP_NAV_ITEMS } from '~/constants/app-nav'

// Active state helper for top nav highlighting.
const { isTopNavActive } = useTopNavActive()
</script>

<template>
  <div>
    <!-- Site header with top-level navigation and utilities. -->
    <UHeader class="border-b border-default">
      <template #left>
        <div class="flex items-center gap-1">
          <UButton
            v-for="item in APP_TOP_NAV_ITEMS"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            color="neutral"
            :variant="isTopNavActive(item.to) ? 'soft' : 'ghost'"
            :label="item.label"
            size="sm"
          />
        </div>
      </template>
      <template #right>
        <div class="flex items-center gap-1">
          <!-- External Nuxt UI docs link + color mode toggle. -->
          <UButton
            to="https://ui.nuxt.com/components"
            target="_blank"
            variant="ghost"
            color="neutral"
            icon="i-lucide-book-open"
            label="Docs"
            size="sm"
          />
          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <!-- Main content area for default layout pages. -->
    <UMain>
      <slot />
    </UMain>

    <USeparator />

    <!-- Simple footer for non-dashboard pages. -->
    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Nuxt UI Demo {{ new Date().getFullYear() }}
        </p>
      </template>
      <template #right />
    </UFooter>
  </div>
</template>
