/**
 * Auto-link glossary terms in content
 */

export interface GlossaryTerm {
  term: string
  slug: string
  definition?: string
}

/**
 * Create a regex pattern for a term that matches word boundaries
 */
function createTermPattern(term: string): RegExp {
  // Escape special regex characters
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Match whole words only, case-insensitive
  return new RegExp(`\\b(${escaped})\\b`, 'gi')
}

/**
 * Link glossary terms in markdown content
 * Replaces term occurrences with markdown links
 */
export function linkGlossaryTerms(
  content: string,
  glossaryTerms: GlossaryTerm[],
  options: {
    baseUrl?: string
    maxLinksPerTerm?: number
  } = {}
): string {
  const { baseUrl = '/glossary', maxLinksPerTerm = 1 } = options

  let result = content
  const linkedTerms = new Map<string, number>()

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...glossaryTerms].sort(
    (a, b) => b.term.length - a.term.length
  )

  for (const { term, slug } of sortedTerms) {
    const termLower = term.toLowerCase()
    const currentCount = linkedTerms.get(termLower) || 0

    if (currentCount >= maxLinksPerTerm) {
      continue
    }

    const pattern = createTermPattern(term)
    let matchCount = 0

    result = result.replace(pattern, (match, _p1, offset, originalString) => {
      // Don't link if we're already at the max
      if (matchCount + currentCount >= maxLinksPerTerm) {
        return match
      }

      // Don't link if we're inside a markdown link already
      // Use the offset parameter to get correct position in original string
      const beforeMatch = originalString.slice(0, offset)
      const openBrackets = (beforeMatch.match(/\[/g) || []).length
      const closeBrackets = (beforeMatch.match(/\]/g) || []).length
      if (openBrackets > closeBrackets) {
        return match
      }

      matchCount++
      return `[${match}](${baseUrl}/${slug})`
    })

    linkedTerms.set(termLower, currentCount + matchCount)
  }

  return result
}

/**
 * Extract glossary terms mentioned in content
 */
export function findMentionedTerms(
  content: string,
  glossaryTerms: GlossaryTerm[]
): GlossaryTerm[] {
  const mentioned: GlossaryTerm[] = []

  for (const term of glossaryTerms) {
    const pattern = createTermPattern(term.term)
    if (pattern.test(content)) {
      mentioned.push(term)
    }
  }

  return mentioned
}

/**
 * Get a brief definition for inline display
 */
export function getBriefDefinition(
  definition: string,
  maxLength = 100
): string {
  if (definition.length <= maxLength) {
    return definition
  }

  // Find a good break point
  const truncated = definition.slice(0, maxLength)
  const lastPeriod = truncated.lastIndexOf('.')
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastPeriod > maxLength * 0.7) {
    return truncated.slice(0, lastPeriod + 1)
  }

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}
