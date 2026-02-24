<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

const formState = reactive({
  email: '',
  password: ''
})

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
  await $fetch(useApiPath('/api/auth/logout'), { method: 'POST' })
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
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="At least 8 characters"
          />
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
