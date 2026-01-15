/**
 * Rate limiting for MCP HTTP endpoint
 * 100 requests per minute per IP
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  headers: Record<string, string>
}

/**
 * Check if a request is allowed under rate limiting
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries(now)
  }

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + WINDOW_MS
    rateLimitStore.set(identifier, { count: 1, resetAt })

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt,
      headers: createHeaders(MAX_REQUESTS - 1, resetAt),
    }
  }

  if (entry.count >= MAX_REQUESTS) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      headers: createHeaders(0, entry.resetAt),
    }
  }

  // Increment counter
  entry.count++

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
    headers: createHeaders(MAX_REQUESTS - entry.count, entry.resetAt),
  }
}

function createHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(MAX_REQUESTS),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  }
}

function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Get client identifier from request headers
 */
export function getClientIdentifier(headers: Headers): string {
  // Try X-Forwarded-For first (for proxied requests)
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  // Fall back to X-Real-IP
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Default identifier for local/unknown
  return 'unknown'
}
