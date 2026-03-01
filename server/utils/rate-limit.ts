import { createError, getRequestIP, setHeader, type H3Event } from 'h3'
import { DOMAIN_ERROR_CODES } from '#shared/api-error-codes'

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

type Bucket = {
  hits: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function getBucketKey(event: H3Event, key: string) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  return `${key}:${ip}`
}

function getOrInitBucket(bucketKey: string, windowMs: number) {
  const now = Date.now()
  const existing = buckets.get(bucketKey)
  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = {
      hits: 0,
      resetAt: now + windowMs
    }
    buckets.set(bucketKey, fresh)
    return fresh
  }
  return existing
}

export function assertRateLimit(event: H3Event, options: RateLimitOptions) {
  const key = getBucketKey(event, options.key)
  const bucket = getOrInitBucket(key, options.windowMs)
  bucket.hits += 1

  const remaining = Math.max(0, options.limit - bucket.hits)
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - Date.now()) / 1000))

  setHeader(event, 'X-RateLimit-Limit', String(options.limit))
  setHeader(event, 'X-RateLimit-Remaining', String(remaining))
  setHeader(event, 'X-RateLimit-Reset', String(Math.floor(bucket.resetAt / 1000)))

  if (bucket.hits > options.limit) {
    setHeader(event, 'Retry-After', retryAfterSeconds)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests. Please try again later.',
      data: { code: DOMAIN_ERROR_CODES.rateLimited }
    })
  }
}
