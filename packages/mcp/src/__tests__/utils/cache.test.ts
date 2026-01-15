/**
 * Tests for LRU Cache implementation
 */

import { jest } from '@jest/globals'
import { LRUCache } from '../../utils/cache'

describe('LRUCache', () => {
  describe('constructor', () => {
    it('should create a cache with default settings', () => {
      const cache = new LRUCache()
      expect(cache.size).toBe(0)
    })

    it('should create a cache with custom max size', () => {
      const cache = new LRUCache(5)
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`)
      }
      expect(cache.size).toBe(5)
    })

    it('should create a cache with custom TTL', () => {
      jest.useFakeTimers()
      const cache = new LRUCache(100, 50) // 50ms TTL
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')

      jest.advanceTimersByTime(60)
      expect(cache.get('key')).toBeUndefined()
      jest.useRealTimers()
    })
  })

  describe('get', () => {
    it('should return undefined for non-existent keys', () => {
      const cache = new LRUCache()
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('should return cached value for existing keys', () => {
      const cache = new LRUCache()
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')
    })

    it('should return undefined for expired entries', () => {
      jest.useFakeTimers()
      const cache = new LRUCache(100, 50) // 50ms TTL
      cache.set('key', 'value')
      jest.advanceTimersByTime(60)
      expect(cache.get('key')).toBeUndefined()
      jest.useRealTimers()
    })

    it('should update LRU order on access', () => {
      const cache = new LRUCache(2)
      cache.set('a', 1)
      cache.set('b', 2)
      cache.get('a') // Access 'a' to make it most recent
      cache.set('c', 3) // Should evict 'b', not 'a'

      expect(cache.get('a')).toBe(1)
      expect(cache.get('b')).toBeUndefined()
      expect(cache.get('c')).toBe(3)
    })

    it('should handle different value types', () => {
      const cache = new LRUCache()
      cache.set('string', 'hello')
      cache.set('number', 42)
      cache.set('object', { foo: 'bar' })
      cache.set('array', [1, 2, 3])
      cache.set('boolean', true)
      cache.set('null', null)

      expect(cache.get('string')).toBe('hello')
      expect(cache.get('number')).toBe(42)
      expect(cache.get('object')).toEqual({ foo: 'bar' })
      expect(cache.get('array')).toEqual([1, 2, 3])
      expect(cache.get('boolean')).toBe(true)
      expect(cache.get('null')).toBe(null)
    })
  })

  describe('set', () => {
    it('should add new entries', () => {
      const cache = new LRUCache()
      cache.set('key', 'value')
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toBe('value')
    })

    it('should update existing entries', () => {
      const cache = new LRUCache()
      cache.set('key', 'value1')
      cache.set('key', 'value2')
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toBe('value2')
    })

    it('should evict oldest entry when at capacity', () => {
      const cache = new LRUCache(3)
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // Should evict 'a'

      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toBe(2)
      expect(cache.get('c')).toBe(3)
      expect(cache.get('d')).toBe(4)
    })

    it('should handle rapid consecutive sets', () => {
      const cache = new LRUCache(10)
      for (let i = 0; i < 100; i++) {
        cache.set(`key${i}`, `value${i}`)
      }
      expect(cache.size).toBe(10)
      // Only last 10 should remain
      expect(cache.get('key90')).toBe('value90')
      expect(cache.get('key0')).toBeUndefined()
    })
  })

  describe('has', () => {
    it('should return false for non-existent keys', () => {
      const cache = new LRUCache()
      expect(cache.has('nonexistent')).toBe(false)
    })

    it('should return true for existing keys', () => {
      const cache = new LRUCache()
      cache.set('key', 'value')
      expect(cache.has('key')).toBe(true)
    })

    it('should return false for expired entries and delete them', () => {
      jest.useFakeTimers()
      const cache = new LRUCache(100, 50) // 50ms TTL
      cache.set('key', 'value')
      jest.advanceTimersByTime(60)
      expect(cache.has('key')).toBe(false)
      expect(cache.size).toBe(0) // Entry should be deleted
      jest.useRealTimers()
    })

    it('should update LRU order on access (documented side effect)', () => {
      const cache = new LRUCache(2)
      cache.set('a', 1)
      cache.set('b', 2)
      cache.has('a') // Access 'a' to make it most recent
      cache.set('c', 3) // Should evict 'b', not 'a'

      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(false)
    })

    it('should handle falsy cached values correctly', () => {
      const cache = new LRUCache()
      cache.set('zero', 0)
      cache.set('empty', '')
      cache.set('false', false)
      cache.set('null', null)

      expect(cache.has('zero')).toBe(true)
      expect(cache.has('empty')).toBe(true)
      expect(cache.has('false')).toBe(true)
      expect(cache.has('null')).toBe(true)
    })
  })

  describe('delete', () => {
    it('should return false for non-existent keys', () => {
      const cache = new LRUCache()
      expect(cache.delete('nonexistent')).toBe(false)
    })

    it('should delete existing entries and return true', () => {
      const cache = new LRUCache()
      cache.set('key', 'value')
      expect(cache.delete('key')).toBe(true)
      expect(cache.has('key')).toBe(false)
      expect(cache.size).toBe(0)
    })
  })

  describe('clear', () => {
    it('should remove all entries', () => {
      const cache = new LRUCache()
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.clear()
      expect(cache.size).toBe(0)
      expect(cache.get('a')).toBeUndefined()
    })
  })

  describe('size', () => {
    it('should return 0 for empty cache', () => {
      const cache = new LRUCache()
      expect(cache.size).toBe(0)
    })

    it('should return correct count', () => {
      const cache = new LRUCache()
      cache.set('a', 1)
      expect(cache.size).toBe(1)
      cache.set('b', 2)
      expect(cache.size).toBe(2)
      cache.delete('a')
      expect(cache.size).toBe(1)
    })
  })

  describe('createKey (static)', () => {
    it('should create consistent keys for same inputs', () => {
      const key1 = LRUCache.createKey('tool', { a: 1, b: 2 })
      const key2 = LRUCache.createKey('tool', { a: 1, b: 2 })
      expect(key1).toBe(key2)
    })

    it('should create same key regardless of parameter order', () => {
      const key1 = LRUCache.createKey('tool', { a: 1, b: 2 })
      const key2 = LRUCache.createKey('tool', { b: 2, a: 1 })
      expect(key1).toBe(key2)
    })

    it('should create different keys for different tools', () => {
      const key1 = LRUCache.createKey('tool1', { a: 1 })
      const key2 = LRUCache.createKey('tool2', { a: 1 })
      expect(key1).not.toBe(key2)
    })

    it('should create different keys for different params', () => {
      const key1 = LRUCache.createKey('tool', { a: 1 })
      const key2 = LRUCache.createKey('tool', { a: 2 })
      expect(key1).not.toBe(key2)
    })

    it('should handle empty params', () => {
      const key = LRUCache.createKey('tool', {})
      expect(key).toBe('tool:{}')
    })

    it('should handle complex nested objects', () => {
      const key = LRUCache.createKey('tool', {
        nested: { deep: { value: 1 } },
        array: [1, 2, 3],
      })
      expect(typeof key).toBe('string')
      expect(key).toContain('tool:')
    })

    it('should produce different keys for nested objects with different key ordering (known limitation)', () => {
      // Note: createKey only sorts top-level keys, not nested object keys.
      // This is a known limitation - nested objects are serialized as-is by JSON.stringify,
      // which preserves the insertion order of keys. If deep key-order stability is needed,
      // createKey would need to recursively sort all nested object keys.
      const key1 = LRUCache.createKey('tool', { a: { x: 1, y: 2 } })
      const key2 = LRUCache.createKey('tool', { a: { y: 2, x: 1 } })

      // These produce different keys because nested object key order is not normalized
      expect(key1).not.toBe(key2)
    })
  })
})
