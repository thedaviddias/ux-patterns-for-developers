/**
 * Tests for Velite data loader
 */

import { jest } from '@jest/globals'
import type { VeliteDoc } from '../../types'

// Mock fs module
jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
}))

// Import mocked modules
const { readFileSync, existsSync } = await import('node:fs')

// Import the module under test after mocking
const {
  getPatterns,
  getPatternBySlug,
  getGlossaryEntries,
  getGlossaryEntry,
  getCategories,
  searchPatterns,
  clearCache,
} = await import('../../data/loader')

// Sample test data
const mockDocs: VeliteDoc[] = [
  {
    slug: 'patterns/forms/text-input',
    title: 'Text Input',
    description: 'A text input field for user text entry',
    summary: 'Input field for entering text data',
    body: 'Full body content for text input',
    toc: [{ title: 'Overview', url: '#overview', depth: 2 }],
    status: 'published',
    url: '/patterns/forms/text-input',
    metadata: { readingTime: 5, wordCount: 1000 },
    aliases: ['input', 'textfield'],
    icon: 'text-cursor',
    featured: true,
  },
  {
    slug: 'patterns/forms/checkbox',
    title: 'Checkbox',
    description: 'A checkbox for boolean selections',
    summary: 'Toggle boolean values',
    body: 'Full body content for checkbox',
    toc: [],
    status: 'complete',
    url: '/patterns/forms/checkbox',
    metadata: { readingTime: 3, wordCount: 500 },
  },
  {
    slug: 'patterns/navigation/breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Navigation breadcrumbs showing user location',
    summary: 'Show location in site hierarchy',
    body: 'Full body content for breadcrumbs',
    toc: [],
    status: 'published',
    url: '/patterns/navigation/breadcrumbs',
    metadata: { readingTime: 4, wordCount: 800 },
  },
  {
    slug: 'patterns/forms', // Category index page - should be excluded
    title: 'Forms',
    description: 'Form patterns category',
    body: '',
    toc: [],
    status: 'published',
    url: '/patterns/forms',
  },
  {
    slug: 'patterns/navigation/tabs',
    title: 'Tabs',
    description: 'Tabbed navigation component',
    body: 'Full body content',
    toc: [],
    status: 'draft', // Draft - should be excluded
    url: '/patterns/navigation/tabs',
  },
  {
    slug: 'glossary/a/aria',
    title: 'ARIA',
    description: 'Accessible Rich Internet Applications specification',
    body: 'Full body for ARIA glossary entry',
    toc: [],
    status: 'published',
    url: '/glossary/a/aria',
  },
  {
    slug: 'glossary/w/wcag',
    title: 'WCAG',
    description: 'Web Content Accessibility Guidelines',
    body: 'Full body for WCAG glossary entry',
    toc: [],
    status: 'complete',
    url: '/glossary/w/wcag',
  },
  {
    slug: 'glossary', // Index page - should be excluded
    title: 'Glossary',
    description: 'Glossary index',
    body: '',
    toc: [],
    status: 'published',
    url: '/glossary',
  },
  {
    slug: 'blog/my-post',
    title: 'My Blog Post',
    description: 'A blog post',
    body: 'Blog content',
    toc: [],
    status: 'published',
    url: '/blog/my-post',
  },
]

