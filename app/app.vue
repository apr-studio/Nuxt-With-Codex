<script setup lang="ts">
const route = useRoute()

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const topNavItems = [
  { label: 'Routes', icon: 'i-lucide-compass', to: '/' },
  { label: 'UI Showcase', icon: 'i-lucide-layout-grid', to: '/ui-showcase' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard/overview' }
]

const isTopNavActive = (to: string) => {
  if (to.startsWith('/dashboard')) {
    return route.path.startsWith('/dashboard')
  }
  return route.path === to
}

useHead({
  htmlAttrs: { lang: 'en' },
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }]
})

const title = 'Nuxt UI Showcase'
const description = 'Nuxt.js + Nuxt UI route navigation and component gallery'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <template v-if="isDashboardRoute">
      <NuxtPage />
    </template>

    <template v-else>
      <UHeader class="border-b border-default">
        <template #left>
          <div class="flex items-center gap-1">
            <UButton
              v-for="item in topNavItems"
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
        <NuxtPage />
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
    </template>
  </UApp>
</template>
