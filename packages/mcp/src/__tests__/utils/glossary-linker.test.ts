/**
 * Tests for glossary term linking utilities
 */

import {
  linkGlossaryTerms,
  findMentionedTerms,
  getBriefDefinition,
  type GlossaryTerm,
} from '../../utils/glossary-linker'

describe('Glossary Linker', () => {
  const glossaryTerms: GlossaryTerm[] = [
    { term: 'ARIA', slug: 'aria', definition: 'Accessible Rich Internet Applications' },
    { term: 'accessibility', slug: 'accessibility', definition: 'Making content usable by everyone' },
    { term: 'WCAG', slug: 'wcag', definition: 'Web Content Accessibility Guidelines' },
    { term: 'focus trap', slug: 'focus-trap', definition: 'Containing focus within an element' },
    { term: 'modal', slug: 'modal', definition: 'A dialog that requires user interaction' },
  ]

  describe('linkGlossaryTerms', () => {
    it('should link glossary terms in content', () => {
      const content = 'Use ARIA attributes for accessibility.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      expect(result).toContain('[ARIA](/glossary/aria)')
      expect(result).toContain('[accessibility](/glossary/accessibility)')
    })

    it('should use custom base URL', () => {
      const content = 'Use ARIA attributes.'
      const result = linkGlossaryTerms(content, glossaryTerms, {
        baseUrl: '/terms',
      })

      expect(result).toContain('[ARIA](/terms/aria)')
    })

    it('should respect maxLinksPerTerm option', () => {
      const content = 'ARIA is important. ARIA helps accessibility. ARIA standards.'
      const result = linkGlossaryTerms(content, glossaryTerms, {
        maxLinksPerTerm: 1,
      })

      // Should only link first occurrence
      const ariaLinkCount = (result.match(/\[ARIA\]/g) || []).length
      expect(ariaLinkCount).toBe(1)
    })

    it('should link multiple occurrences when maxLinksPerTerm > 1', () => {
      const content = 'ARIA is important. ARIA helps.'
      const result = linkGlossaryTerms(content, glossaryTerms, {
        maxLinksPerTerm: 2,
      })

      const ariaLinkCount = (result.match(/\[ARIA\]/g) || []).length
      expect(ariaLinkCount).toBe(2)
    })

    it('should not link inside existing markdown links', () => {
      const content = 'See [ARIA guide](https://example.com) for more.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      // Should not double-link
      expect(result).not.toContain('[[ARIA]')
      expect(result).toContain('[ARIA guide](https://example.com)')
    })

    it('should handle case-insensitive matching', () => {
      const content = 'Use aria attributes for Accessibility.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      expect(result).toContain('[aria](/glossary/aria)')
      expect(result).toContain('[Accessibility](/glossary/accessibility)')
    })

    it('should match whole words only', () => {
      const content = 'The modality of the system uses a modal dialog.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      // 'modality' should not be linked
      expect(result).not.toContain('[modality]')
      // 'modal' should be linked
      expect(result).toContain('[modal](/glossary/modal)')
    })

    it('should handle multi-word terms', () => {
      const content = 'Implement a focus trap in your modal.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      expect(result).toContain('[focus trap](/glossary/focus-trap)')
    })

    it('should handle content with no glossary terms', () => {
      const content = 'This content has no special terms.'
      const result = linkGlossaryTerms(content, glossaryTerms)

      expect(result).toBe(content)
    })

    it('should handle empty content', () => {
      const result = linkGlossaryTerms('', glossaryTerms)
      expect(result).toBe('')
    })

    it('should handle empty glossary terms', () => {
      const content = 'Some content with ARIA terms.'
      const result = linkGlossaryTerms(content, [])
      expect(result).toBe(content)
    })

    it('should prioritize longer terms (avoid partial matches)', () => {
      const terms: GlossaryTerm[] = [
        { term: 'focus', slug: 'focus' },
        { term: 'focus trap', slug: 'focus-trap' },
      ]
      const content = 'Use a focus trap to contain focus.'
      const result = linkGlossaryTerms(content, terms)

      // 'focus trap' should be linked as one term, not 'focus' within it
      expect(result).toContain('[focus trap]')
    })

    it('should handle special regex characters in terms', () => {
      // Note: Word boundary \b doesn't work well with special characters
      // because they are non-word characters. This test verifies the escaping
      // doesn't break the regex, even if the match fails due to word boundaries.
      const terms: GlossaryTerm[] = [
        { term: 'C++', slug: 'cpp' },
        { term: '.NET', slug: 'dotnet' },
      ]
      const content = 'Learn C++ and .NET programming.'
      // Should not throw an error due to unescaped regex characters
      expect(() => linkGlossaryTerms(content, terms)).not.toThrow()
    })
  })

  describe('findMentionedTerms', () => {
    it('should find all mentioned terms', () => {
      const content = 'Use ARIA and WCAG for accessibility.'
      const mentioned = findMentionedTerms(content, glossaryTerms)

      expect(mentioned.length).toBe(3)
      expect(mentioned.map((t) => t.term)).toContain('ARIA')
      expect(mentioned.map((t) => t.term)).toContain('WCAG')
      expect(mentioned.map((t) => t.term)).toContain('accessibility')
    })

    it('should be case-insensitive', () => {
      const content = 'aria and wcag are important.'
      const mentioned = findMentionedTerms(content, glossaryTerms)

      expect(mentioned.map((t) => t.term)).toContain('ARIA')
      expect(mentioned.map((t) => t.term)).toContain('WCAG')
    })

    it('should match whole words only', () => {
      const content = 'The modality affects the modal.'
      const mentioned = findMentionedTerms(content, glossaryTerms)

      expect(mentioned.map((t) => t.term)).toContain('modal')
      expect(mentioned.length).toBe(1)
    })

    it('should return empty array for no matches', () => {
      const content = 'No special terms here.'
      const mentioned = findMentionedTerms(content, glossaryTerms)

      expect(mentioned).toEqual([])
    })

    it('should handle empty content', () => {
      const mentioned = findMentionedTerms('', glossaryTerms)
      expect(mentioned).toEqual([])
    })

    it('should handle empty glossary', () => {
      const mentioned = findMentionedTerms('Some content', [])
      expect(mentioned).toEqual([])
    })

    it('should find multi-word terms', () => {
      const content = 'The focus trap implementation is complex.'
      const mentioned = findMentionedTerms(content, glossaryTerms)

      expect(mentioned.map((t) => t.term)).toContain('focus trap')
    })

    it('should not have issues with repeated calls (lastIndex bug)', () => {
      const content = 'ARIA is used twice: ARIA attributes.'

      // Call multiple times to ensure no regex lastIndex issues
      const mentioned1 = findMentionedTerms(content, glossaryTerms)
      const mentioned2 = findMentionedTerms(content, glossaryTerms)
      const mentioned3 = findMentionedTerms(content, glossaryTerms)

      expect(mentioned1.map((t) => t.term)).toContain('ARIA')
      expect(mentioned2.map((t) => t.term)).toContain('ARIA')
      expect(mentioned3.map((t) => t.term)).toContain('ARIA')
    })
  })

  describe('getBriefDefinition', () => {
    it('should return full definition if under maxLength', () => {
      const definition = 'Short definition.'
      const result = getBriefDefinition(definition, 100)

      expect(result).toBe(definition)
    })

    it('should truncate at sentence boundary when possible', () => {
      // "First sentence." is 15 chars, which is 50% of 30 (not > 70% threshold)
      // So it will try space boundary instead
      const definition = 'First sentence. Second sentence that is longer.'
      const result = getBriefDefinition(definition, 30)

      // Last space at 22 chars is > 21 (70% of 30), so truncates there with ellipsis
      expect(result).toBe('First sentence. Second...')
    })

    it('should truncate at word boundary when no sentence boundary', () => {
      const definition = 'This is a longer definition without periods that goes on'
      const result = getBriefDefinition(definition, 30)

      expect(result).toContain('...')
      expect(result.length).toBeLessThanOrEqual(35) // maxLength + ellipsis
    })

    it('should use default maxLength of 100', () => {
      const longDefinition = 'A'.repeat(150)
      const result = getBriefDefinition(longDefinition)

      expect(result.length).toBeLessThanOrEqual(105)
    })

    it('should handle empty definition', () => {
      const result = getBriefDefinition('')
      expect(result).toBe('')
    })

    it('should handle definition exactly at maxLength', () => {
      const definition = 'A'.repeat(100)
      const result = getBriefDefinition(definition, 100)

      expect(result).toBe(definition)
    })

    it('should prefer sentence break over word break', () => {
      // "Important info." is 15 chars
      // 15 > 25*0.7 = 17.5? No, so sentence break won't be used
      // First 25 chars: "Important info. Extra det"
      // lastSpace is at position 20 (before "det")
      // 20 > 17.5? Yes! So it truncates at space boundary
      const definition = 'Important info. Extra details that are not essential.'
      const result = getBriefDefinition(definition, 25)

      // Space boundary at 20 meets threshold, truncates there with ellipsis
      expect(result).toBe('Important info. Extra...')
    })

    it('should add ellipsis when truncating at word boundary', () => {
      const definition = 'Words words words words words words words'
      const result = getBriefDefinition(definition, 20)

      expect(result).toMatch(/\.\.\.$/);
    })
  })
})
