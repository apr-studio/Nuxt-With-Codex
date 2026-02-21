<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)
const role = useCookie<'admin' | 'member'>('role', { default: () => 'admin' })

const navItems = [
  { label: 'Overview', icon: 'i-lucide-home', to: '/dashboard/overview' },
  { label: 'Users', icon: 'i-lucide-users', to: '/dashboard/users' },
  { label: 'Reports', icon: 'i-lucide-bar-chart-3', to: '/dashboard/reports' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/dashboard/settings' }
]

const isActive = (to: string) => route.path === to

watch(role, (value) => {
  if (value !== 'admin' && value !== 'member') {
    role.value = 'member'
  }
})

const pageTitle = computed(() => {
  if (route.path.startsWith('/dashboard/users')) {
    return 'Users'
  }
  if (route.path.startsWith('/dashboard/reports')) {
    return 'Reports'
  }
  if (route.path.startsWith('/dashboard/settings')) {
    return 'Settings'
  }
  return 'Overview'
})
</script>

<template>
  <div class="min-h-screen bg-default">
    <div class="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
      <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside class="hidden lg:block">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UAvatar
                  icon="i-lucide-rocket"
                  size="sm"
                />
                <p class="font-semibold">
                  Nuxt Admin
                </p>
              </div>
            </template>

            <nav class="space-y-1">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="block"
              >
                <div
                  class="flex items-center gap-2 rounded-md border-l-2 px-2 py-2 transition-colors"
                  :class="isActive(item.to)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent hover:bg-elevated/60'"
                >
                  <UIcon
                    :name="item.icon"
                    class="size-4"
                  />
                  <span class="text-sm font-medium">{{ item.label }}</span>
                </div>
              </NuxtLink>
            </nav>

            <template #footer>
              <UButton
                to="/ui-showcase"
                color="neutral"
                variant="outline"
                icon="i-lucide-sparkles"
                class="w-full justify-start"
              >
                UI Showcase
              </UButton>
            </template>
          </UCard>
        </aside>

        <section class="space-y-4">
          <UCard>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-menu"
                  class="lg:hidden"
                  @click="sidebarOpen = true"
                />
                <UIcon
                  name="i-lucide-layout-dashboard"
                  class="size-5 text-muted"
                />
                <h1 class="text-lg font-semibold">
                  Dashboard - {{ pageTitle }}
                </h1>
              </div>
              <div class="flex items-center gap-2">
                <USelect
                  v-model="role"
                  :items="['admin', 'member']"
                  class="w-28"
                />
                <UBadge
                  color="neutral"
                  variant="subtle"
                >
                  Role: {{ role }}
                </UBadge>
                <UButton
                  to="/"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-compass"
                >
                  Routes
                </UButton>
                <UColorModeButton />
              </div>
            </div>
          </UCard>

          <slot />
        </section>
      </div>
    </div>

    <UDrawer
      v-model:open="sidebarOpen"
      direction="left"
      :handle="false"
      title="Dashboard Menu"
      class="lg:hidden"
    >
      <template #body>
        <div class="space-y-2 p-2">
          <USelect
            v-model="role"
            :items="['admin', 'member']"
          />
          <UButton
            v-for="item in navItems"
            :key="`mobile-${item.to}`"
            :to="item.to"
            :icon="item.icon"
            color="neutral"
            :variant="isActive(item.to) ? 'solid' : 'ghost'"
            class="w-full justify-start"
            @click="sidebarOpen = false"
          >
            {{ item.label }}
          </UButton>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
