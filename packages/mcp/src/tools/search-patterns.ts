/**
 * search_patterns tool
 * Full-text search across patterns
 */

import { getPatterns } from '../data'
import { paginate, similarityRatio } from '../utils'
import type { SearchPatternsResponse } from '../types'

export const searchPatternsDefinition = {
  name: 'search_patterns',
  description: 'Search for UX patterns by keyword, with relevance scoring',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query (keywords or phrase)',
      },
      category: {
        type: 'string',
        description: 'Optional category filter',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional tag filters',
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 20, max: 100)',
        default: 20,
      },
      cursor: {
        type: 'string',
        description: 'Pagination cursor',
      },
    },
    required: ['query'],
  },
}

interface ScoredPattern {
  slug: string
  title: string
  summary: string
  category: string
  tags: string[]
  score: number
}

// Limit validation constants
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export async function searchPatterns(
  args: Record<string, unknown>
): Promise<SearchPatternsResponse> {
  // Runtime validation for robustness against malformed input
  const query = typeof args.query === 'string' ? args.query : ''
  const category = typeof args.category === 'string' ? args.category : undefined
  const tags = Array.isArray(args.tags) && args.tags.every((t) => typeof t === 'string')
    ? (args.tags as string[])
    : undefined
  const rawLimit = args.limit
  const cursor = typeof args.cursor === 'string' ? args.cursor : undefined

  // Validate and normalize limit (default: 20, max: 100, min: 1)
  let limit = DEFAULT_LIMIT
  if (typeof rawLimit === 'number' && Number.isFinite(rawLimit)) {
    limit = Math.min(Math.max(Math.floor(rawLimit), 1), MAX_LIMIT)
  }

  if (!query || query.trim().length === 0) {
    return {
      results: [],
      total: 0,
      hasMore: false,
    }
  }

  // Get all patterns
  let patterns = getPatterns()

  // Apply category filter
  if (category) {
    patterns = patterns.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Apply tag filter (AND logic - pattern must have ALL specified tags)
  if (tags && tags.length > 0) {
    const tagsLower = tags.map((t) => t.toLowerCase())
    patterns = patterns.filter((p) =>
      tagsLower.every((tag) => p.tags?.some((t) => t.toLowerCase() === tag))
    )
  }

  // Score patterns based on query match
  const queryLower = query.toLowerCase()
  const scored: ScoredPattern[] = patterns
    .map((pattern) => {
      let score = 0

      // Title exact match (highest weight)
      if (pattern.title.toLowerCase() === queryLower) {
        score += 100
      } else if (pattern.title.toLowerCase().includes(queryLower)) {
        score += 50
      } else {
        // Fuzzy title match
        const titleSimilarity = similarityRatio(queryLower, pattern.title.toLowerCase())
        score += titleSimilarity * 30
      }

      // Alias match
      if (pattern.aliases?.some((a) => a.toLowerCase().includes(queryLower))) {
        score += 40
      }

      // Summary/description match
      if (pattern.summary?.toLowerCase().includes(queryLower)) {
        score += 20
      }
      if (pattern.description.toLowerCase().includes(queryLower)) {
        score += 15
      }

      // Tag match
      if (pattern.tags?.some((t) => t.toLowerCase().includes(queryLower))) {
        score += 10
      }

      // Category match
      if (pattern.category.toLowerCase().includes(queryLower)) {
        score += 5
      }

      return {
        slug: pattern.slug,
        title: pattern.title,
        summary: pattern.summary || pattern.description.slice(0, 150),
        category: pattern.category,
        tags: pattern.tags || [],
        score,
      }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)

  // Paginate results
  const paginated = paginate(scored, { cursor, limit })

  return {
    results: paginated.items,
    total: paginated.total,
    cursor: paginated.nextCursor,
    hasMore: paginated.hasMore,
  }
}
