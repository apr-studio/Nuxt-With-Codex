type UseRouteLoadingOverlayOptions = {
  minDurationMs?: number
  retryHintAfterMs?: number
}

// Global route-change overlay with optional retry hint.
export function useRouteLoadingOverlay(options: UseRouteLoadingOverlayOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  const minDurationMs = options.minDurationMs ?? 300
  const retryHintAfterMs = options.retryHintAfterMs ?? 8000

  const isRouteLoading = ref(false)
  const showLoadingRetryHint = ref(false)
  const loadingStartedAt = ref(0)

  let hideTimer: ReturnType<typeof setTimeout> | null = null
  let retryHintTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    if (retryHintTimer) {
      clearTimeout(retryHintTimer)
      retryHintTimer = null
    }
  }

  function clearOverlay() {
    clearTimers()
    isRouteLoading.value = false
    showLoadingRetryHint.value = false
  }

  // Start overlay on route change.
  const removeBeforeEach = router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) {
      return
    }

    clearTimers()
    showLoadingRetryHint.value = false
    loadingStartedAt.value = Date.now()
    isRouteLoading.value = true

    retryHintTimer = setTimeout(() => {
      if (isRouteLoading.value) {
        showLoadingRetryHint.value = true
      }
    }, retryHintAfterMs)
  })

  // Hide overlay after navigation with minimum duration.
  const removeAfterEach = router.afterEach(() => {
    if (!isRouteLoading.value) {
      return
    }

    const elapsed = Date.now() - loadingStartedAt.value
    const remaining = Math.max(0, minDurationMs - elapsed)

    hideTimer = setTimeout(() => {
      isRouteLoading.value = false
      hideTimer = null
    }, remaining)
  })

  // Clear overlay on navigation error.
  const removeOnError = router.onError(() => {
    clearOverlay()
  })

  // Re-run the current route to attempt recovery.
  async function retryCurrentRoute() {
    clearOverlay()
    await router.replace(route.fullPath)
  }

  // Cleanup router hooks and timers.
  onBeforeUnmount(() => {
    clearOverlay()
    removeBeforeEach()
    removeAfterEach()
    removeOnError()
  })

  return {
    isRouteLoading,
    showLoadingRetryHint,
    retryCurrentRoute
  }
}
