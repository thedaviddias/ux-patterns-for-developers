/**
 * suggest_pattern tool
 * Context-based pattern recommendations
 */

import { getPatterns } from '../data'
import { similarityRatio } from '../utils'
import type { SuggestPatternParams, SuggestPatternResponse } from '../types'

export const suggestPatternDefinition = {
  name: 'suggest_pattern',
  description: 'Get pattern suggestions based on your current development context',
  inputSchema: {
    type: 'object' as const,
    properties: {
      context: {
        type: 'string',
        description: 'Description of what you are building (e.g., "user signup form with validation")',
      },
      category: {
        type: 'string',
        description: 'Preferred category (optional)',
      },
      limit: {
        type: 'number',
        description: 'Maximum suggestions (default: 5)',
        default: 5,
      },
    },
    required: ['context'],
  },
}

// Keywords that help identify pattern relevance
const patternKeywords: Record<string, string[]> = {
  'forms/text-field': ['input', 'text', 'field', 'form', 'type', 'enter', 'name', 'email'],
  'forms/autocomplete': ['autocomplete', 'autosuggest', 'search', 'suggestion', 'typeahead'],
  'forms/checkbox': ['checkbox', 'check', 'select', 'multiple', 'option', 'toggle'],
  'forms/radio': ['radio', 'choice', 'single', 'option', 'select one'],
  'forms/toggle-switch': ['toggle', 'switch', 'on/off', 'enable', 'disable', 'setting'],
  'forms/validation': ['validation', 'validate', 'error', 'required', 'check'],
  'navigation/pagination': ['pagination', 'page', 'pages', 'next', 'previous', 'list'],
  'navigation/infinite-scroll': ['infinite', 'scroll', 'load more', 'endless', 'feed'],
  'navigation/breadcrumb': ['breadcrumb', 'navigation', 'path', 'hierarchy', 'location'],
  'navigation/tabs': ['tabs', 'tab', 'section', 'switch', 'panel'],
  'overlays/modal': ['modal', 'dialog', 'popup', 'overlay', 'confirm', 'alert'],
  'overlays/drawer': ['drawer', 'sidebar', 'slide', 'panel', 'menu'],
  'overlays/tooltip': ['tooltip', 'hint', 'help', 'info', 'hover'],
  'overlays/popover': ['popover', 'dropdown', 'menu', 'context'],
  'user-feedback/toast': ['toast', 'notification', 'message', 'alert', 'snackbar'],
  'user-feedback/loading-indicator': ['loading', 'spinner', 'progress', 'wait'],
  'user-feedback/skeleton': ['skeleton', 'placeholder', 'loading', 'shimmer'],
  'content/accordion': ['accordion', 'collapse', 'expand', 'faq', 'section'],
  'content/cards': ['card', 'cards', 'grid', 'item', 'preview'],
  'content/table': ['table', 'data', 'grid', 'rows', 'columns', 'list'],
}

interface ScoredSuggestion {
  pattern: string
  title: string
  relevance: number
  reason: string
  category: string
}

export async function suggestPattern(
  args: Record<string, unknown>
): Promise<SuggestPatternResponse> {
  const params = args as unknown as SuggestPatternParams
  const { context, category, limit = 5 } = params

  if (!context || context.trim().length === 0) {
    return { suggestions: [] }
  }

  const patterns = getPatterns()
  const contextLower = context.toLowerCase()
  const contextWords = contextLower.split(/\s+/)

  const suggestions: ScoredSuggestion[] = patterns
    .map((pattern) => {
      let relevance = 0
      const reasons: string[] = []

      // Check pattern keywords
      const patternSlug = pattern.slug.replace('patterns/', '')
      const keywords = patternKeywords[patternSlug] || []

      for (const keyword of keywords) {
        if (contextLower.includes(keyword)) {
          relevance += 20
          reasons.push(`Matches keyword "${keyword}"`)
        }
      }

      // Check title similarity
      for (const word of contextWords) {
        if (pattern.title.toLowerCase().includes(word)) {
          relevance += 15
          reasons.push(`Title contains "${word}"`)
        }
      }

      // Check description
      if (pattern.description) {
        for (const word of contextWords) {
          if (word.length > 3 && pattern.description.toLowerCase().includes(word)) {
            relevance += 5
          }
        }
      }

      // Check aliases
      if (pattern.aliases) {
        for (const alias of pattern.aliases) {
          if (contextLower.includes(alias.toLowerCase())) {
            relevance += 25
            reasons.push(`Matches alias "${alias}"`)
          }
        }
      }

      // Category match bonus
      if (category && pattern.category.toLowerCase() === category.toLowerCase()) {
        relevance += 10
      }

      return {
        pattern: pattern.slug,
        title: pattern.title,
        relevance,
        reason: reasons.length > 0 ? reasons[0] : 'May be relevant to your context',
        category: pattern.category,
      }
    })
    .filter((s) => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)

  // Normalize relevance scores to 0-1
  const maxRelevance = suggestions.length > 0 ? suggestions[0].relevance : 1
  const normalized = suggestions.map((s) => ({
    ...s,
    relevance: Math.min(1, s.relevance / maxRelevance),
  }))

  return { suggestions: normalized }
}
