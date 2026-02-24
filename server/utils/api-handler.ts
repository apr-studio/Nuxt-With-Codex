import { defineEventHandler, setResponseStatus, type H3Event } from 'h3'
import { getDefaultApiErrorCode } from '#shared/api-error-codes'
import { apiFailure } from './api-response'

type ErrorLike = {
  statusCode?: number
  statusMessage?: string
  message?: string
  code?: unknown
  data?: {
    code?: unknown
  }
}

function normalizeError(error: unknown): { statusCode: number, code: string, message: string } {
  const defaultStatus = 500
  const defaultMessage = 'Unexpected server error.'

  if (typeof error === 'object' && error) {
    const source = error as ErrorLike
    const statusCode = Number(source.statusCode || defaultStatus)
    const statusMessage = source.statusMessage
    const message = (statusMessage && statusMessage.trim().length > 0)
      ? statusMessage
      : (source.message || defaultMessage)
    const domainCode = typeof source.data?.code === 'string'
      ? source.data.code
      : (typeof source.code === 'string' ? source.code : undefined)

    return {
      statusCode,
      code: domainCode || getDefaultApiErrorCode(statusCode),
      message
    }
  }

  return {
    statusCode: defaultStatus,
    code: getDefaultApiErrorCode(defaultStatus),
    message: defaultMessage
  }
}

export function defineApiHandler<T>(handler: (event: H3Event) => Promise<T> | T) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event)
    } catch (error) {
      const normalized = normalizeError(error)
      setResponseStatus(event, normalized.statusCode)
      return apiFailure(normalized.code, normalized.message)
    }
  })
}
