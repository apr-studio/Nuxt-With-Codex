import { z } from 'zod'
import { parseInputSchema, parseResponseSchema } from '../utils/zod-schema'
import type { UserRole, UsersResponse, UserStatus } from '#shared/dashboard-types'
import {
  usersListQuerySchema,
  createUserBodySchema,
  updateUserBodySchema,
  usersResponseSchema,
  userMutationResponseSchema,
  deleteUserResponseSchema
} from '#shared/schemas/users'

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
