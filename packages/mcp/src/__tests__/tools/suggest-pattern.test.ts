/**
 * Tests for suggest_pattern tool
 */

import { jest } from '@jest/globals'
import type { Pattern } from '../../types'

// Mock data module
jest.unstable_mockModule('../../data', () => ({
  getPatterns: jest.fn<() => Pattern[]>(),
}))

const { getPatterns } = await import('../../data')
const { suggestPattern, suggestPatternDefinition } = await import(
  '../../tools/suggest-pattern'
)

// Sample test patterns
const mockPatterns: Pattern[] = [
  {
    slug: 'patterns/forms/text-field',
    title: 'Text Field',
    description: 'Input field for entering text data',
    category: 'forms',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 5, wordCount: 1000 },
    url: '/patterns/forms/text-field',
    aliases: ['input', 'textfield'],
  },
  {
    slug: 'patterns/forms/autocomplete',
    title: 'Autocomplete',
    description: 'Search with auto-suggestions',
    category: 'forms',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 4, wordCount: 800 },
    url: '/patterns/forms/autocomplete',
    aliases: ['typeahead', 'autosuggest'],
  },
  {
    slug: 'patterns/forms/checkbox',
    title: 'Checkbox',
    description: 'Select multiple options',
    category: 'forms',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 3, wordCount: 500 },
    url: '/patterns/forms/checkbox',
  },
  {
    slug: 'patterns/overlays/modal',
    title: 'Modal Dialog',
    description: 'Overlay dialog for confirmations and forms',
    category: 'overlays',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 6, wordCount: 1200 },
    url: '/patterns/overlays/modal',
    aliases: ['dialog', 'popup'],
  },
  {
    slug: 'patterns/navigation/tabs',
    title: 'Tabs',
    description: 'Navigate between content sections',
    category: 'navigation',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 4, wordCount: 900 },
    url: '/patterns/navigation/tabs',
  },
  {
    slug: 'patterns/user-feedback/toast',
    title: 'Toast',
    description: 'Brief notification messages',
    category: 'user-feedback',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 3, wordCount: 600 },
    url: '/patterns/user-feedback/toast',
    aliases: ['snackbar', 'notification'],
  },
]

