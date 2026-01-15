/**
 * Tests for list_patterns tool
 */

import { jest } from '@jest/globals'
import type { Pattern, Category } from '../../types'

// Mock data module
jest.unstable_mockModule('../../data', () => ({
  getPatterns: jest.fn<() => Pattern[]>(),
  getCategories: jest.fn<() => Category[]>(),
}))

const { getPatterns, getCategories } = await import('../../data')
const { listPatterns, listPatternsDefinition } = await import(
  '../../tools/list-patterns'
)

// Sample test patterns
const mockPatterns: Pattern[] = [
  {
    slug: 'patterns/forms/text-input',
    title: 'Text Input',
    description: 'Input field for text entry',
    summary: 'A text input component',
    category: 'forms',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 5, wordCount: 1000 },
    url: '/patterns/forms/text-input',
  },
  {
    slug: 'patterns/forms/checkbox',
    title: 'Checkbox',
    description: 'Boolean selection control',
    summary: 'A checkbox component',
    category: 'forms',
    status: 'complete',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 3, wordCount: 500 },
    url: '/patterns/forms/checkbox',
  },
  {
    slug: 'patterns/navigation/breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Navigation breadcrumbs',
    summary: 'Shows user location',
    category: 'navigation',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 4, wordCount: 800 },
    url: '/patterns/navigation/breadcrumbs',
  },
  {
    slug: 'patterns/navigation/tabs',
    title: 'Tabs',
    description: 'Tabbed navigation',
    summary: 'Tab panel component',
    category: 'navigation',
    status: 'published',
    body: 'Full body',
    toc: [],
    metadata: { readingTime: 6, wordCount: 1200 },
    url: '/patterns/navigation/tabs',
  },
]

const mockCategories: Category[] = [
  { slug: 'forms', name: 'Forms', patternCount: 2, patterns: [] },
  { slug: 'navigation', name: 'Navigation', patternCount: 2, patterns: [] },
]

describe('list_patterns tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPatterns as jest.Mock).mockReturnValue([...mockPatterns])
    ;(getCategories as jest.Mock).mockReturnValue([...mockCategories])
  })

  describe('listPatternsDefinition', () => {
    it('should have correct name', () => {
      expect(listPatternsDefinition.name).toBe('list_patterns')
    })

    it('should have description', () => {
      expect(listPatternsDefinition.description).toBeTruthy()
    })

    it('should have input schema with expected properties', () => {
      const { properties } = listPatternsDefinition.inputSchema
      expect(properties).toHaveProperty('category')
      expect(properties).toHaveProperty('status')
      expect(properties).toHaveProperty('limit')
      expect(properties).toHaveProperty('cursor')
    })

    it('should have no required properties', () => {
      expect(listPatternsDefinition.inputSchema.required).toEqual([])
    })
  })

  describe('listPatterns', () => {
    it('should return all patterns when called without arguments', async () => {
      const result = await listPatterns({})

      expect(result.patterns.length).toBe(4)
      expect(result.total).toBe(4)
      expect(result.hasMore).toBe(false)
    })

    it('should return patterns with correct structure', async () => {
      const result = await listPatterns({})

      expect(result.patterns[0]).toHaveProperty('slug')
      expect(result.patterns[0]).toHaveProperty('title')
      expect(result.patterns[0]).toHaveProperty('summary')
      expect(result.patterns[0]).toHaveProperty('category')
      expect(result.patterns[0]).toHaveProperty('status')
    })

    it('should filter by category', async () => {
      const result = await listPatterns({ category: 'forms' })

      expect(result.patterns.length).toBe(2)
      expect(result.patterns.every((p) => p.category.includes('forms'))).toBe(
        true
      )
    })

    it('should filter by category case-insensitively', async () => {
      const result = await listPatterns({ category: 'FORMS' })

      expect(result.patterns.length).toBe(2)
    })

    it('should return suggestions for unknown category', async () => {
      const result = await listPatterns({ category: 'froms' }) // Typo

      expect(result.patterns.length).toBe(0)
      expect(result.suggestions).toBeDefined()
      expect(result.suggestions!.length).toBeGreaterThan(0)
      expect(result.suggestions![0]).toContain('forms')
    })

    it('should filter by status', async () => {
      const result = await listPatterns({ status: 'published' })

      expect(result.patterns.length).toBe(3)
      expect(result.patterns.every((p) => p.status === 'published')).toBe(true)
    })

    it('should filter by both category and status', async () => {
      const result = await listPatterns({
        category: 'forms',
        status: 'complete',
      })

      expect(result.patterns.length).toBe(1)
      expect(result.patterns[0].title).toBe('Checkbox')
    })

    it('should respect limit parameter', async () => {
      const result = await listPatterns({ limit: 2 })

      expect(result.patterns.length).toBe(2)
      expect(result.hasMore).toBe(true)
      expect(result.cursor).toBeDefined()
    })

    it('should cap limit at 100', async () => {
      // Create more than 100 patterns
      const manyPatterns = Array.from({ length: 150 }, (_, i) => ({
        ...mockPatterns[0],
        slug: `patterns/forms/pattern-${i}`,
        title: `Pattern ${i}`,
      }))
      ;(getPatterns as jest.Mock).mockReturnValue(manyPatterns)

      const result = await listPatterns({ limit: 200 })

      expect(result.patterns.length).toBe(100)
    })

    it('should enforce minimum limit of 1', async () => {
      const result = await listPatterns({ limit: 0 })

      expect(result.patterns.length).toBe(1)
    })

    it('should handle negative limit', async () => {
      const result = await listPatterns({ limit: -10 })

      expect(result.patterns.length).toBe(1)
    })

    it('should handle non-finite limit values', async () => {
      const result = await listPatterns({ limit: NaN })

      expect(result.patterns.length).toBe(4) // Default limit of 20, but only 4 patterns
    })

    it('should handle pagination with cursor', async () => {
      const page1 = await listPatterns({ limit: 2 })
      expect(page1.patterns.length).toBe(2)
      expect(page1.hasMore).toBe(true)

      const page2 = await listPatterns({ limit: 2, cursor: page1.cursor })
      expect(page2.patterns.length).toBe(2)
      expect(page2.hasMore).toBe(false)
    })

    it('should return empty array when no patterns match', async () => {
      ;(getPatterns as jest.Mock).mockReturnValue([])
      ;(getCategories as jest.Mock).mockReturnValue([])

      const result = await listPatterns({})

      expect(result.patterns).toEqual([])
      expect(result.total).toBe(0)
    })

    it('should use description when summary is missing', async () => {
      const patternsWithoutSummary = [
        {
          ...mockPatterns[0],
          summary: undefined,
          description: 'This is the description text',
        },
      ]
      ;(getPatterns as jest.Mock).mockReturnValue(patternsWithoutSummary)

      const result = await listPatterns({})

      expect(result.patterns[0].summary).toBe('This is the description text')
    })

    it('should truncate description to 150 chars when used as summary', async () => {
      const longDescription = 'A'.repeat(200)
      const patternsWithLongDesc = [
        {
          ...mockPatterns[0],
          summary: undefined,
          description: longDescription,
        },
      ]
      ;(getPatterns as jest.Mock).mockReturnValue(patternsWithLongDesc)

      const result = await listPatterns({})

      expect(result.patterns[0].summary.length).toBe(150)
    })
  })
})
