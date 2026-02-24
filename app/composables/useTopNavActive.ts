// Helper for marking top nav buttons active based on current route.
export const useTopNavActive = () => {
  const route = useRoute()

  const isTopNavActive = (to: string) => {
    if (to.startsWith('/dashboard')) {
      return route.path.startsWith('/dashboard')
    }
    return route.path === to
  }

  return { isTopNavActive }
}
