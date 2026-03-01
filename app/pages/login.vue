<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const apiPath = useApiPath
const { ensureCsrfToken } = useCsrfToken()

const formState = reactive({
  email: '',
  password: ''
})
const showPassword = ref(false)

const loginMutation = useApiMutation<{ role: string }, { email: string, password: string }>({
  url: useApiPath('/api/auth/login'),
  method: 'POST',
  toastOptions: {
    success: 'Signed in',
    error: 'Sign-in failed'
  }
})

const isSubmitting = computed(() => loginMutation.pending.value)
const formErrors = ref<{ name?: string, message: string }[]>([])
const logoutMessage = computed(() => route.query.logout === '1')
const redirectTarget = computed(() =>
  typeof route.query.redirect === 'string' ? route.query.redirect : ''
)
const oauthError = computed(() =>
  typeof route.query.oauth_error === 'string' ? route.query.oauth_error : ''
)
const oauthProviders = [
  { key: 'google', label: 'Google', icon: 'i-simple-icons-google' },
  { key: 'facebook', label: 'Facebook', icon: 'i-simple-icons-facebook' },
  { key: 'apple', label: 'Apple', icon: 'i-simple-icons-apple' }
] as const
type OAuthProviderKey = (typeof oauthProviders)[number]['key']

const { payload: oauthAvailability } = useApiFetch<{
  enabled: Record<OAuthProviderKey, boolean>
}>(useApiPath('/api/auth/oauth/providers'), {
  defaultData: {
    enabled: {
      google: false,
      facebook: false,
      apple: false
    }
  },
  toastOptions: { error: false }
})

const enabledOAuthProviders = computed(() =>
  oauthProviders.filter(provider => oauthAvailability.value?.enabled?.[provider.key])
)

function getOAuthHref(provider: OAuthProviderKey) {
  const base = apiPath(`/api/auth/oauth/${provider}`)
  if (!redirectTarget.value) {
    return base
  }
  return `${base}?redirect=${encodeURIComponent(redirectTarget.value)}`
}

async function submit() {
  formErrors.value = []
  if (!formState.email.trim() || !/^\S+@\S+\.\S+$/.test(formState.email)) {
    formErrors.value.push({ name: 'email', message: 'Email format is invalid.' })
  }
  if (!formState.password || formState.password.length < 8) {
    formErrors.value.push({ name: 'password', message: 'Password must be at least 8 characters.' })
  }
  if (formErrors.value.length) {
    return
  }
  const result = await loginMutation.mutate({
    body: {
      email: formState.email,
      password: formState.password
    }
  })
  if (!result) {
    return
  }
  const redirect = typeof route.query.redirect === 'string'
    ? route.query.redirect
    : '/dashboard/overview'
  await router.push(redirect)
}

async function logout() {
  const csrfToken = await ensureCsrfToken()
  await $fetch(useApiPath('/api/auth/logout'), {
    method: 'POST',
    headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined
  })
}

onMounted(async () => {
  if (route.query.logout === '1') {
    await logout()
  }
})
</script>

<template>
  <UContainer class="py-10">
    <div class="mx-auto max-w-md">
      <UCard>
        <template #header>
          <div>
            <h1 class="text-xl font-semibold">
              Sign in
            </h1>
            <p class="text-sm text-muted mt-1">
              Session-based demo login for the dashboard.
            </p>
          </div>
        </template>

        <div class="space-y-3">
          <UAlert
            v-if="logoutMessage"
            color="success"
            variant="subtle"
            title="Signed out"
            description="You have been signed out successfully."
          />
          <UAlert
            v-if="redirectTarget"
            color="warning"
            variant="subtle"
            title="Sign in required"
            :description="`Please sign in to access ${redirectTarget}.`"
          />
          <UAlert
            v-if="oauthError"
            color="error"
            variant="subtle"
            title="OAuth sign-in failed"
            :description="oauthError"
          />
        </div>

        <UForm
          :state="formState"
          :validate="() => formErrors"
          class="space-y-4"
          @submit="submit"
        >
          <UFormField label="Email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="name@example.com"
            />
          </UFormField>

          <UFormField label="Password">
            <div class="space-y-2">
              <UInput
                v-model="formState.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 8 characters"
              />
              <div class="flex justify-end">
                <UButton
                  type="button"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </UButton>
              </div>
            </div>
          </UFormField>

          <UButton
            type="submit"
            :loading="isSubmitting"
            icon="i-lucide-log-in"
            block
          >
            Sign in
          </UButton>
        </UForm>

        <div
          v-if="enabledOAuthProviders.length"
          class="my-4 flex items-center gap-3 text-xs text-muted"
        >
          <div class="h-px flex-1 bg-border" />
          <span>OR</span>
          <div class="h-px flex-1 bg-border" />
        </div>

        <div
          v-if="enabledOAuthProviders.length"
          class="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          <UButton
            v-for="provider in enabledOAuthProviders"
            :key="provider.key"
            color="neutral"
            variant="outline"
            :icon="provider.icon"
            block
            @click="navigateTo(getOAuthHref(provider.key), { external: true })"
          >
            {{ provider.label }}
          </UButton>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-muted">
            Need an account?
          </span>
          <UButton
            to="/register"
            variant="ghost"
            color="neutral"
            icon="i-lucide-user-plus"
          >
            Create account
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
