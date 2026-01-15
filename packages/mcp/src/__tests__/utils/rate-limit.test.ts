/**
 * Tests for rate limiting utilities
 */

import { jest } from '@jest/globals'
import { checkRateLimit, getClientIdentifier, type RateLimitResult } from '../../utils/rate-limit'

describe('Rate Limit', () => {
  // Store original Date.now to restore after tests
  const originalDateNow = Date.now
  // Shared mock time that can be modified by individual tests
  let mockTime = 1000000

  beforeEach(() => {
    // Reset mock time to fixed value for predictable tests
    mockTime = 1000000
    Date.now = jest.fn(() => mockTime)
  })

  afterEach(() => {
    Date.now = originalDateNow
  })

  describe('checkRateLimit', () => {
    it('should allow first request and return correct remaining count', () => {
      const identifier = `test-${Math.random()}`
      const result = checkRateLimit(identifier)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99) // 100 - 1
    })

    it('should return rate limit headers', () => {
      const identifier = `test-${Math.random()}`
      const result = checkRateLimit(identifier)

      expect(result.headers).toHaveProperty('X-RateLimit-Limit', '100')
      expect(result.headers).toHaveProperty('X-RateLimit-Remaining')
      expect(result.headers).toHaveProperty('X-RateLimit-Reset')
    })

    it('should decrement remaining count on subsequent requests', () => {
      const identifier = `test-${Math.random()}`

      const result1 = checkRateLimit(identifier)
      expect(result1.remaining).toBe(99)

      const result2 = checkRateLimit(identifier)
      expect(result2.remaining).toBe(98)

      const result3 = checkRateLimit(identifier)
      expect(result3.remaining).toBe(97)
    })

    it('should track different identifiers separately', () => {
      const id1 = `test-a-${Math.random()}`
      const id2 = `test-b-${Math.random()}`

      checkRateLimit(id1)
      checkRateLimit(id1)
      checkRateLimit(id1)

      const result1 = checkRateLimit(id1)
      const result2 = checkRateLimit(id2)

      expect(result1.remaining).toBe(96) // 4th request
      expect(result2.remaining).toBe(99) // 1st request
    })

    it('should block requests after reaching limit', () => {
      const identifier = `test-blocked-${Math.random()}`

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        checkRateLimit(identifier)
      }

      // 101st request should be blocked
      const result = checkRateLimit(identifier)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should return consistent resetAt within the same window', () => {
      const identifier = `test-reset-${Math.random()}`

      const result1 = checkRateLimit(identifier)
      const result2 = checkRateLimit(identifier)
      const result3 = checkRateLimit(identifier)

      expect(result1.resetAt).toBe(result2.resetAt)
      expect(result2.resetAt).toBe(result3.resetAt)
    })

    it('should set reset time to 1 minute from first request', () => {
      const identifier = `test-time-${Math.random()}`
      const nowValue = Date.now()

      const result = checkRateLimit(identifier)

      // Reset should be 60 seconds (60000ms) from now
      expect(result.resetAt).toBe(nowValue + 60000)
    })

    it('should start new window after reset time passes', () => {
      const identifier = `test-window-${Math.random()}`

      // First request
      const result1 = checkRateLimit(identifier)
      expect(result1.remaining).toBe(99)

      // Simulate time passing (more than 1 minute)
      mockTime = 1000000 + 61000

      // Should start fresh window
      const result2 = checkRateLimit(identifier)
      expect(result2.remaining).toBe(99) // Back to 99
      expect(result2.resetAt).toBe(mockTime + 60000) // New reset time
    })

    it('should allow requests again after window resets', () => {
      const identifier = `test-reset-window-${Math.random()}`

      // Exhaust the limit
      for (let i = 0; i < 100; i++) {
        checkRateLimit(identifier)
      }

      const blockedResult = checkRateLimit(identifier)
      expect(blockedResult.allowed).toBe(false)

      // Move time forward past the reset
      mockTime = 1000000 + 61000

      const allowedResult = checkRateLimit(identifier)
      expect(allowedResult.allowed).toBe(true)
      expect(allowedResult.remaining).toBe(99)
    })

    it('should provide reset time in seconds in headers', () => {
      const identifier = `test-header-${Math.random()}`
      const result = checkRateLimit(identifier)

      const resetHeaderValue = parseInt(result.headers['X-RateLimit-Reset'], 10)
      expect(resetHeaderValue).toBe(Math.ceil(result.resetAt / 1000))
    })
  })

  describe('getClientIdentifier', () => {
    it('should extract IP from X-Forwarded-For header', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('192.168.1.1')
    })

    it('should trim whitespace from X-Forwarded-For', () => {
      const headers = new Headers({
        'x-forwarded-for': '  192.168.1.100  , 10.0.0.1',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('192.168.1.100')
    })

    it('should fall back to X-Real-IP when X-Forwarded-For is not present', () => {
      const headers = new Headers({
        'x-real-ip': '10.0.0.50',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('10.0.0.50')
    })

    it('should prefer X-Forwarded-For over X-Real-IP', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1',
        'x-real-ip': '10.0.0.1',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('192.168.1.1')
    })

    it('should return "unknown" when no IP headers present', () => {
      const headers = new Headers({})

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('unknown')
    })

    it('should return "unknown" for headers with only unrelated headers', () => {
      const headers = new Headers({
        'content-type': 'application/json',
        'user-agent': 'test-agent',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('unknown')
    })

    it('should handle IPv6 addresses in X-Forwarded-For', () => {
      const headers = new Headers({
        'x-forwarded-for': '2001:db8::1, 2001:db8::2',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('2001:db8::1')
    })

    it('should handle single IP in X-Forwarded-For', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1',
      })

      const identifier = getClientIdentifier(headers)
      expect(identifier).toBe('192.168.1.1')
    })
  })
})
