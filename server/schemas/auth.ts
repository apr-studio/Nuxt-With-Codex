import { z } from 'zod'
import { parseResponseSchema } from '../utils/zod-schema'

const appRoleSchema = z.enum(['admin', 'editor', 'viewer'])
const permissionSchema = z.enum([
  'dashboard:view',
  'reports:view',
  'users:view',
  'users:create',
  'users:update',
  'users:delete',
  'settings:view',
  'settings:write'
])

const authMeResponseSchema = z.object({
  role: appRoleSchema,
  permissions: z.array(permissionSchema)
})

export function validateAuthMeResponse(value: unknown) {
  parseResponseSchema(authMeResponseSchema, value, 'Invalid auth me response.')
}
