<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const isDashboardTabLoading = ref(false)
const dashboardLoadingStartedAt = ref(0)
const minDashboardLoadingMs = 300
const loadingTimeoutMs = 8000
const showLoadingRetryHint = ref(false)
let hideDashboardLoadingTimer: ReturnType<typeof setTimeout> | null = null
let loadingTimeoutTimer: ReturnType<typeof setTimeout> | null = null

const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const topNavItems = [
  { label: 'Routes', icon: 'i-lucide-compass', to: '/' },
  { label: 'UI Showcase', icon: 'i-lucide-layout-grid', to: '/ui-showcase' },
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard/overview'
  }
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

const removeBeforeEach = router.beforeEach((to, from) => {
  const isRouteSwitch = to.fullPath !== from.fullPath

  if (isRouteSwitch) {
    if (hideDashboardLoadingTimer) {
      clearTimeout(hideDashboardLoadingTimer)
      hideDashboardLoadingTimer = null
    }
    if (loadingTimeoutTimer) {
      clearTimeout(loadingTimeoutTimer)
      loadingTimeoutTimer = null
    }
    showLoadingRetryHint.value = false
    dashboardLoadingStartedAt.value = Date.now()
    isDashboardTabLoading.value = true
    loadingTimeoutTimer = setTimeout(() => {
      if (isDashboardTabLoading.value) {
        showLoadingRetryHint.value = true
      }
    }, loadingTimeoutMs)
  }
})

const removeAfterEach = router.afterEach(() => {
  if (!isDashboardTabLoading.value) {
    return
  }

  const elapsed = Date.now() - dashboardLoadingStartedAt.value
  const remaining = Math.max(0, minDashboardLoadingMs - elapsed)

  hideDashboardLoadingTimer = setTimeout(() => {
    isDashboardTabLoading.value = false
    hideDashboardLoadingTimer = null
  }, remaining)
})

const clearLoadingOverlay = () => {
  if (hideDashboardLoadingTimer) {
    clearTimeout(hideDashboardLoadingTimer)
    hideDashboardLoadingTimer = null
  }
  if (loadingTimeoutTimer) {
    clearTimeout(loadingTimeoutTimer)
    loadingTimeoutTimer = null
  }
  isDashboardTabLoading.value = false
  showLoadingRetryHint.value = false
}

async function retryCurrentRoute() {
  clearLoadingOverlay()
  await router.replace(route.fullPath)
}

const removeOnError = router.onError(() => {
  clearLoadingOverlay()
})

onBeforeUnmount(() => {
  clearLoadingOverlay()
  removeBeforeEach()
  removeAfterEach()
  removeOnError()
})
</script>

<template>
  <UApp>
    <div
      v-if="isDashboardTabLoading"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-default/25 backdrop-blur-sm"
    >
      <UCard class="w-[320px]">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-5 animate-spin text-primary"
          />
          <div>
            <p class="font-medium">
              Loading dashboard...
            </p>
            <p class="text-sm text-muted">
              Please wait while switching tabs
            </p>
          </div>
        </div>
        <div
          v-if="showLoadingRetryHint"
          class="mt-3 space-y-2"
        >
          <UAlert
            color="warning"
            variant="subtle"
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

    <template v-if="isDashboardRoute">
      <NuxtPage />
    </template>

    <template v-else>
      <!-- Header -->
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
      <!-- Content -->
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
