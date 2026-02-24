<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

const formState = reactive({
  email: '',
  role: 'viewer'
})

const loginMutation = useApiMutation<{ role: string }, { email: string, role: string }>({
  url: useApiPath('/api/auth/login'),
  method: 'POST',
  toastOptions: {
    success: 'Signed in',
    error: 'Sign-in failed'
  }
})

const isSubmitting = computed(() => loginMutation.pending.value)

async function submit() {
  const result = await loginMutation.mutate({
    body: {
      email: formState.email,
      role: formState.role
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

        <UForm
          :state="formState"
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

          <UFormField label="Role">
            <USelect
              v-model="formState.role"
              :items="['admin', 'editor', 'viewer']"
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
      </UCard>
    </div>
  </UContainer>
</template>