describe('suggest_pattern tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPatterns as jest.Mock).mockReturnValue([...mockPatterns])
  })

  describe('suggestPatternDefinition', () => {
    it('should have correct name', () => {
      expect(suggestPatternDefinition.name).toBe('suggest_pattern')
    })

    it('should require context parameter', () => {
      expect(suggestPatternDefinition.inputSchema.required).toContain('context')
    })

    it('should have optional category and limit parameters', () => {
      const { properties } = suggestPatternDefinition.inputSchema
      expect(properties).toHaveProperty('category')
      expect(properties).toHaveProperty('limit')
    })
  })

  describe('suggestPattern', () => {
    describe('input validation', () => {
      it('should return empty suggestions for empty context', async () => {
        const result = await suggestPattern({ context: '' })

        expect(result.suggestions).toEqual([])
      })

      it('should return empty suggestions for whitespace-only context', async () => {
        const result = await suggestPattern({ context: '   ' })

        expect(result.suggestions).toEqual([])
      })

      it('should handle non-string context gracefully', async () => {
        const result = await suggestPattern({ context: 123 as any })

        expect(result.suggestions).toEqual([])
      })

      it('should use default limit of 5', async () => {
        const result = await suggestPattern({ context: 'form input' })

        expect(result.suggestions.length).toBeLessThanOrEqual(5)
      })

      it('should respect custom limit', async () => {
        const result = await suggestPattern({
          context: 'form input',
          limit: 2,
        })

        expect(result.suggestions.length).toBeLessThanOrEqual(2)
      })

      it('should cap limit at 20', async () => {
        // Add more patterns to ensure we have enough results
        const manyPatterns = Array.from({ length: 30 }, (_, i) => ({
          ...mockPatterns[0],
          slug: `patterns/forms/pattern-${i}`,
          title: `Form Pattern ${i}`,
          description: 'A form input pattern',
        }))
        ;(getPatterns as jest.Mock).mockReturnValue(manyPatterns)

        const result = await suggestPattern({
          context: 'form input',
          limit: 50,
        })

        expect(result.suggestions.length).toBeLessThanOrEqual(20)
      })

      it('should enforce minimum limit of 1', async () => {
        const result = await suggestPattern({
          context: 'form input',
          limit: 0,
        })

        expect(result.suggestions.length).toBeLessThanOrEqual(1)
      })
    })

    describe('keyword matching', () => {
      it('should suggest text field for "input" context', async () => {
        const result = await suggestPattern({ context: 'I need a text input' })

        expect(result.suggestions.some((s) => s.pattern.includes('text-field'))).toBe(true)
      })

      it('should suggest autocomplete for "search" context', async () => {
        const result = await suggestPattern({ context: 'search with suggestions' })

        expect(result.suggestions.some((s) => s.pattern.includes('autocomplete'))).toBe(true)
      })

      it('should suggest modal for "dialog" context', async () => {
        const result = await suggestPattern({ context: 'confirmation dialog' })

        expect(result.suggestions.some((s) => s.pattern.includes('modal'))).toBe(true)
      })

      it('should suggest toast for "notification" context', async () => {
        const result = await suggestPattern({ context: 'show a notification message' })

        expect(result.suggestions.some((s) => s.pattern.includes('toast'))).toBe(true)
      })
    })

    describe('alias matching', () => {
      it('should match pattern aliases', async () => {
        const result = await suggestPattern({ context: 'typeahead component' })

        expect(result.suggestions.some((s) => s.pattern.includes('autocomplete'))).toBe(true)
      })

      it('should match snackbar to toast', async () => {
        const result = await suggestPattern({ context: 'snackbar message' })

        expect(result.suggestions.some((s) => s.pattern.includes('toast'))).toBe(true)
      })

      it('should match popup to modal', async () => {
        const result = await suggestPattern({ context: 'popup window' })

        expect(result.suggestions.some((s) => s.pattern.includes('modal'))).toBe(true)
      })
    })

    describe('category filtering', () => {
      it('should give bonus to patterns in specified category', async () => {
        const result = await suggestPattern({
          context: 'navigation component',
          category: 'navigation',
        })

        // Navigation patterns should rank higher
        const topSuggestion = result.suggestions[0]
        if (topSuggestion) {
          expect(topSuggestion.category).toBe('navigation')
        }
      })

      it('should still show other categories if they match better', async () => {
        const result = await suggestPattern({
          context: 'modal dialog with form',
          category: 'forms',
        })

        // Modal should still appear since it matches "modal dialog" strongly
        expect(result.suggestions.some((s) => s.pattern.includes('modal'))).toBe(true)
      })
    })

    describe('relevance scoring', () => {
      it('should sort suggestions by relevance descending', async () => {
        const result = await suggestPattern({ context: 'form input field' })

        for (let i = 1; i < result.suggestions.length; i++) {
          expect(result.suggestions[i - 1].relevance).toBeGreaterThanOrEqual(
            result.suggestions[i].relevance
          )
        }
      })

      it('should normalize relevance scores to 0-1 range', async () => {
        const result = await suggestPattern({ context: 'form input' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.relevance).toBeGreaterThanOrEqual(0)
          expect(suggestion.relevance).toBeLessThanOrEqual(1)
        }
      })

      it('should have relevance of 1 for top match', async () => {
        const result = await suggestPattern({ context: 'input text field' })

        if (result.suggestions.length > 0) {
          expect(result.suggestions[0].relevance).toBe(1)
        }
      })
    })

    describe('reason generation', () => {
      it('should include reason for each suggestion', async () => {
        const result = await suggestPattern({ context: 'input' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.reason).toBeTruthy()
        }
      })

      it('should mention matched keywords in reason', async () => {
        const result = await suggestPattern({ context: 'text input' })

        const textFieldSuggestion = result.suggestions.find((s) =>
          s.pattern.includes('text-field')
        )
        if (textFieldSuggestion) {
          expect(textFieldSuggestion.reason.toLowerCase()).toMatch(/input|text|keyword/)
        }
      })

      it('should limit reasons to 3 per suggestion', async () => {
        const result = await suggestPattern({
          context: 'input text field form type enter name email',
        })

        for (const suggestion of result.suggestions) {
          const reasonCount = (suggestion.reason.match(/;/g) || []).length + 1
          expect(reasonCount).toBeLessThanOrEqual(3)
        }
      })

      it('should use default reason when no specific match', async () => {
        // Find a pattern that would match only by description
        const result = await suggestPattern({ context: 'brief' })

        const toastSuggestion = result.suggestions.find((s) =>
          s.pattern.includes('toast')
        )
        if (toastSuggestion && !toastSuggestion.reason.includes('Matches')) {
          expect(toastSuggestion.reason).toBe('May be relevant to your context')
        }
      })
    })

    describe('result structure', () => {
      it('should include pattern slug', async () => {
        const result = await suggestPattern({ context: 'input' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.pattern).toMatch(/^patterns\//)
        }
      })

      it('should include title', async () => {
        const result = await suggestPattern({ context: 'input' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.title).toBeTruthy()
        }
      })

      it('should include category', async () => {
        const result = await suggestPattern({ context: 'input' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.category).toBeTruthy()
        }
      })
    })

    describe('edge cases', () => {
      it('should return empty suggestions when no patterns match', async () => {
        const result = await suggestPattern({ context: 'xyznonexistent123' })

        expect(result.suggestions).toEqual([])
      })

      it('should handle patterns without aliases', async () => {
        const patternsNoAliases = mockPatterns.map((p) => ({
          ...p,
          aliases: undefined,
        }))
        ;(getPatterns as jest.Mock).mockReturnValue(patternsNoAliases)

        const result = await suggestPattern({ context: 'input' })

        // Should still work, just not match aliases
        expect(Array.isArray(result.suggestions)).toBe(true)
      })

      it('should handle patterns without description', async () => {
        const patternsNoDesc = mockPatterns.map((p) => ({
          ...p,
          description: undefined as any,
        }))
        ;(getPatterns as jest.Mock).mockReturnValue(patternsNoDesc)

        const result = await suggestPattern({ context: 'input' })

        expect(Array.isArray(result.suggestions)).toBe(true)
      })

      it('should be case-insensitive', async () => {
        const resultLower = await suggestPattern({ context: 'modal' })
        const resultUpper = await suggestPattern({ context: 'MODAL' })

        expect(resultLower.suggestions.length).toBe(resultUpper.suggestions.length)
      })

      it('should filter out patterns with zero relevance', async () => {
        const result = await suggestPattern({ context: 'something specific' })

        for (const suggestion of result.suggestions) {
          expect(suggestion.relevance).toBeGreaterThan(0)
        }
      })
    })
  })
})
