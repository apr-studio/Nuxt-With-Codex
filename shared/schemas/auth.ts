import { z } from 'zod'

export const appRoleSchema = z.enum(['admin', 'editor', 'viewer'])
export const permissionSchema = z.enum([
  'dashboard:view',
  'reports:view',
  'users:view',
  'users:create',
  'users:update',
  'users:delete',
  'settings:view',
  'settings:write'
])

export const authMeResponseSchema = z.object({
  role: appRoleSchema,
  permissions: z.array(permissionSchema)
})

export type AuthMeResponse = z.infer<typeof authMeResponseSchema>
