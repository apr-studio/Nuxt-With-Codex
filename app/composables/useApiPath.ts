// Prefix API paths with configured baseURL, always ensuring leading slash.
export function useApiPath(path: string) {
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}
