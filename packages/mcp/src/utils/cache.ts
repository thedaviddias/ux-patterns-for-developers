/**
 * LRU Cache implementation for MCP server
 * Max 1000 entries, 5-minute TTL
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class LRUCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>>
  private readonly maxSize: number
  private readonly ttlMs: number

  constructor(maxSize = 1000, ttlMs = 5 * 60 * 1000) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttlMs = ttlMs
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return undefined
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.value
  }

  set(key: string, value: T): void {
    // Delete existing entry if present
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Evict oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    })
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }

  /**
   * Create a cache key from tool name and parameters
   */
  static createKey(toolName: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = params[key]
          return acc
        },
        {} as Record<string, unknown>
      )
    return `${toolName}:${JSON.stringify(sortedParams)}`
  }
}

// Singleton cache instance for the server
export const serverCache = new LRUCache()
