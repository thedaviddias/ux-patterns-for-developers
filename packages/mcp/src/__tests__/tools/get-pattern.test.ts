/**
 * Tests for get_pattern tool
 */

import { jest } from '@jest/globals'
import type { Pattern, GlossaryEntry } from '../../types'

// Mock data modules
jest.unstable_mockModule('../../data', () => ({
  getPatternBySlug: jest.fn<(slug: string) => Pattern | null>(),
  getPatterns: jest.fn<() => Pattern[]>(),
  getGlossaryEntries: jest.fn<() => GlossaryEntry[]>(),
}))

jest.unstable_mockModule('../../data/relationships', () => ({
  getRelatedPatterns: jest.fn<(slug: string) => string[]>(),
}))

const { getPatternBySlug, getPatterns, getGlossaryEntries } = await import(
  '../../data'
)
const { getRelatedPatterns } = await import('../../data/relationships')
const { getPattern, getPatternDefinition } = await import(
  '../../tools/get-pattern'
)

// Sample test data
const mockPattern: Pattern = {
  slug: 'patterns/forms/text-input',
  title: 'Text Input',
  description: 'An input field for entering text data',
  summary: 'A versatile text input component',
  category: 'forms',
  status: 'published',
  body: `# Text Input Pattern

This is the main content about text inputs.

## Accessibility

Make sure to use ARIA attributes correctly.

<CodeBlock>
  const Input = () => <input type="text" />
</CodeBlock>
`,
  toc: [
    { title: 'Overview', url: '#overview', depth: 2 },
    { title: 'Accessibility', url: '#accessibility', depth: 2 },
  ],
  metadata: { readingTime: 5, wordCount: 1000 },
  url: '/patterns/forms/text-input',
  aliases: ['textfield', 'input'],
  tags: ['form', 'input', 'text'],
}

const mockPatterns: Pattern[] = [
  mockPattern,
  {
    slug: 'patterns/forms/checkbox',
    title: 'Checkbox',
    description: 'A checkbox component',
    category: 'forms',
    status: 'complete',
    body: 'Checkbox content',
    toc: [],
    metadata: { readingTime: 3, wordCount: 500 },
    url: '/patterns/forms/checkbox',
  },
]

const mockGlossaryEntries: GlossaryEntry[] = [
  {
    slug: 'glossary/a/aria',
    term: 'ARIA',
    definition: 'Accessible Rich Internet Applications',
    body: 'Full body',
    toc: [],
    relatedTerms: [],
    url: '/glossary/a/aria',
  },
]

describe('get_pattern tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPatternBySlug as jest.Mock).mockImplementation((slug: string) => {
      const fullSlug = slug.startsWith('patterns/') ? slug : `patterns/${slug}`
      return mockPatterns.find((p) => p.slug === fullSlug) || null
    })
    ;(getPatterns as jest.Mock).mockReturnValue([...mockPatterns])
    ;(getGlossaryEntries as jest.Mock).mockReturnValue([...mockGlossaryEntries])
    ;(getRelatedPatterns as jest.Mock).mockReturnValue([
      'patterns/forms/checkbox',
    ])
  })

  describe('getPatternDefinition', () => {
    it('should have correct name', () => {
      expect(getPatternDefinition.name).toBe('get_pattern')
    })

    it('should require name parameter', () => {
      expect(getPatternDefinition.inputSchema.required).toContain('name')
    })

    it('should have includeToc parameter', () => {
      expect(getPatternDefinition.inputSchema.properties).toHaveProperty(
        'includeToc'
      )
    })
  })

  describe('getPattern', () => {
    it('should find pattern by exact slug', async () => {
      const result = await getPattern({ name: 'patterns/forms/text-input' })

      expect(result).not.toHaveProperty('error')
      expect((result as any).title).toBe('Text Input')
    })

    it('should find pattern by partial slug', async () => {
      const result = await getPattern({ name: 'forms/text-input' })

      expect(result).not.toHaveProperty('error')
      expect((result as any).title).toBe('Text Input')
    })

    it('should find pattern by title', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(null)

      const result = await getPattern({ name: 'Text Input' })

      expect(result).not.toHaveProperty('error')
      expect((result as any).title).toBe('Text Input')
    })

    it('should find pattern by alias', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(null)

      const result = await getPattern({ name: 'textfield' })

      expect(result).not.toHaveProperty('error')
      expect((result as any).title).toBe('Text Input')
    })

    it('should be case-insensitive for title match', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(null)

      const result = await getPattern({ name: 'TEXT INPUT' })

      expect(result).not.toHaveProperty('error')
    })

    it('should return error for non-existent pattern', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(null)

      const result = await getPattern({ name: 'nonexistent' })

      expect(result).toHaveProperty('error', 'NOT_FOUND')
      expect((result as any).message).toContain('nonexistent')
    })

    it('should return suggestions for non-existent pattern', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(null)

      const result = await getPattern({ name: 'text inpu' }) // typo

      expect(result).toHaveProperty('error')
      expect((result as any).suggestions).toBeDefined()
    })

    it('should include table of contents by default', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).toc).toBeDefined()
      expect((result as any).toc.length).toBeGreaterThan(0)
    })

    it('should exclude table of contents when includeToc is false', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({
        name: 'text-input',
        includeToc: false,
      })

      expect((result as any).toc).toBeUndefined()
    })

    it('should include related patterns', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).relatedPatterns).toBeDefined()
      expect((result as any).relatedPatterns.length).toBeGreaterThan(0)
      expect((result as any).relatedPatterns[0]).toHaveProperty('slug')
      expect((result as any).relatedPatterns[0]).toHaveProperty('title')
    })

    it('should include mentioned glossary terms', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).glossaryTerms).toBeDefined()
      // ARIA is mentioned in the mock body
      expect(
        (result as any).glossaryTerms.some((t: any) => t.term === 'ARIA')
      ).toBe(true)
    })

    it('should convert MDX body to plain markdown', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      // Should not contain JSX/MDX components
      expect((result as any).body).not.toContain('<CodeBlock>')
    })

    it('should include metadata', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).metadata).toHaveProperty('wordCount')
      expect((result as any).metadata).toHaveProperty('readingTime')
    })

    it('should include category and tags', async () => {
      ;(getPatternBySlug as jest.Mock).mockReturnValue(mockPattern)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).category).toContain('forms')
      expect((result as any).tags).toContain('input')
    })

    it('should use description as summary when summary is missing', async () => {
      const patternNoSummary = { ...mockPattern, summary: undefined }
      ;(getPatternBySlug as jest.Mock).mockReturnValue(patternNoSummary)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).summary).toBe(
        mockPattern.description.slice(0, 200)
      )
    })

    it('should limit glossary terms to 10', async () => {
      const manyGlossaryEntries = Array.from({ length: 20 }, (_, i) => ({
        slug: `glossary/t/term-${i}`,
        term: `Term${i}`,
        definition: 'A definition',
        body: '',
        toc: [],
        relatedTerms: [],
        url: `/glossary/t/term-${i}`,
      }))
      ;(getGlossaryEntries as jest.Mock).mockReturnValue(manyGlossaryEntries)

      const patternWithManyTerms = {
        ...mockPattern,
        body: manyGlossaryEntries.map((e) => e.term).join(' '),
      }
      ;(getPatternBySlug as jest.Mock).mockReturnValue(patternWithManyTerms)

      const result = await getPattern({ name: 'text-input' })

      expect((result as any).glossaryTerms.length).toBeLessThanOrEqual(10)
    })
  })
})
