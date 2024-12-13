import { getPatternCategories, type PatternCategory } from './get-pattern-categories'

export async function getPatterns(lang: string): Promise<PatternCategory[]> {
  const categories = await getPatternCategories(lang)

  return categories.map(category => ({
    name: category.name,
    path: category.path,
    patterns: category.patterns.sort((a, b) => a.title.localeCompare(b.title))
  }))
}
