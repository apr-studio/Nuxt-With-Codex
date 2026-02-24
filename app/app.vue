<script setup lang="ts">
// Global SEO defaults for the app (title/meta/favicon).
useAppSeo()
</script>

<template>
  <UApp>
    <!-- Full-screen route transition overlay (e.g. dashboard tab switch). -->
    <RouteLoadingOverlay />
    <!-- Render pages through Nuxt layouts. -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
