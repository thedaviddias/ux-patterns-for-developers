/**
 * list_patterns tool
 * Returns patterns with optional category filter and pagination
 */

import { getPatterns, getCategories } from '../data'
import { paginate, findBestMatches } from '../utils'
import type { ListPatternsParams, ListPatternsResponse } from '../types'

export const listPatternsDefinition = {
  name: 'list_patterns',
  description: 'List UX patterns with optional filtering by category and pagination',
  inputSchema: {
    type: 'object' as const,
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category slug (e.g., "forms", "navigation")',
      },
      status: {
        type: 'string',
        enum: ['complete', 'published'],
        description: 'Filter by status (defaults to all published/complete)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of patterns to return (default: 20, max: 100)',
        default: 20,
      },
      cursor: {
        type: 'string',
        description: 'Pagination cursor from previous response',
      },
    },
    required: [],
  },
}

export async function listPatterns(
  args: Record<string, unknown> = {}
): Promise<ListPatternsResponse> {
  const params = args as ListPatternsParams
  let patterns = getPatterns()

  // Filter by category if specified
  if (params.category) {
    const categoryLower = params.category.toLowerCase()
    patterns = patterns.filter(
      (p) => p.category.toLowerCase() === categoryLower
    )

    // If no patterns found, suggest similar categories
    if (patterns.length === 0) {
      const categories = getCategories()
      const categoryNames = categories.map((c) => c.slug)
      const suggestions = findBestMatches(params.category, categoryNames)

      if (suggestions.length > 0) {
        return {
          patterns: [],
          total: 0,
          hasMore: false,
          suggestions: suggestions.map((s) => `Did you mean "${s}"?`),
        }
      }
    }
  }

  // Filter by status if specified
  if (params.status) {
    patterns = patterns.filter((p) => p.status === params.status)
  }

  // Validate and normalize limit (default: 20, max: 100, min: 1)
  const DEFAULT_LIMIT = 20
  const MAX_LIMIT = 100
  let validatedLimit = DEFAULT_LIMIT
  if (typeof params.limit === 'number' && Number.isFinite(params.limit)) {
    validatedLimit = Math.min(Math.max(Math.floor(params.limit), 1), MAX_LIMIT)
  }

  // Paginate results
  const paginated = paginate(patterns, {
    cursor: params.cursor,
    limit: validatedLimit,
  })

  return {
    // Note: getPatterns() only returns 'complete' or 'published' patterns (drafts are filtered)
    patterns: paginated.items.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary || p.description.slice(0, 150),
      category: p.category,
      status: p.status as 'complete' | 'published',
    })),
    total: paginated.total,
    cursor: paginated.nextCursor,
    hasMore: paginated.hasMore,
  }
}
