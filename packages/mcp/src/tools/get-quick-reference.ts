/**
 * get_quick_reference tool
 * Returns token-efficient summaries of patterns
 */

import { getPatterns } from '../data'
import type { GetQuickReferenceParams, GetQuickReferenceResponse } from '../types'

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
  const params = args as unknown as GetQuickReferenceParams
  const { category, limit = 50, includeRelated = false } = params

  let patterns = getPatterns()

  // Filter by category if specified
  if (category) {
    patterns = patterns.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Limit results
  const limited = patterns.slice(0, limit)

  return {
    patterns: limited.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary || p.description.slice(0, 100),
      category: p.category,
      tags: p.tags || [],
    })),
    total: patterns.length,
  }
}
