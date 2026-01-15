/**
 * Fuzzy matching utilities using Levenshtein distance
 * Used for "did you mean?" suggestions
 */

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLower = a.toLowerCase()
  const bLower = b.toLowerCase()

  if (aLower === bLower) return 0
  if (aLower.length === 0) return bLower.length
  if (bLower.length === 0) return aLower.length

  const matrix: number[][] = []

  // Initialize first column
  for (let i = 0; i <= bLower.length; i++) {
    matrix[i] = [i]
  }

  // Initialize first row
  for (let j = 0; j <= aLower.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= bLower.length; i++) {
    for (let j = 1; j <= aLower.length; j++) {
      const cost = bLower[i - 1] === aLower[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return matrix[bLower.length][aLower.length]
}

/**
 * Calculate similarity ratio between two strings (0 to 1)
 */
export function similarityRatio(a: string, b: string): number {
  // Use lowercased lengths for consistency with levenshteinDistance
  // (handles Unicode case conversion edge cases)
  const maxLen = Math.max(a.toLowerCase().length, b.toLowerCase().length)
  if (maxLen === 0) return 1
  const distance = levenshteinDistance(a, b)
  return 1 - distance / maxLen
}

/**
 * Find the best matches for a query string from a list of candidates
 */
export function findBestMatches(
  query: string,
  candidates: string[],
  options: {
    maxResults?: number
    minSimilarity?: number
  } = {}
): string[] {
  const { maxResults = 3, minSimilarity = 0.3 } = options

  const scored = candidates
    .map((candidate) => ({
      candidate,
      similarity: similarityRatio(query, candidate),
    }))
    .filter(({ similarity }) => similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)

  return scored.map(({ candidate }) => candidate)
}

/**
 * Check if a string contains another string (case-insensitive)
 */
export function containsIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

/**
 * Find items that match a search query
 * Matches by exact substring or fuzzy match
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[],
  options: { minSimilarity?: number } = {}
): T[] {
  const { minSimilarity = 0.4 } = options
  const queryLower = query.toLowerCase()

  return items.filter((item) => {
    const texts = getSearchableText(item)

    // Check for exact substring match first
    for (const text of texts) {
      if (text.toLowerCase().includes(queryLower)) {
        return true
      }
    }

    // Check for fuzzy match
    for (const text of texts) {
      // Split into words and check each
      const words = text.toLowerCase().split(/\s+/)
      for (const word of words) {
        if (similarityRatio(queryLower, word) >= minSimilarity) {
          return true
        }
      }
    }

    return false
  })
}
