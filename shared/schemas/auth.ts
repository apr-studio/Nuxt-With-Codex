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
  user: z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().nullable()
  }),
  role: appRoleSchema,
  permissions: z.array(permissionSchema)
})

export const authLoginBodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.')
})

export const authRegisterBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.')
})

export const authProfileUpdateBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').optional(),
  avatarUrl: z.union([
    z.string().trim().url(),
    z.string().startsWith('data:image/', 'Avatar must be a valid image URL or data URL.')
  ]).nullable().optional(),
  currentPassword: z.string().min(8, 'Current password must be at least 8 characters.').optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.').optional()
})

export type AuthMeResponse = z.infer<typeof authMeResponseSchema>
export type AuthLoginBody = z.infer<typeof authLoginBodySchema>
export type AuthRegisterBody = z.infer<typeof authRegisterBodySchema>
export type AuthProfileUpdateBody = z.infer<typeof authProfileUpdateBodySchema>
