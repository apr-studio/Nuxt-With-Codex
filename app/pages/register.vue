<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { generatePassword, copyText } = usePasswordTools()

const formState = reactive({
  name: '',
  email: '',
  password: ''
})
const showPassword = ref(false)

const formErrors = ref<{ name?: string, message: string }[]>([])

const registerMutation = useApiMutation<{ role: string }, { name: string, email: string, password: string }>({
  url: useApiPath('/api/auth/register'),
  method: 'POST',
  toastOptions: {
    success: 'Account created',
    error: 'Registration failed'
  }
})

const isSubmitting = computed(() => registerMutation.pending.value)

function fillGeneratedPassword() {
  formState.password = generatePassword({ length: 14 })
}

async function copyPassword() {
  await copyText(formState.password, 'Password')
}

async function submit() {
  formErrors.value = []
  if (!formState.name.trim() || formState.name.trim().length < 2) {
    formErrors.value.push({ name: 'name', message: 'Name must be at least 2 characters.' })
  }
  if (!formState.email.trim() || !/^\S+@\S+\.\S+$/.test(formState.email)) {
    formErrors.value.push({ name: 'email', message: 'Email format is invalid.' })
  }
  if (!formState.password || formState.password.length < 8) {
    formErrors.value.push({ name: 'password', message: 'Password must be at least 8 characters.' })
  }
  if (formErrors.value.length) {
    return
  }

  const result = await registerMutation.mutate({
    body: {
      name: formState.name,
      email: formState.email,
      password: formState.password
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

          <UFormField label="Password">
            <div class="space-y-2">
              <UInput
                v-model="formState.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 8 characters"
              />
              <div class="flex flex-wrap gap-2">
                <UButton
                  type="button"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-wand-sparkles"
                  @click="fillGeneratedPassword"
                >
                  Generate
                </UButton>
                <UButton
                  type="button"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-copy"
                  @click="copyPassword"
                >
                  Copy
                </UButton>
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
