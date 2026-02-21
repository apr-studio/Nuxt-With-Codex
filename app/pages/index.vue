<script setup lang="ts">
const routes = [
  {
    title: 'UI Showcase',
    description: 'Open a page with randomized content and Nuxt UI components.',
    icon: 'i-lucide-layout-template',
    to: '/ui-showcase'
  },
  {
    title: 'Dashboard',
    description: 'Open a multi-page dashboard skeleton with sidebar navigation.',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard'
  },
  {
    title: 'Nuxt UI Docs',
    description: 'See the full list of Nuxt UI components and APIs.',
    icon: 'i-lucide-book-open-check',
    to: 'https://ui.nuxt.com/components',
    target: '_blank'
  },
  {
    title: 'Nuxt Docs',
    description: 'Routing, SSR, and deployment references for Nuxt.js.',
    icon: 'i-lucide-compass',
    to: 'https://nuxt.com/docs',
    target: '_blank'
  }
]
</script>

<template>
  <UContainer class="py-10 space-y-8">
    <UPageHero
      title="Nuxt.js + Nuxt UI Route Navigator"
      description="The project is ready. Use the links below to jump to the UI demo route."
      :links="[{ label: 'Open UI Showcase', to: '/ui-showcase', icon: 'i-lucide-arrow-right' }]"
    />

    <UPageGrid>
      <UPageCard
        v-for="route in routes"
        :key="route.title"
        :title="route.title"
        :description="route.description"
        :icon="route.icon"
        :to="route.to"
        :target="route.target"
        spotlight
      />
    </UPageGrid>
  </UContainer>
</template>
