import type { Permission } from '#shared/rbac'

declare module '#app' {
  interface PageMeta {
    permission?: Permission
  }
}

export {}