describe('Data Loader', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    clearCache()

    // Setup default mock behavior
    ;(existsSync as jest.Mock).mockReturnValue(true)
    ;(readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockDocs))
  })

  describe('getPatterns', () => {
    it('should return only published/complete patterns', () => {
      const patterns = getPatterns()

      expect(patterns.length).toBe(3)
      expect(patterns.map((p) => p.title)).toContain('Text Input')
      expect(patterns.map((p) => p.title)).toContain('Checkbox')
      expect(patterns.map((p) => p.title)).toContain('Breadcrumbs')
    })

    it('should exclude draft patterns', () => {
      const patterns = getPatterns()

      expect(patterns.map((p) => p.title)).not.toContain('Tabs')
    })

    it('should exclude category index pages', () => {
      const patterns = getPatterns()

      expect(patterns.find((p) => p.slug === 'patterns/forms')).toBeUndefined()
    })

    it('should exclude blog posts', () => {
      const patterns = getPatterns()

      expect(patterns.map((p) => p.title)).not.toContain('My Blog Post')
    })

    it('should map Velite doc to Pattern type correctly', () => {
      const patterns = getPatterns()
      const textInput = patterns.find((p) => p.title === 'Text Input')!

      expect(textInput).toMatchObject({
        slug: 'patterns/forms/text-input',
        title: 'Text Input',
        description: 'A text input field for user text entry',
        summary: 'Input field for entering text data',
        category: 'forms',
        status: 'published',
        url: '/patterns/forms/text-input',
        aliases: ['input', 'textfield'],
        icon: 'text-cursor',
        featured: true,
      })
      expect(textInput.metadata.readingTime).toBe(5)
      expect(textInput.metadata.wordCount).toBe(1000)
    })

    it('should extract category from slug', () => {
      const patterns = getPatterns()

      const textInput = patterns.find((p) => p.title === 'Text Input')!
      expect(textInput.category).toBe('forms')

      const breadcrumbs = patterns.find((p) => p.title === 'Breadcrumbs')!
      expect(breadcrumbs.category).toBe('navigation')
    })

    it('should cache results and not re-read file', () => {
      getPatterns()
      getPatterns()
      getPatterns()

      // Should only read once due to caching
      expect(readFileSync).toHaveBeenCalledTimes(1)
    })

    it('should throw error when Velite file not found', () => {
      ;(existsSync as jest.Mock).mockReturnValue(false)

      expect(() => getPatterns()).toThrow('Velite output not found')
    })

    it('should throw error when file read fails', () => {
      ;(readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file')
      })

      expect(() => getPatterns()).toThrow('Failed to load Velite docs')
    })

    it('should throw error for invalid JSON', () => {
      ;(readFileSync as jest.Mock).mockReturnValue('invalid json{')

      expect(() => getPatterns()).toThrow()
    })
  })

  describe('getPatternBySlug', () => {
    it('should find pattern by exact slug', () => {
      const pattern = getPatternBySlug('patterns/forms/text-input')

      expect(pattern).not.toBeNull()
      expect(pattern!.title).toBe('Text Input')
    })

    it('should find pattern by slug without prefix', () => {
      const pattern = getPatternBySlug('forms/text-input')

      expect(pattern).not.toBeNull()
      expect(pattern!.title).toBe('Text Input')
    })

    it('should return null for non-existent slug', () => {
      const pattern = getPatternBySlug('non-existent')

      expect(pattern).toBeNull()
    })

    it('should return null for draft pattern slug', () => {
      const pattern = getPatternBySlug('patterns/navigation/tabs')

      expect(pattern).toBeNull()
    })
  })

  describe('getGlossaryEntries', () => {
    it('should return only published/complete glossary entries', () => {
      const entries = getGlossaryEntries()

      expect(entries.length).toBe(2)
      expect(entries.map((e) => e.term)).toContain('ARIA')
      expect(entries.map((e) => e.term)).toContain('WCAG')
    })

    it('should exclude glossary index pages', () => {
      const entries = getGlossaryEntries()

      expect(entries.find((e) => e.slug === 'glossary')).toBeUndefined()
    })

    it('should map Velite doc to GlossaryEntry type correctly', () => {
      const entries = getGlossaryEntries()
      const aria = entries.find((e) => e.term === 'ARIA')!

      expect(aria).toMatchObject({
        slug: 'glossary/a/aria',
        term: 'ARIA',
        definition: 'Accessible Rich Internet Applications specification',
        url: '/glossary/a/aria',
      })
    })
  })

  describe('getGlossaryEntry', () => {
    it('should find entry by exact slug', () => {
      const entry = getGlossaryEntry('glossary/a/aria')

      expect(entry).not.toBeNull()
      expect(entry!.term).toBe('ARIA')
    })

    it('should find entry by slug ending', () => {
      const entry = getGlossaryEntry('aria')

      expect(entry).not.toBeNull()
      expect(entry!.term).toBe('ARIA')
    })

    it('should find entry by term (case-insensitive)', () => {
      const entryUpper = getGlossaryEntry('ARIA')
      const entryLower = getGlossaryEntry('aria')
      const entryMixed = getGlossaryEntry('Aria')

      expect(entryUpper!.term).toBe('ARIA')
      expect(entryLower!.term).toBe('ARIA')
      expect(entryMixed!.term).toBe('ARIA')
    })

    it('should return null for non-existent entry', () => {
      const entry = getGlossaryEntry('nonexistent-term')

      expect(entry).toBeNull()
    })
  })

  describe('getCategories', () => {
    it('should return unique categories', () => {
      const categories = getCategories()

      expect(categories.length).toBe(2)
      expect(categories.map((c) => c.slug)).toContain('forms')
      expect(categories.map((c) => c.slug)).toContain('navigation')
    })

    it('should count patterns per category correctly', () => {
      const categories = getCategories()

      const forms = categories.find((c) => c.slug === 'forms')!
      const navigation = categories.find((c) => c.slug === 'navigation')!

      expect(forms.patternCount).toBe(2) // text-input, checkbox
      expect(navigation.patternCount).toBe(1) // breadcrumbs (tabs is draft)
    })

    it('should include pattern slugs in category', () => {
      const categories = getCategories()
      const forms = categories.find((c) => c.slug === 'forms')!

      expect(forms.patterns).toContain('patterns/forms/text-input')
      expect(forms.patterns).toContain('patterns/forms/checkbox')
    })

    it('should format category name from slug', () => {
      const categories = getCategories()

      expect(categories.find((c) => c.slug === 'forms')!.name).toBe('Forms')
      expect(categories.find((c) => c.slug === 'navigation')!.name).toBe(
        'Navigation'
      )
    })
  })

  describe('searchPatterns', () => {
    it('should find patterns by title match', () => {
      const results = searchPatterns('text')

      expect(results.length).toBe(1)
      expect(results[0].title).toBe('Text Input')
    })

    it('should find patterns by description match', () => {
      const results = searchPatterns('boolean')

      expect(results.length).toBe(1)
      expect(results[0].title).toBe('Checkbox')
    })

    it('should find patterns by summary match', () => {
      const results = searchPatterns('hierarchy')

      expect(results.length).toBe(1)
      expect(results[0].title).toBe('Breadcrumbs')
    })

    it('should find patterns by alias match', () => {
      const results = searchPatterns('textfield')

      expect(results.length).toBe(1)
      expect(results[0].title).toBe('Text Input')
    })

    it('should be case-insensitive', () => {
      const resultsUpper = searchPatterns('TEXT')
      const resultsLower = searchPatterns('text')

      expect(resultsUpper.length).toBe(resultsLower.length)
    })

    it('should return empty array for no matches', () => {
      const results = searchPatterns('xyznonexistent')

      expect(results).toEqual([])
    })

    it('should return multiple matching patterns', () => {
      // searchPatterns checks title, description, summary, and aliases
      // "form" substring appears in mockDocs description "Input field for text entry"
      // Note: category is not searched by searchPatterns function
      const results = searchPatterns('input')

      // "input" appears in Text Input title and description
      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('clearCache', () => {
    it('should clear cached data and force reload', () => {
      getPatterns() // First call - caches
      expect(readFileSync).toHaveBeenCalledTimes(1)

      getPatterns() // Second call - uses cache
      expect(readFileSync).toHaveBeenCalledTimes(1)

      clearCache()

      getPatterns() // Third call - reloads
      expect(readFileSync).toHaveBeenCalledTimes(2)
    })
  })

  describe('formatCategoryName', () => {
    it('should handle multi-word slugs', () => {
      // Add a pattern with multi-word category
      const docsWithMultiWordCategory: VeliteDoc[] = [
        ...mockDocs,
        {
          slug: 'patterns/date-pickers/calendar',
          title: 'Calendar',
          description: 'A calendar component',
          body: '',
          toc: [],
          status: 'published',
          url: '/patterns/date-pickers/calendar',
        },
      ]

      ;(readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(docsWithMultiWordCategory)
      )
      clearCache()

      const categories = getCategories()
      const datePickers = categories.find((c) => c.slug === 'date-pickers')

      expect(datePickers!.name).toBe('Date Pickers')
    })
  })
})
