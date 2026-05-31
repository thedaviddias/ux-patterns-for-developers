/**
 * Tests for search_patterns tool
 */

import { jest } from '@jest/globals'
import type { Pattern } from '../../types'

// Mock data module
jest.unstable_mockModule('../../data', () => ({
  getPatterns: jest.fn<() => Pattern[]>(),
}))

const { getPatterns } = await import('../../data')
const { searchPatterns, searchPatternsDefinition } = await import(
  '../../tools/search-patterns'
)

// Sample test patterns
const mockPatterns: Pattern[] = [
  {
    slug: 'patterns/forms/text-input',
    title: 'Text Input',
    description: 'An input field for entering text data',
    summary: 'A versatile text input component for forms',
    category: 'forms',
    status: 'published',
    body: 'Full body content',
    toc: [],
    metadata: { readingTime: 5, wordCount: 1000 },
    url: '/patterns/forms/text-input',
    aliases: ['input', 'textfield', 'text box'],
    tags: ['input', 'form', 'text'],
  },
  {
    slug: 'patterns/forms/checkbox',
    title: 'Checkbox',
    description: 'A checkbox for boolean selections',
    summary: 'Toggle boolean values with a checkbox',
    category: 'forms',
    status: 'complete',
    body: 'Full body content',
    toc: [],
    metadata: { readingTime: 3, wordCount: 500 },
    url: '/patterns/forms/checkbox',
    tags: ['form', 'boolean', 'selection'],
  },
  {
    slug: 'patterns/navigation/breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Navigation breadcrumbs showing user location',
    summary: 'Show the current location in the site hierarchy',
    category: 'navigation',
    status: 'published',
    body: 'Full body content',
    toc: [],
    metadata: { readingTime: 4, wordCount: 800 },
    url: '/patterns/navigation/breadcrumbs',
    tags: ['navigation', 'location', 'hierarchy'],
  },
  {
    slug: 'patterns/navigation/tabs',
    title: 'Tabs',
    description: 'Tabbed navigation for switching between content panels',
    summary: 'Organize content into switchable tab panels',
    category: 'navigation',
    status: 'published',
    body: 'Full body content',
    toc: [],
    metadata: { readingTime: 6, wordCount: 1200 },
    url: '/patterns/navigation/tabs',
    tags: ['navigation', 'tabs', 'panel'],
  },
]

