import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])
export const userStatusSchema = z.enum(['active', 'invited', 'disabled'])

export const usersListQuerySchema = z.object({
  q: z.string().optional().default(''),
  status: z.union([z.literal('all'), userStatusSchema]).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(5)
})

export const createUserBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Email format is invalid.'),
  role: userRoleSchema,
  status: userStatusSchema
})

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').optional(),
  email: z.string().trim().email('Email format is invalid.').optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional()
})

export const userRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.string()
})

export const usersResponseSchema = z.object({
  items: z.array(userRowSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1)
})

export const userMutationResponseSchema = z.object({
  user: userRowSchema
})

export const deleteUserResponseSchema = z.object({
  ok: z.literal(true)
})

export type UsersListQueryInput = z.infer<typeof usersListQuerySchema>
export type CreateUserBody = z.infer<typeof createUserBodySchema>
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>
export type UserRow = z.infer<typeof userRowSchema>
export type UsersResponse = z.infer<typeof usersResponseSchema>
export type UserMutationResponse = z.infer<typeof userMutationResponseSchema>
export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>
