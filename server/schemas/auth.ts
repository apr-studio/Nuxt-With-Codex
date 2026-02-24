import { parseInputSchema, parseResponseSchema } from '../utils/zod-schema'
import { authLoginBodySchema, authMeResponseSchema } from '#shared/schemas/auth'
import type { AuthLoginBody } from '#shared/schemas/auth'

export function validateAuthMeResponse(value: unknown) {
  parseResponseSchema(authMeResponseSchema, value, 'Invalid auth me response.')
}

export function parseAuthLoginBody(body: unknown): AuthLoginBody {
  return parseInputSchema(authLoginBodySchema, body, 'Invalid login payload.')
}
