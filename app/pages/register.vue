<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const router = useRouter()

const formState = reactive({
  name: '',
  email: ''
})

const formErrors = ref<{ name?: string, message: string }[]>([])

const registerMutation = useApiMutation<{ role: string }, { name: string, email: string }>({
  url: useApiPath('/api/auth/register'),
  method: 'POST',
  toastOptions: {
    success: 'Account created',
    error: 'Registration failed'
  }
})

const isSubmitting = computed(() => registerMutation.pending.value)

async function submit() {
  formErrors.value = []
  if (!formState.name.trim() || formState.name.trim().length < 2) {
    formErrors.value.push({ name: 'name', message: 'Name must be at least 2 characters.' })
  }
  if (!formState.email.trim() || !/^\S+@\S+\.\S+$/.test(formState.email)) {
    formErrors.value.push({ name: 'email', message: 'Email format is invalid.' })
  }
  if (formErrors.value.length) {
    return
  }

  const result = await registerMutation.mutate({
    body: {
      name: formState.name,
      email: formState.email
    }
  })
  if (!result) {
    return
  }
  await router.push('/dashboard/overview')
}
</script>

<template>
  <UContainer class="py-10">
    <div class="mx-auto max-w-md">
      <UCard>
        <template #header>
          <div>
            <h1 class="text-xl font-semibold">
              Create account
            </h1>
            <p class="text-sm text-muted mt-1">
              Register a new user for the dashboard demo.
            </p>
          </div>
        </template>

        <UForm
          :state="formState"
          :validate="() => formErrors"
          class="space-y-4"
          @submit="submit"
        >
          <UFormField label="Name">
            <UInput
              v-model="formState.name"
              placeholder="Jane Doe"
            />
          </UFormField>

          <UFormField label="Email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="name@example.com"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="isSubmitting"
            icon="i-lucide-user-plus"
            block
          >
            Create account
          </UButton>
        </UForm>

        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-muted">
            Already have an account?
          </span>
          <UButton
            to="/login"
            variant="ghost"
            color="neutral"
            icon="i-lucide-log-in"
          >
            Sign in
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
