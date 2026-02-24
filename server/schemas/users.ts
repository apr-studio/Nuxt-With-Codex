import { z } from 'zod'
import { parseInputSchema, parseResponseSchema } from '../utils/zod-schema'
import type { UserRole, UsersResponse, UserStatus } from '#shared/dashboard-types'

const userRoleSchema = z.enum(['admin', 'editor', 'viewer'])
const userStatusSchema = z.enum(['active', 'invited', 'disabled'])

const usersListQuerySchema = z.object({
  q: z.string().optional().default(''),
  status: z.union([z.literal('all'), userStatusSchema]).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(5)
})

const createUserBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Email format is invalid.'),
  role: userRoleSchema,
  status: userStatusSchema
})

const updateUserBodySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').optional(),
  email: z.string().trim().email('Email format is invalid.').optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional()
})

const userRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.string()
})

const usersResponseSchema = z.object({
  items: z.array(userRowSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1)
})

const userMutationResponseSchema = z.object({
  user: userRowSchema
})

const deleteUserResponseSchema = z.object({
  ok: z.literal(true)
})

export type CreateUserInput = {
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export type UpdateUserInput = {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

export function parseUsersListQuery(query: unknown) {
  const parsed = parseInputSchema(usersListQuerySchema, query, 'Invalid users list query.')
  return {
    q: parsed.q.trim().toLowerCase(),
    status: parsed.status,
    page: parsed.page,
    pageSize: parsed.pageSize
  }
}

export function parseUserId(value: unknown): number {
  return parseInputSchema(
    z.coerce.number().int().finite(),
    value,
    'Invalid user id.'
  )
}

export function parseCreateUserBody(body: unknown): CreateUserInput {
  const parsed = parseInputSchema(createUserBodySchema, body, 'Invalid create user payload.')
  return {
    ...parsed,
    email: parsed.email.toLowerCase()
  }
}

export function parseUpdateUserBody(body: unknown): UpdateUserInput {
  const parsed = parseInputSchema(updateUserBodySchema, body, 'Invalid update user payload.')
  return {
    ...parsed,
    ...(parsed.email ? { email: parsed.email.toLowerCase() } : {})
  }
}

export function validateUsersResponse(value: unknown) {
  parseResponseSchema(usersResponseSchema, value, 'Invalid users response.')
}

export function validateUserMutationResponse(value: unknown) {
  parseResponseSchema(userMutationResponseSchema, value, 'Invalid user mutation response.')
}

export function validateDeleteUserResponse(value: unknown) {
  parseResponseSchema(deleteUserResponseSchema, value, 'Invalid delete user response.')
}

export function toUsersResponse(items: UsersResponse['items'], total: number, page: number, pageSize: number): UsersResponse {
  return {
    items,
    total,
    page,
    pageSize
  }
}
