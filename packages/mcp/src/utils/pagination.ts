/**
 * Cursor-based pagination utilities
 */

export interface PaginationParams {
  cursor?: string
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  nextCursor?: string
  hasMore: boolean
  total: number
}

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

/**
 * Encode an offset into a cursor string
 */
export function encodeCursor(offset: number): string {
  return Buffer.from(`offset:${offset}`).toString('base64')
}

/**
 * Decode a cursor string into an offset
 */
export function decodeCursor(cursor: string): number {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    const match = decoded.match(/^offset:(\d+)$/)
    if (match) {
      return parseInt(match[1], 10)
    }
  } catch {
    // Invalid cursor, return 0
  }
  return 0
}

/**
 * Apply pagination to an array of items
 */
export function paginate<T>(
  items: T[],
  params: PaginationParams
): PaginatedResult<T> {
  const offset = params.cursor ? decodeCursor(params.cursor) : 0
  const limit = Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT)

  const paginatedItems = items.slice(offset, offset + limit)
  const hasMore = offset + limit < items.length

  return {
    items: paginatedItems,
    nextCursor: hasMore ? encodeCursor(offset + limit) : undefined,
    hasMore,
    total: items.length,
  }
}

/**
 * Get pagination metadata without items
 */
export function getPaginationMeta(
  total: number,
  params: PaginationParams
): { offset: number; limit: number; hasMore: boolean } {
  const offset = params.cursor ? decodeCursor(params.cursor) : 0
  const limit = Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT)

  return {
    offset,
    limit,
    hasMore: offset + limit < total,
  }
}
