/**
 * get_pattern tool
 * Returns full pattern details including body content
 */

import { getPatternBySlug, getPatterns, getGlossaryEntries } from '../data'
import { getRelatedPatterns } from '../data/relationships'
import { findBestMatches } from '../utils'
import { mdxToMarkdown, truncateContent } from '../utils/mdx-to-markdown'
import { findMentionedTerms } from '../utils/glossary-linker'
import type { GetPatternParams, GetPatternResponse, MCPError } from '../types'

export const getPatternDefinition = {
  name: 'get_pattern',
  description: 'Get detailed information about a specific UX pattern including implementation guidance',
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: 'Pattern name or slug (e.g., "autocomplete", "forms/text-field")',
      },
      includeToc: {
        type: 'boolean',
        description: 'Include table of contents (default: true)',
        default: true,
      },
    },
    required: ['name'],
  },
}

export async function getPattern(
  args: Record<string, unknown>
): Promise<GetPatternResponse | MCPError> {
  const params = args as unknown as GetPatternParams
  const { name, includeToc = true } = params

  // Try to find the pattern
  let pattern = getPatternBySlug(name)

  // If not found by slug, try to find by title match
  if (!pattern) {
    const patterns = getPatterns()
    pattern = patterns.find(
      (p) =>
        p.title.toLowerCase() === name.toLowerCase() ||
        p.aliases?.some((a) => a.toLowerCase() === name.toLowerCase())
    ) ?? null
  }

  // If still not found, return error with suggestions
  if (!pattern) {
    const patterns = getPatterns()
    const allNames = patterns.flatMap((p) => [
      p.slug.replace('patterns/', ''),
      p.title,
      ...(p.aliases || []),
    ])
    const suggestions = findBestMatches(name, allNames, { maxResults: 3 })

    return {
      error: 'NOT_FOUND',
      message: `Pattern "${name}" not found`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    }
  }

  // Get related patterns from relationships
  const relatedSlugs = getRelatedPatterns(pattern.slug)
  const patterns = getPatterns()
  const relatedPatterns = relatedSlugs
    .map((slug) => {
      const fullSlug = slug.startsWith('patterns/') ? slug : `patterns/${slug}`
      const related = patterns.find((p) => p.slug === fullSlug)
      if (related) {
        return {
          slug: related.slug,
          title: related.title,
          relationship: 'related' as const,
        }
      }
      return null
    })
    .filter(Boolean) as { slug: string; title: string; relationship: 'related' }[]

  // Find glossary terms mentioned in the content
  const glossaryEntries = getGlossaryEntries()
  const glossaryTermsData = glossaryEntries.map((e) => ({
    term: e.term,
    slug: e.slug,
    definition: e.definition,
  }))
  const mentionedTerms = findMentionedTerms(pattern.body, glossaryTermsData)

  // Convert MDX body to plain markdown
  const plainBody = mdxToMarkdown(pattern.body)

  return {
    slug: pattern.slug,
    title: pattern.title,
    summary: pattern.summary || truncateContent(pattern.description, 200),
    description: pattern.description,
    category: [pattern.category],
    tags: pattern.tags || [],
    status: pattern.status as 'complete' | 'published',
    body: plainBody,
    toc: includeToc ? pattern.toc : undefined,
    relatedPatterns,
    glossaryTerms: mentionedTerms.slice(0, 10).map((t) => ({
      term: t.term,
      definition: t.definition || '',
    })),
    metadata: {
      wordCount: pattern.metadata.wordCount,
      readingTime: pattern.metadata.readingTime,
    },
  }
}
