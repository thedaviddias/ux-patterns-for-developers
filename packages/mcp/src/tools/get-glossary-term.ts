/**
 * get_glossary_term tool
 * Returns definition and related information for a glossary term
 */

import { getGlossaryEntry, getGlossaryEntries, getPatterns } from '../data'
import { findBestMatches } from '../utils'
import { mdxToMarkdown } from '../utils/mdx-to-markdown'
import type { GetGlossaryTermParams, GetGlossaryTermResponse, MCPError } from '../types'

export const getGlossaryTermDefinition = {
  name: 'get_glossary_term',
  description: 'Get the definition and related information for a UX/UI glossary term',
  inputSchema: {
    type: 'object' as const,
    properties: {
      term: {
        type: 'string',
        description: 'The term to look up (e.g., "ARIA", "accessibility")',
      },
    },
    required: ['term'],
  },
}

export async function getGlossaryTerm(
  args: Record<string, unknown>
): Promise<GetGlossaryTermResponse | MCPError> {
  const params = args as unknown as GetGlossaryTermParams
  const { term } = params

  if (!term || term.trim().length === 0) {
    return {
      error: 'INVALID_PARAMS',
      message: 'Term parameter is required',
    }
  }

  // Try to find the glossary entry
  const entry = getGlossaryEntry(term)

  if (!entry) {
    // Get all terms for suggestions
    const entries = getGlossaryEntries()
    const allTerms = entries.map((e) => e.term)
    const suggestions = findBestMatches(term, allTerms, { maxResults: 3 })

    return {
      error: 'NOT_FOUND',
      message: `Glossary term "${term}" not found`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    }
  }

  // Find patterns that mention this term
  const patterns = getPatterns()
  const termLower = entry.term.toLowerCase()
  const relatedPatterns = patterns
    .filter(
      (p) =>
        p.title.toLowerCase().includes(termLower) ||
        p.description.toLowerCase().includes(termLower) ||
        p.body.toLowerCase().includes(termLower)
    )
    .slice(0, 5)
    .map((p) => p.slug)

  // Find related glossary terms
  const entries = getGlossaryEntries()
  const relatedTerms = entries
    .filter((e) => {
      if (e.slug === entry.slug) return false
      // Check if terms are related by content
      const entryTermLower = e.term.toLowerCase()
      return (
        entry.definition.toLowerCase().includes(entryTermLower) ||
        e.definition.toLowerCase().includes(termLower)
      )
    })
    .slice(0, 5)
    .map((e) => e.term)

  return {
    term: entry.term,
    definition: entry.definition,
    relatedTerms: relatedTerms.length > 0 ? relatedTerms : undefined,
    relatedPatterns: relatedPatterns.length > 0 ? relatedPatterns : undefined,
  }
}