describe('search_patterns tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPatterns as jest.Mock).mockReturnValue([...mockPatterns])
  })

  describe('searchPatternsDefinition', () => {
    it('should have correct name', () => {
      expect(searchPatternsDefinition.name).toBe('search_patterns')
    })

    it('should have description', () => {
      expect(searchPatternsDefinition.description).toBeTruthy()
    })

    it('should require query parameter', () => {
      expect(searchPatternsDefinition.inputSchema.required).toContain('query')
    })

    it('should have expected properties', () => {
      const { properties } = searchPatternsDefinition.inputSchema
      expect(properties).toHaveProperty('query')
      expect(properties).toHaveProperty('category')
      expect(properties).toHaveProperty('tags')
      expect(properties).toHaveProperty('limit')
      expect(properties).toHaveProperty('cursor')
    })
  })

  describe('searchPatterns', () => {
    it('should return empty results for empty query', async () => {
      const result = await searchPatterns({ query: '' })

      expect(result.results).toEqual([])
      expect(result.total).toBe(0)
    })

    it('should return empty results for whitespace-only query', async () => {
      const result = await searchPatterns({ query: '   ' })

      expect(result.results).toEqual([])
    })

    it('should find patterns by exact title match', async () => {
      const result = await searchPatterns({ query: 'Text Input' })

      expect(result.results.length).toBeGreaterThan(0)
      expect(result.results[0].title).toBe('Text Input')
      expect(result.results[0].score).toBeGreaterThan(0)
    })

    it('should find patterns by partial title match', async () => {
      const result = await searchPatterns({ query: 'input' })

      expect(result.results.some((r) => r.title === 'Text Input')).toBe(true)
    })

    it('should find patterns by alias match', async () => {
      const result = await searchPatterns({ query: 'textfield' })

      expect(result.results.length).toBeGreaterThan(0)
      expect(result.results[0].title).toBe('Text Input')
    })

    it('should find patterns by description match', async () => {
      const result = await searchPatterns({ query: 'boolean' })

      expect(result.results.some((r) => r.title === 'Checkbox')).toBe(true)
    })

    it('should find patterns by summary match', async () => {
      const result = await searchPatterns({ query: 'hierarchy' })

      expect(result.results.some((r) => r.title === 'Breadcrumbs')).toBe(true)
    })

    it('should find patterns by tag match', async () => {
      const result = await searchPatterns({ query: 'panel' })

      expect(result.results.some((r) => r.title === 'Tabs')).toBe(true)
    })

    it('should find patterns by category match', async () => {
      const result = await searchPatterns({ query: 'navigation' })

      expect(result.results.length).toBeGreaterThan(0)
      // Patterns in navigation category should be returned
      expect(
        result.results.some((r) => r.category.includes('navigation'))
      ).toBe(true)
    })

    it('should be case-insensitive', async () => {
      const resultLower = await searchPatterns({ query: 'text input' })
      const resultUpper = await searchPatterns({ query: 'TEXT INPUT' })

      expect(resultLower.results.length).toBe(resultUpper.results.length)
    })

    it('should rank exact matches higher', async () => {
      const result = await searchPatterns({ query: 'tabs' })

      // "Tabs" (exact title match) should score higher than "Tabbed" in description
      expect(result.results[0].title).toBe('Tabs')
    })

    it('should return results sorted by score descending', async () => {
      const result = await searchPatterns({ query: 'form' })

      // Verify scores are in descending order
      for (let i = 1; i < result.results.length; i++) {
        expect(result.results[i - 1].score).toBeGreaterThanOrEqual(
          result.results[i].score
        )
      }
    })

    it('should filter by category', async () => {
      const result = await searchPatterns({
        query: 'input',
        category: 'forms',
      })

      expect(result.results.every((r) => r.category.includes('forms'))).toBe(
        true
      )
    })

    it('should filter by category case-insensitively', async () => {
      const result = await searchPatterns({
        query: 'input',
        category: 'FORMS',
      })

      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should filter by tags (AND logic)', async () => {
      const result = await searchPatterns({
        query: 'form',
        tags: ['form', 'text'],
      })

      // Only patterns with both 'form' AND 'text' tags
      expect(result.results.length).toBe(1)
      expect(result.results[0].title).toBe('Text Input')
    })

    it('should return empty when tags filter matches nothing', async () => {
      const result = await searchPatterns({
        query: 'form',
        tags: ['nonexistent-tag'],
      })

      expect(result.results).toEqual([])
    })

    it('should respect limit parameter', async () => {
      const result = await searchPatterns({ query: 'form', limit: 1 })

      expect(result.results.length).toBe(1)
      expect(result.hasMore).toBe(true)
    })

    it('should cap limit at 100', async () => {
      const manyPatterns = Array.from({ length: 150 }, (_, i) => ({
        ...mockPatterns[0],
        slug: `patterns/forms/pattern-${i}`,
        title: `Form Pattern ${i}`,
      }))
      ;(getPatterns as jest.Mock).mockReturnValue(manyPatterns)

      const result = await searchPatterns({ query: 'form', limit: 200 })

      expect(result.results.length).toBe(100)
    })

    it('should enforce minimum limit of 1', async () => {
      const result = await searchPatterns({ query: 'form', limit: 0 })

      expect(result.results.length).toBe(1)
    })

    it('should handle pagination with cursor', async () => {
      const page1 = await searchPatterns({ query: 'form', limit: 1 })
      expect(page1.results.length).toBe(1)
      expect(page1.hasMore).toBe(true)

      const page2 = await searchPatterns({
        query: 'form',
        limit: 1,
        cursor: page1.cursor,
      })
      expect(page2.results.length).toBe(1)
    })

    it('should return low scores for non-matching queries', async () => {
      const result = await searchPatterns({ query: 'xyznonexistent' })

      // Fuzzy matching returns low-similarity results; verify scores are low
      // Since there's no exact match, scores come only from fuzzy similarity
      if (result.results.length > 0) {
        // All scores should be low (only from fuzzy matching, max ~30 * similarity)
        expect(result.results.every((r) => r.score < 10)).toBe(true)
      }
    })

    it('should include score in results', async () => {
      const result = await searchPatterns({ query: 'text input' })

      expect(result.results[0]).toHaveProperty('score')
      expect(typeof result.results[0].score).toBe('number')
    })

    it('should include tags in results', async () => {
      const result = await searchPatterns({ query: 'text input' })

      expect(result.results[0]).toHaveProperty('tags')
      expect(Array.isArray(result.results[0].tags)).toBe(true)
    })

    it('should handle patterns without aliases', async () => {
      const patternsNoAliases = mockPatterns.map((p) => ({
        ...p,
        aliases: undefined,
      }))
      ;(getPatterns as jest.Mock).mockReturnValue(patternsNoAliases)

      const result = await searchPatterns({ query: 'text' })

      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should handle patterns without tags', async () => {
      const patternsNoTags = mockPatterns.map((p) => ({
        ...p,
        tags: undefined,
      }))
      ;(getPatterns as jest.Mock).mockReturnValue(patternsNoTags)

      const result = await searchPatterns({ query: 'text' })

      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should use description when summary is missing', async () => {
      const patternsNoSummary = [
        {
          ...mockPatterns[0],
          summary: undefined,
        },
      ]
      ;(getPatterns as jest.Mock).mockReturnValue(patternsNoSummary)

      const result = await searchPatterns({ query: 'text' })

      expect(result.results[0].summary).toBe(
        mockPatterns[0].description.slice(0, 150)
      )
    })

    it('should use fuzzy matching for approximate title matches', async () => {
      // Slight misspelling
      const result = await searchPatterns({ query: 'Text Iput' })

      // Should still find Text Input through fuzzy matching
      expect(result.results.some((r) => r.title === 'Text Input')).toBe(true)
    })
  })
})
