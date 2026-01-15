/**
 * Manual pattern relationship definitions
 * Maps patterns to related patterns for recommendations
 */

export interface PatternRelationship {
  pattern: string
  related: string[]
  complementary: string[]
  alternatives: string[]
}

/**
 * Pattern relationships map
 * Key: pattern slug (without 'patterns/' prefix)
 * Value: related pattern slugs
 */
export const patternRelationships: Record<string, PatternRelationship> = {
  // Forms - Input Patterns
  'forms/text-field': {
    pattern: 'forms/text-field',
    related: ['forms/autocomplete', 'forms/textarea', 'forms/validation'],
    complementary: ['forms/form-layout', 'forms/input-masking'],
    alternatives: ['forms/selection-input', 'forms/date-picker'],
  },
  'forms/autocomplete': {
    pattern: 'forms/autocomplete',
    related: ['forms/text-field', 'forms/combobox', 'advanced/search-results'],
    complementary: ['forms/validation', 'user-feedback/loading-indicator'],
    alternatives: ['forms/selection-input', 'forms/combobox'],
  },
  'forms/selection-input': {
    pattern: 'forms/selection-input',
    related: ['forms/radio', 'forms/checkbox', 'forms/dropdown'],
    complementary: ['forms/validation', 'forms/form-layout'],
    alternatives: ['forms/autocomplete', 'forms/combobox'],
  },
  'forms/checkbox': {
    pattern: 'forms/checkbox',
    related: ['forms/radio', 'forms/toggle-switch', 'forms/selection-input'],
    complementary: ['forms/validation', 'forms/form-layout'],
    alternatives: ['forms/toggle-switch', 'forms/selection-input'],
  },
  'forms/radio': {
    pattern: 'forms/radio',
    related: ['forms/checkbox', 'forms/selection-input', 'forms/button-group'],
    complementary: ['forms/validation', 'forms/form-layout'],
    alternatives: ['forms/selection-input', 'forms/button-group'],
  },
  'forms/toggle-switch': {
    pattern: 'forms/toggle-switch',
    related: ['forms/checkbox', 'forms/radio'],
    complementary: ['forms/validation', 'user-feedback/toast'],
    alternatives: ['forms/checkbox'],
  },

  // Navigation Patterns
  'navigation/breadcrumb': {
    pattern: 'navigation/breadcrumb',
    related: ['navigation/sidebar', 'navigation/tabs', 'layout/header'],
    complementary: ['navigation/back-to-top'],
    alternatives: [],
  },
  'navigation/pagination': {
    pattern: 'navigation/pagination',
    related: ['navigation/infinite-scroll', 'content/table', 'content/list'],
    complementary: ['user-feedback/loading-indicator', 'navigation/filters'],
    alternatives: ['navigation/infinite-scroll', 'navigation/load-more'],
  },
  'navigation/infinite-scroll': {
    pattern: 'navigation/infinite-scroll',
    related: ['navigation/pagination', 'content/list', 'content/cards'],
    complementary: ['user-feedback/loading-indicator', 'user-feedback/skeleton'],
    alternatives: ['navigation/pagination', 'navigation/load-more'],
  },
  'navigation/tabs': {
    pattern: 'navigation/tabs',
    related: ['navigation/sidebar', 'content/accordion', 'layout/header'],
    complementary: ['navigation/breadcrumb'],
    alternatives: ['content/accordion', 'navigation/sidebar'],
  },

  // User Feedback Patterns
  'user-feedback/toast': {
    pattern: 'user-feedback/toast',
    related: ['user-feedback/snackbar', 'user-feedback/alert', 'overlays/modal'],
    complementary: ['forms/validation'],
    alternatives: ['user-feedback/snackbar', 'user-feedback/inline-message'],
  },
  'user-feedback/loading-indicator': {
    pattern: 'user-feedback/loading-indicator',
    related: ['user-feedback/skeleton', 'user-feedback/progress-bar'],
    complementary: ['navigation/pagination', 'forms/submit-button'],
    alternatives: ['user-feedback/skeleton'],
  },
  'user-feedback/skeleton': {
    pattern: 'user-feedback/skeleton',
    related: ['user-feedback/loading-indicator', 'content/cards', 'content/list'],
    complementary: ['navigation/infinite-scroll'],
    alternatives: ['user-feedback/loading-indicator'],
  },

  // Overlay Patterns
  'overlays/modal': {
    pattern: 'overlays/modal',
    related: ['overlays/drawer', 'overlays/popover', 'overlays/dialog'],
    complementary: ['user-feedback/toast', 'forms/form-layout'],
    alternatives: ['overlays/drawer', 'overlays/dialog'],
  },
  'overlays/drawer': {
    pattern: 'overlays/drawer',
    related: ['overlays/modal', 'navigation/sidebar', 'overlays/popover'],
    complementary: ['navigation/sidebar'],
    alternatives: ['overlays/modal', 'navigation/sidebar'],
  },
  'overlays/tooltip': {
    pattern: 'overlays/tooltip',
    related: ['overlays/popover', 'user-feedback/inline-help'],
    complementary: ['forms/text-field', 'content/icons'],
    alternatives: ['overlays/popover'],
  },
  'overlays/popover': {
    pattern: 'overlays/popover',
    related: ['overlays/tooltip', 'overlays/dropdown', 'overlays/modal'],
    complementary: ['forms/selection-input'],
    alternatives: ['overlays/tooltip', 'overlays/modal'],
  },

  // Content Patterns
  'content/accordion': {
    pattern: 'content/accordion',
    related: ['content/collapse', 'navigation/tabs', 'content/faq'],
    complementary: ['content/list'],
    alternatives: ['navigation/tabs', 'content/disclosure'],
  },
  'content/cards': {
    pattern: 'content/cards',
    related: ['content/list', 'content/table', 'layout/grid'],
    complementary: ['navigation/pagination', 'user-feedback/skeleton'],
    alternatives: ['content/list', 'content/table'],
  },
  'content/table': {
    pattern: 'content/table',
    related: ['content/list', 'content/cards', 'navigation/pagination'],
    complementary: ['navigation/filters', 'forms/search'],
    alternatives: ['content/list', 'content/cards'],
  },
}

/**
 * Get relationships for a pattern
 */
export function getPatternRelationships(
  patternSlug: string
): PatternRelationship | null {
  // Normalize the slug
  const normalizedSlug = patternSlug.replace(/^patterns\//, '')
  return patternRelationships[normalizedSlug] || null
}

/**
 * Get all related patterns for a pattern
 */
export function getRelatedPatterns(patternSlug: string): string[] {
  const relationships = getPatternRelationships(patternSlug)
  if (!relationships) return []

  return [
    ...relationships.related,
    ...relationships.complementary,
    ...relationships.alternatives,
  ]
}

/**
 * Find patterns that are alternatives to the given pattern
 */
export function getAlternativePatterns(patternSlug: string): string[] {
  const relationships = getPatternRelationships(patternSlug)
  return relationships?.alternatives || []
}

/**
 * Find patterns that complement the given pattern
 */
export function getComplementaryPatterns(patternSlug: string): string[] {
  const relationships = getPatternRelationships(patternSlug)
  return relationships?.complementary || []
}
