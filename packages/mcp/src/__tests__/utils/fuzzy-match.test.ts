/**
 * Tests for fuzzy matching utilities
 */

import {
  levenshteinDistance,
  similarityRatio,
  findBestMatches,
  containsIgnoreCase,
  fuzzySearch,
} from '../../utils/fuzzy-match'

describe('Fuzzy Match', () => {
  describe('levenshteinDistance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0)
    })

    it('should return 0 for case-insensitive identical strings', () => {
      expect(levenshteinDistance('Hello', 'HELLO')).toBe(0)
      expect(levenshteinDistance('HeLLo', 'hello')).toBe(0)
    })

    it('should return length for comparison with empty string', () => {
      expect(levenshteinDistance('hello', '')).toBe(5)
      expect(levenshteinDistance('', 'hello')).toBe(5)
    })

    it('should return 0 for two empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0)
    })

    it('should calculate single character changes', () => {
      expect(levenshteinDistance('cat', 'bat')).toBe(1) // substitution
      expect(levenshteinDistance('cat', 'cats')).toBe(1) // insertion
      expect(levenshteinDistance('cats', 'cat')).toBe(1) // deletion
    })

    it('should handle multiple edits', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
      expect(levenshteinDistance('sunday', 'saturday')).toBe(3)
    })

    it('should handle completely different strings', () => {
      expect(levenshteinDistance('abc', 'xyz')).toBe(3)
    })

    it('should handle special characters', () => {
      expect(levenshteinDistance('hello!', 'hello?')).toBe(1)
      // 'com' -> 'org' requires 3 substitutions: c->o, o->r, m->g
      expect(levenshteinDistance('user@email.com', 'user@email.org')).toBe(3)
    })

    it('should handle unicode characters', () => {
      expect(levenshteinDistance('café', 'cafe')).toBe(1)
      expect(levenshteinDistance('résumé', 'resume')).toBe(2)
    })
  })

  describe('similarityRatio', () => {
    it('should return 1 for identical strings', () => {
      expect(similarityRatio('hello', 'hello')).toBe(1)
    })

    it('should return 1 for empty strings', () => {
      expect(similarityRatio('', '')).toBe(1)
    })

    it('should return 0 for completely different strings of same length', () => {
      expect(similarityRatio('abc', 'xyz')).toBe(0)
    })

    it('should return value between 0 and 1', () => {
      const ratio = similarityRatio('hello', 'hallo')
      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThan(1)
    })

    it('should handle different length strings', () => {
      const ratio = similarityRatio('form', 'forms')
      expect(ratio).toBe(0.8) // 1 - 1/5
    })

    it('should be symmetric', () => {
      expect(similarityRatio('hello', 'hallo')).toBe(
        similarityRatio('hallo', 'hello')
      )
    })

    it('should be case-insensitive', () => {
      expect(similarityRatio('Hello', 'HELLO')).toBe(1)
    })
  })

  describe('findBestMatches', () => {
    const candidates = [
      'forms',
      'navigation',
      'modals',
      'buttons',
      'inputs',
      'validation',
      'accordion',
      'tabs',
    ]

    it('should find exact matches', () => {
      const matches = findBestMatches('forms', candidates)
      expect(matches[0]).toBe('forms')
    })

    it('should find similar matches with typos', () => {
      const matches = findBestMatches('froms', candidates) // typo
      expect(matches).toContain('forms')
    })

    it('should respect maxResults option', () => {
      const matches = findBestMatches('a', candidates, { maxResults: 2 })
      expect(matches.length).toBeLessThanOrEqual(2)
    })

    it('should filter by minSimilarity', () => {
      const matches = findBestMatches('xyz', candidates, { minSimilarity: 0.5 })
      expect(matches.length).toBe(0)
    })

    it('should return empty array for no matches above threshold', () => {
      const matches = findBestMatches('zzzzzzzzz', candidates)
      expect(matches.length).toBe(0)
    })

    it('should sort by similarity descending', () => {
      const matches = findBestMatches('form', candidates)
      // 'forms' should be first (most similar)
      expect(matches[0]).toBe('forms')
    })

    it('should handle empty candidates array', () => {
      const matches = findBestMatches('hello', [])
      expect(matches).toEqual([])
    })

    it('should handle empty query', () => {
      const matches = findBestMatches('', candidates)
      // Empty query has low similarity to everything
      expect(matches.length).toBeLessThanOrEqual(3)
    })

    it('should be case-insensitive', () => {
      const matches = findBestMatches('FORMS', candidates)
      expect(matches).toContain('forms')
    })
  })

  describe('containsIgnoreCase', () => {
    it('should return true for exact substring', () => {
      expect(containsIgnoreCase('Hello World', 'World')).toBe(true)
    })

    it('should be case-insensitive', () => {
      expect(containsIgnoreCase('Hello World', 'WORLD')).toBe(true)
      expect(containsIgnoreCase('Hello World', 'world')).toBe(true)
      expect(containsIgnoreCase('HELLO WORLD', 'hello')).toBe(true)
    })

    it('should return false for non-matching strings', () => {
      expect(containsIgnoreCase('Hello World', 'xyz')).toBe(false)
    })

    it('should handle empty strings', () => {
      expect(containsIgnoreCase('Hello', '')).toBe(true) // empty is substring of anything
      expect(containsIgnoreCase('', 'hello')).toBe(false)
    })

    it('should handle special characters', () => {
      expect(containsIgnoreCase('user@email.com', '@email')).toBe(true)
    })
  })

  describe('fuzzySearch', () => {
    interface TestItem {
      id: number
      title: string
      description: string
      tags: string[]
    }

    const items: TestItem[] = [
      {
        id: 1,
        title: 'Text Field',
        description: 'Input field for text entry',
        tags: ['forms', 'input'],
      },
      {
        id: 2,
        title: 'Modal Dialog',
        description: 'Overlay dialog component',
        tags: ['overlay', 'dialog'],
      },
      {
        id: 3,
        title: 'Pagination',
        description: 'Navigate through pages of content',
        tags: ['navigation'],
      },
      {
        id: 4,
        title: 'Toggle Switch',
        description: 'On/off toggle control',
        tags: ['forms', 'control'],
      },
    ]

    const getSearchableText = (item: TestItem) => [
      item.title,
      item.description,
      ...item.tags,
    ]

    it('should find exact substring matches in title', () => {
      const results = fuzzySearch(items, 'Modal', getSearchableText)
      expect(results.length).toBe(1)
      expect(results[0].id).toBe(2)
    })

    it('should find matches in description', () => {
      const results = fuzzySearch(items, 'overlay', getSearchableText)
      expect(results.length).toBe(1)
      expect(results[0].id).toBe(2)
    })

    it('should find matches in tags', () => {
      const results = fuzzySearch(items, 'forms', getSearchableText)
      expect(results.length).toBe(2)
      expect(results.map((r) => r.id)).toContain(1)
      expect(results.map((r) => r.id)).toContain(4)
    })

    it('should find fuzzy matches', () => {
      const results = fuzzySearch(items, 'Modol', getSearchableText) // typo
      expect(results.length).toBeGreaterThan(0)
    })

    it('should be case-insensitive', () => {
      const results = fuzzySearch(items, 'TEXT FIELD', getSearchableText)
      expect(results.length).toBe(1)
    })

    it('should return empty array for no matches', () => {
      const results = fuzzySearch(items, 'xyzabc123', getSearchableText)
      expect(results).toEqual([])
    })

    it('should respect minSimilarity option', () => {
      const results = fuzzySearch(items, 'test', getSearchableText, {
        minSimilarity: 0.9,
      })
      // Should require very high similarity, likely no matches
      expect(results.length).toBeLessThanOrEqual(1)
    })

    it('should handle empty items array', () => {
      const results = fuzzySearch([], 'test', getSearchableText)
      expect(results).toEqual([])
    })

    it('should handle empty query', () => {
      const results = fuzzySearch(items, '', getSearchableText)
      // Empty query matches everything via substring check
      expect(results.length).toBe(4)
    })

    it('should match partial words', () => {
      const results = fuzzySearch(items, 'Dialog', getSearchableText)
      expect(results.map((r) => r.id)).toContain(2)
    })
  })
})
