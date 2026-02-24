import { createError } from 'h3'
import type { ZodError, ZodType, infer as ZodInfer } from 'zod'

type ValidationPhase = 'input' | 'response'

function toIssueMessage(error: ZodError): string {
  const firstIssue = error.issues[0]
  if (!firstIssue) {
    return 'Schema validation failed.'
  }
  const path = firstIssue.path.length ? `${firstIssue.path.join('.')}: ` : ''
  return `${path}${firstIssue.message}`
}

function createSchemaError(phase: ValidationPhase, message: string, details?: unknown) {
  throw createError({
    statusCode: phase === 'input' ? 400 : 500,
    statusMessage: message,
    data: {
      code: phase === 'input' ? 'INVALID_INPUT_SCHEMA' : 'INVALID_RESPONSE_SCHEMA',
      details
    }
  })
}

export function parseInputSchema<TSchema extends ZodType>(
  schema: TSchema,
  value: unknown,
  message = 'Invalid input payload.'
): ZodInfer<TSchema> {
  const result = schema.safeParse(value)
  if (!result.success) {
    createSchemaError('input', `${message} ${toIssueMessage(result.error)}`, result.error.issues)
  }
  return result.data as ZodInfer<TSchema>
}

export function parseResponseSchema<TSchema extends ZodType>(
  schema: TSchema,
  value: unknown,
  message = 'Invalid response payload.'
): ZodInfer<TSchema> {
  const result = schema.safeParse(value)
  if (!result.success) {
    createSchemaError('response', `${message} ${toIssueMessage(result.error)}`, result.error.issues)
  }
  return result.data as ZodInfer<TSchema>
}
