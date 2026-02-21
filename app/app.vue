<script setup lang="ts">
const route = useRoute()

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))

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
      <UHeader>
        <template #left>
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            label="Routes"
            icon="i-lucide-compass"
          />
          <UButton
            to="/ui-showcase"
            variant="ghost"
            color="neutral"
            label="UI Showcase"
            icon="i-lucide-layout-grid"
          />
          <UButton
            to="/dashboard"
            variant="ghost"
            color="neutral"
            label="Dashboard"
            icon="i-lucide-layout-dashboard"
          />
        </template>
        <template #right>
          <UColorModeButton />
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
        <template #right>
          <UButton
            to="https://ui.nuxt.com/components"
            target="_blank"
            variant="ghost"
            color="neutral"
            icon="i-lucide-book-open"
            label="Nuxt UI Docs"
          />
        </template>
      </UFooter>
    </template>
  </UApp>
</template>
