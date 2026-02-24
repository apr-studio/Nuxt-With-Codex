import { parseInputSchema, parseResponseSchema } from '../utils/zod-schema'
import { authLoginBodySchema, authMeResponseSchema, authRegisterBodySchema } from '#shared/schemas/auth'
import type { AuthLoginBody, AuthRegisterBody } from '#shared/schemas/auth'

export function validateAuthMeResponse(value: unknown) {
  parseResponseSchema(authMeResponseSchema, value, 'Invalid auth me response.')
}

export function parseAuthLoginBody(body: unknown): AuthLoginBody {
  return parseInputSchema(authLoginBodySchema, body, 'Invalid login payload.')
}

export function parseAuthRegisterBody(body: unknown): AuthRegisterBody {
  return parseInputSchema(authRegisterBodySchema, body, 'Invalid register payload.')
}
