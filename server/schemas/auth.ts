import { parseResponseSchema } from '../utils/zod-schema'
import { authMeResponseSchema } from '#shared/schemas/auth'

export function validateAuthMeResponse(value: unknown) {
  parseResponseSchema(authMeResponseSchema, value, 'Invalid auth me response.')
}
