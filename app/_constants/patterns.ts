import { Pattern } from "../_utils/get-pattern-categories"

export const PATTERNS_MAP = {
  'content-management': {
    name: 'Content Management',
    path: 'content-management'
  },
  navigation: {
    name: 'Layout & Navigation',
    path: 'navigation'
  },
  'user-feedback': {
    name: 'User Feedback',
    path: 'user-feedback'
  },
  forms: {
    name: 'Input & Forms',
    path: 'forms'
  },
} as const

export type Category = {
  name: string
  patterns: Pattern[]
}

export const getRandomPattern = async (locale: string = 'en'): Promise<Pattern | null> => {
  const { getPatternCategories } = await import('../_utils/get-pattern-categories')
  const categories = await getPatternCategories(locale)

  const allPatterns = categories.flatMap(category => category.patterns)
  const availablePatterns = allPatterns.filter(pattern =>
    pattern.href && pattern.status !== 'coming-soon'
  )

  if (availablePatterns.length === 0) return null

  const randomIndex = Math.floor(Math.random() * availablePatterns.length)
  const pattern = availablePatterns[randomIndex]

  return pattern || null
}
