import { PATTERNS, PATTERNS_MAP, type Category, type Pattern } from '@/app/_constants/patterns'

/**
 * Get the patterns for a given language.
 *
 * @param lang - The language to get the patterns for.
 * @returns The patterns for the given language.
 */
export function getPatterns(lang: string): Category[] {
  const categories = new Map<string, Pattern[]>()

  // Initialize categories with empty pattern arrays
  Object.entries(PATTERNS_MAP).forEach(([, value]) => {
    categories.set(value.name, [])
  })

  Object.entries(PATTERNS).forEach(([categoryName, patterns]) => {
    const categoryPatterns = patterns.map(pattern => {
      const href = pattern.href ? `/${lang}${pattern.href}` : undefined
      return {
        ...pattern,
        href,
        comingSoon: href ? false : true
      }
    })
    categories.get(categoryName)?.push(...categoryPatterns)
  })

  return Array.from(categories.entries()).map(([name, patterns]) => ({
    name,
    patterns: patterns.sort((a, b) => a.title.localeCompare(b.title))
  }))
}
