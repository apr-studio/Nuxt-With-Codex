<script setup lang="ts">
import { DASHBOARD_NAV_ITEMS, getDashboardPageTitle } from '~/features/dashboard/types/shell'
import { useDashboardRole } from '~/composables/useDashboardRole'

// Dashboard shell: sidebar + top bar + slot content.
const route = useRoute()
const sidebarOpen = ref(false)
const router = useRouter()
const { currentUser, normalizedRole, can } = useDashboardRole()

const logoutMutation = useApiMutation<{ ok: true }>({
  url: useApiPath('/api/auth/logout'),
  method: 'POST',
  toastOptions: {
    success: 'Signed out',
    error: 'Sign-out failed'
  }
})

async function handleLogout() {
  const result = await logoutMutation.mutate()
  if (result) {
    await router.push('/login?logout=1')
  }
}

// Active link highlight.
const isActive = (to: string) => route.path === to

// Filter nav items by permission.
const visibleNavItems = computed(() =>
  DASHBOARD_NAV_ITEMS.filter(item => can(item.permission))
)

// Page title derived from current route.
const pageTitle = computed(() => getDashboardPageTitle(route.path))
const avatarFallback = computed(() => {
  const name = currentUser.value?.name || ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0] || ''
    const second = parts[1] || ''
    return `${first.slice(0, 1)}${second.slice(0, 1)}`.toUpperCase()
  }
  if (parts.length === 1) {
    const first = parts[0] || ''
    return first.slice(0, 2).toUpperCase()
  }
  return 'U'
})

const roleLabel = computed(() => normalizedRole.value.toUpperCase())
const userMenuItems = computed(() => [
  [
    {
      type: 'label' as const,
      label: currentUser.value?.name || 'Unknown User',
      description: currentUser.value?.email || ''
    }
  ],
  [
    {
      label: 'Account Settings',
      icon: 'i-lucide-user-cog',
      to: '/dashboard/account'
    },
    {
      label: `Role: ${roleLabel.value}`,
      icon: 'i-lucide-shield-check',
      disabled: true
    }
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      loading: logoutMutation.pending.value,
      onSelect: () => {
        void handleLogout()
      }
    }
  ]
])
</script>

<template>
  <div class="min-h-screen bg-default">
    <div class="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
      <div class="grid gap-4 lg:grid-cols-[260px_1fr]">
        <!-- Desktop sidebar. -->
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

            <!-- Sidebar navigation. -->
            <nav class="space-y-1">
              <NuxtLink
                v-for="item in visibleNavItems"
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

        <!-- Main content area. -->
        <section class="space-y-4">
          <UCard>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <!-- Mobile menu trigger. -->
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
                <UButton
                  to="/"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-compass"
                >
                  Routes
                </UButton>
                <UColorModeButton />
                <UDropdownMenu :items="userMenuItems">
                  <UButton
                    color="neutral"
                    variant="outline"
                    class="gap-2"
                    :loading="logoutMutation.pending.value"
                  >
                    <UAvatar
                      :alt="currentUser?.name || 'User'"
                      :src="currentUser?.avatarUrl || undefined"
                      :text="avatarFallback"
                      size="xs"
                      color="neutral"
                      variant="soft"
                    />
                    <span class="hidden sm:inline max-w-[140px] truncate font-medium">
                      {{ currentUser?.name || 'Unknown User' }}
                    </span>
                    <UBadge
                      color="neutral"
                      variant="subtle"
                      size="xs"
                      class="hidden md:inline-flex"
                    >
                      {{ normalizedRole }}
                    </UBadge>
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="size-4 text-muted"
                    />
                  </UButton>
                </UDropdownMenu>
              </div>
            </div>
          </UCard>

          <slot />
        </section>
      </div>
    </div>

    <!-- Mobile drawer for sidebar navigation. -->
    <UDrawer
      v-model:open="sidebarOpen"
      direction="left"
      :handle="false"
      title="Dashboard Menu"
      class="lg:hidden"
    >
      <template #body>
        <div class="space-y-2 p-2">
          <UButton
            v-for="item in visibleNavItems"
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
