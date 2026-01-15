/**
 * Tests for cursor-based pagination utilities
 */

import {
  encodeCursor,
  decodeCursor,
  paginate,
  getPaginationMeta,
} from '../../utils/pagination'

describe('Pagination', () => {
  describe('encodeCursor', () => {
    it('should encode offset to base64 cursor', () => {
      const cursor = encodeCursor(0)
      expect(typeof cursor).toBe('string')
      expect(cursor.length).toBeGreaterThan(0)
    })

    it('should create different cursors for different offsets', () => {
      const cursor1 = encodeCursor(0)
      const cursor2 = encodeCursor(10)
      expect(cursor1).not.toBe(cursor2)
    })

    it('should handle large offsets', () => {
      const cursor = encodeCursor(1000000)
      expect(typeof cursor).toBe('string')
      expect(decodeCursor(cursor)).toBe(1000000)
    })
  })

  describe('decodeCursor', () => {
    it('should decode valid cursor to offset', () => {
      const cursor = encodeCursor(42)
      expect(decodeCursor(cursor)).toBe(42)
    })

    it('should return 0 for invalid base64', () => {
      expect(decodeCursor('not-valid-base64!!!')).toBe(0)
    })

    it('should return 0 for wrong format', () => {
      // Valid base64 but wrong format
      const wrongFormat = Buffer.from('wrong:format').toString('base64')
      expect(decodeCursor(wrongFormat)).toBe(0)
    })

    it('should return 0 for empty string', () => {
      expect(decodeCursor('')).toBe(0)
    })

    it('should handle round-trip encoding/decoding', () => {
      for (const offset of [0, 1, 10, 100, 1000, 10000]) {
        const cursor = encodeCursor(offset)
        expect(decodeCursor(cursor)).toBe(offset)
      }
    })
  })

  describe('paginate', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }))

    it('should return first page with default limit', () => {
      const result = paginate(items, {})
      expect(result.items.length).toBe(20) // Default limit
      expect(result.total).toBe(100)
      expect(result.hasMore).toBe(true)
      expect(result.nextCursor).toBeDefined()
    })

    it('should respect custom limit', () => {
      const result = paginate(items, { limit: 10 })
      expect(result.items.length).toBe(10)
      expect(result.hasMore).toBe(true)
    })

    it('should cap limit at 100', () => {
      const result = paginate(items, { limit: 200 })
      expect(result.items.length).toBe(100)
    })

    it('should enforce minimum limit of 1', () => {
      const result = paginate(items, { limit: 0 })
      expect(result.items.length).toBe(1)
    })

    it('should handle negative limits', () => {
      const result = paginate(items, { limit: -10 })
      expect(result.items.length).toBe(1)
    })

    it('should use cursor for pagination', () => {
      const page1 = paginate(items, { limit: 10 })
      expect(page1.items[0].id).toBe(0)
      expect(page1.items[9].id).toBe(9)

      const page2 = paginate(items, { limit: 10, cursor: page1.nextCursor })
      expect(page2.items[0].id).toBe(10)
      expect(page2.items[9].id).toBe(19)
    })

    it('should indicate no more items on last page', () => {
      const result = paginate(items.slice(0, 5), { limit: 10 })
      expect(result.hasMore).toBe(false)
      expect(result.nextCursor).toBeUndefined()
    })

    it('should handle empty arrays', () => {
      const result = paginate([], {})
      expect(result.items).toEqual([])
      expect(result.total).toBe(0)
      expect(result.hasMore).toBe(false)
      expect(result.nextCursor).toBeUndefined()
    })

    it('should handle exact page boundary', () => {
      const exactItems = Array.from({ length: 20 }, (_, i) => ({ id: i }))
      const result = paginate(exactItems, { limit: 20 })
      expect(result.items.length).toBe(20)
      expect(result.hasMore).toBe(false)
    })

    it('should handle cursor beyond items length', () => {
      const cursor = encodeCursor(1000)
      const result = paginate(items, { cursor })
      expect(result.items).toEqual([])
      expect(result.hasMore).toBe(false)
    })

    it('should paginate through entire dataset', () => {
      let cursor: string | undefined
      const allItems: number[] = []
      let pageCount = 0

      do {
        const result = paginate(items, { limit: 15, cursor })
        allItems.push(...result.items.map((i) => i.id))
        cursor = result.nextCursor
        pageCount++
      } while (cursor && pageCount < 20)

      expect(allItems.length).toBe(100)
      expect(allItems).toEqual(items.map((i) => i.id))
      expect(pageCount).toBe(7) // ceil(100/15) = 7
    })
  })

  describe('getPaginationMeta', () => {
    it('should return correct metadata for first page', () => {
      const meta = getPaginationMeta(100, {})
      expect(meta.offset).toBe(0)
      expect(meta.limit).toBe(20) // Default
      expect(meta.hasMore).toBe(true)
    })

    it('should return correct metadata with cursor', () => {
      const cursor = encodeCursor(50)
      const meta = getPaginationMeta(100, { cursor, limit: 20 })
      expect(meta.offset).toBe(50)
      expect(meta.limit).toBe(20)
      expect(meta.hasMore).toBe(true)
    })

    it('should indicate no more on last page', () => {
      const cursor = encodeCursor(80)
      const meta = getPaginationMeta(100, { cursor, limit: 20 })
      expect(meta.hasMore).toBe(false)
    })

    it('should cap limit at 100', () => {
      const meta = getPaginationMeta(1000, { limit: 500 })
      expect(meta.limit).toBe(100)
    })

    it('should enforce minimum limit of 1', () => {
      const meta = getPaginationMeta(100, { limit: -5 })
      expect(meta.limit).toBe(1)
    })
  })
})
