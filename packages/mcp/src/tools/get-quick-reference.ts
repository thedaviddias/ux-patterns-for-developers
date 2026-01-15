/**
 * get_quick_reference tool
 * Returns token-efficient summaries of patterns
 */

import { getPatterns } from '../data'
import type { GetQuickReferenceResponse } from '../types'

export const getQuickReferenceDefinition = {
  name: 'get_quick_reference',
  description: 'Get a token-efficient quick reference of UX patterns for AI context windows',
  inputSchema: {
    type: 'object' as const,
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category (e.g., "forms", "navigation")',
      },
      limit: {
        type: 'number',
        description: 'Maximum patterns to include (default: 50)',
        default: 50,
      },
      includeRelated: {
        type: 'boolean',
        description: 'Include related pattern links (default: false)',
        default: false,
      },
    },
    required: [],
  },
}

export async function getQuickReference(
  args: Record<string, unknown> = {}
): Promise<GetQuickReferenceResponse> {
  // Runtime validation for robustness against malformed input
  const category = typeof args.category === 'string' ? args.category : undefined
  const limit = typeof args.limit === 'number' && Number.isFinite(args.limit) ? args.limit : 50
  const includeRelated = typeof args.includeRelated === 'boolean' ? args.includeRelated : false

  const allPatterns = getPatterns()
  let patterns = allPatterns

  // Filter by category if specified
  if (category) {
    patterns = patterns.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Limit results
  const limited = patterns.slice(0, limit)

  // Build response with optional related patterns
  const responsePatterns = limited.map((p) => {
    const base = {
      slug: p.slug,
      title: p.title,
      summary: p.summary || p.description?.slice(0, 100) || '',
      category: p.category,
      tags: p.tags || [],
    }

    if (includeRelated) {
      // Find related patterns by category (same category, different pattern)
      const related = allPatterns
        .filter(
          (other) =>
            other.slug !== p.slug &&
            other.category.toLowerCase() === p.category.toLowerCase()
        )
        .slice(0, 3)
        .map((r) => r.slug)

      return { ...base, related }
    }

    return base
  })

  return {
    patterns: responsePatterns,
    total: patterns.length,
  }
}
