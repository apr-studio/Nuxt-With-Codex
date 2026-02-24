<script setup lang="ts">
import { APP_TOP_NAV_ITEMS } from '~/constants/app-nav'

const { isTopNavActive } = useTopNavActive()
</script>

<template>
  <div>
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

    <UMain>
      <slot />
    </UMain>

    <USeparator />

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
