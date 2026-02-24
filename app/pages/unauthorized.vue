<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <UContainer class="py-10">
    <div class="mx-auto max-w-lg space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-shield-alert"
              class="size-5 text-warning"
            />
            <h1 class="text-xl font-semibold">
              Unauthorized
            </h1>
          </div>
        </template>

        <p class="text-sm text-muted">
          You do not have permission to view this page. Sign in with a role
          that has access, or return to the main routes list.
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
            to="/login"
            icon="i-lucide-log-in"
          >
            Go to Login
          </UButton>
          <UButton
            to="/"
            color="neutral"
            variant="outline"
            icon="i-lucide-home"
          >
            Back to Routes
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
