/**
 * Tests for check_accessibility tool
 */

import { checkAccessibility, checkAccessibilityDefinition } from '../../tools/check-accessibility'

describe('check_accessibility tool', () => {
  describe('checkAccessibilityDefinition', () => {
    it('should have correct name', () => {
      expect(checkAccessibilityDefinition.name).toBe('check_accessibility')
    })

    it('should require code parameter', () => {
      expect(checkAccessibilityDefinition.inputSchema.required).toContain('code')
    })

    it('should have wcagLevel parameter with enum values', () => {
      const wcagLevel = checkAccessibilityDefinition.inputSchema.properties.wcagLevel
      expect(wcagLevel.enum).toEqual(['A', 'AA', 'AAA'])
    })
  })

  describe('checkAccessibility', () => {
    describe('input validation', () => {
      it('should return empty results for empty code', async () => {
        const result = await checkAccessibility({ code: '' })

        expect(result.issues).toEqual([])
        expect(result.passed).toEqual([])
      })

      it('should return empty results for whitespace-only code', async () => {
        const result = await checkAccessibility({ code: '   ' })

        expect(result.issues).toEqual([])
      })

      it('should handle non-string code gracefully', async () => {
        const result = await checkAccessibility({ code: 123 as any })

        expect(result.issues).toEqual([])
      })

      it('should default to AA level when wcagLevel is invalid', async () => {
        const result = await checkAccessibility({
          code: '<img src="test.jpg">',
          wcagLevel: 'INVALID' as any,
        })

        // Should still run AA level checks
        expect(result.issues.length).toBeGreaterThan(0)
      })
    })

    describe('WCAG 1.1.1 - Non-text Content', () => {
      it('should flag images without alt attribute', async () => {
        const result = await checkAccessibility({
          code: '<img src="photo.jpg">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.1.1')
        expect(issue).toBeDefined()
        expect(issue?.impact).toBe('critical')
      })

      it('should pass for images with alt attribute', async () => {
        const result = await checkAccessibility({
          code: '<img src="photo.jpg" alt="A beautiful sunset">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.1.1')
        expect(issue).toBeUndefined()
        expect(result.passed).toContain('1.1.1 (Level A)')
      })

      it('should pass for images with empty alt (decorative)', async () => {
        const result = await checkAccessibility({
          code: '<img src="border.png" alt="">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.1.1')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 1.3.1 - Info and Relationships', () => {
      it('should flag inputs without labels', async () => {
        const result = await checkAccessibility({
          code: '<input type="text" name="email">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.3.1')
        expect(issue).toBeDefined()
      })

      it('should pass for inputs with label element', async () => {
        const result = await checkAccessibility({
          code: '<label for="email">Email</label><input type="text" id="email">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.3.1')
        expect(issue).toBeUndefined()
      })

      it('should pass for inputs with aria-label', async () => {
        const result = await checkAccessibility({
          code: '<input type="text" aria-label="Email address">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.3.1')
        expect(issue).toBeUndefined()
      })

      it('should pass for inputs with aria-labelledby', async () => {
        const result = await checkAccessibility({
          code: '<input type="text" aria-labelledby="email-label">',
        })

        const issue = result.issues.find((i) => i.criterion === '1.3.1')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 1.4.3 - Contrast Minimum (Level AA)', () => {
      it('should flag code with inline color styles for manual review', async () => {
        const result = await checkAccessibility({
          code: '<p style="color: #333; background-color: #ccc;">Text</p>',
          wcagLevel: 'AA',
        })

        const issue = result.issues.find((i) => i.criterion === '1.4.3')
        expect(issue).toBeDefined()
        expect(issue?.impact).toBe('serious')
      })

      it('should not flag code without both color and background', async () => {
        const result = await checkAccessibility({
          code: '<p style="color: #333;">Text</p>',
          wcagLevel: 'AA',
        })

        const issue = result.issues.find((i) => i.criterion === '1.4.3')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 2.1.1 - Keyboard Accessible', () => {
      it('should flag div with onClick handler', async () => {
        const result = await checkAccessibility({
          code: '<div onClick={handleClick}>Click me</div>',
        })

        const issue = result.issues.find((i) => i.criterion === '2.1.1')
        expect(issue).toBeDefined()
        expect(issue?.message).toContain('keyboard accessible')
      })

      it('should not flag button with onClick', async () => {
        const result = await checkAccessibility({
          code: '<button onClick={handleClick}>Click me</button>',
        })

        const issue = result.issues.find((i) => i.criterion === '2.1.1')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 2.4.4 - Link Purpose', () => {
      it('should flag links with generic text', async () => {
        const result = await checkAccessibility({
          code: '<a href="/about">click here</a>',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.4')
        expect(issue).toBeDefined()
      })

      it('should flag "read more" links', async () => {
        const result = await checkAccessibility({
          code: '<a href="/blog/post">Read more</a>',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.4')
        expect(issue).toBeDefined()
      })

      it('should pass for descriptive link text', async () => {
        const result = await checkAccessibility({
          code: '<a href="/about">Learn about our company</a>',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.4')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 2.4.7 - Focus Visible (Level AA)', () => {
      it('should flag removal of outline', async () => {
        const result = await checkAccessibility({
          code: '<button style="outline: none;">Click</button>',
          wcagLevel: 'AA',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.7')
        expect(issue).toBeDefined()
      })

      it('should flag :focus outline removal in CSS', async () => {
        const result = await checkAccessibility({
          code: ':focus { outline: 0 }',
          wcagLevel: 'AA',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.7')
        expect(issue).toBeDefined()
      })

      it('should not flag when focus visibility is maintained', async () => {
        const result = await checkAccessibility({
          code: '<button>Click</button>',
          wcagLevel: 'AA',
        })

        const issue = result.issues.find((i) => i.criterion === '2.4.7')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 4.1.1 - Parsing (Duplicate IDs)', () => {
      it('should flag duplicate IDs', async () => {
        const result = await checkAccessibility({
          code: '<div id="main"></div><section id="main"></section>',
        })

        const issue = result.issues.find((i) => i.criterion === '4.1.1')
        expect(issue).toBeDefined()
        expect(issue?.message).toContain('main')
      })

      it('should pass for unique IDs', async () => {
        const result = await checkAccessibility({
          code: '<div id="header"></div><div id="footer"></div>',
        })

        const issue = result.issues.find((i) => i.criterion === '4.1.1')
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG 4.1.2 - Name, Role, Value', () => {
      it('should flag custom button divs without role', async () => {
        const result = await checkAccessibility({
          code: '<div className="button-primary">Click me</div>',
        })

        const issue = result.issues.find((i) => i.criterion === '4.1.2')
        expect(issue).toBeDefined()
      })

      it('should pass for custom buttons with role attribute', async () => {
        const result = await checkAccessibility({
          code: '<div className="button-primary" role="button">Click me</div>',
        })

        const issue = result.issues.find((i) => i.criterion === '4.1.2')
        expect(issue).toBeUndefined()
      })
    })

    describe('Pattern-specific checks: Modal', () => {
      it('should flag modals without role="dialog"', async () => {
        const result = await checkAccessibility({
          code: '<div className="modal"><h2>Title</h2></div>',
          patternType: 'modal',
        })

        const issue = result.issues.find(
          (i) => i.criterion === '2.4.3' && i.pattern === 'modal'
        )
        expect(issue).toBeDefined()
      })

      it('should pass for modals with role="dialog"', async () => {
        const result = await checkAccessibility({
          code: '<div role="dialog" aria-labelledby="title"><h2 id="title">Title</h2></div>',
          patternType: 'modal',
        })

        const roleIssue = result.issues.find(
          (i) =>
            i.criterion === '2.4.3' &&
            i.pattern === 'modal' &&
            i.message.includes('role="dialog"')
        )
        expect(roleIssue).toBeUndefined()
      })

      it('should flag modals without accessible name', async () => {
        const result = await checkAccessibility({
          code: '<div role="dialog"><h2>Title</h2></div>',
          patternType: 'modal',
        })

        const issue = result.issues.find(
          (i) => i.message.includes('accessible name')
        )
        expect(issue).toBeDefined()
      })

      it('should pass for modals with aria-labelledby', async () => {
        const result = await checkAccessibility({
          code: '<div role="dialog" aria-labelledby="modal-title"><h2 id="modal-title">Title</h2></div>',
          patternType: 'modal',
        })

        const nameIssue = result.issues.find(
          (i) => i.message.includes('accessible name')
        )
        expect(nameIssue).toBeUndefined()
      })

      it('should pass for modals with aria-label', async () => {
        const result = await checkAccessibility({
          code: '<div role="dialog" aria-label="Confirm deletion">Content</div>',
          patternType: 'modal',
        })

        const nameIssue = result.issues.find(
          (i) => i.message.includes('accessible name')
        )
        expect(nameIssue).toBeUndefined()
      })
    })

    describe('Pattern-specific checks: Form', () => {
      it('should flag forms with visible errors but no aria-invalid', async () => {
        const result = await checkAccessibility({
          code: `
            <input type="email" />
            <span className="error">Invalid email</span>
          `,
          patternType: 'form',
        })

        const issue = result.issues.find(
          (i) => i.criterion === '3.3.1' && i.pattern === 'form'
        )
        expect(issue).toBeDefined()
      })

      it('should not flag forms without error states', async () => {
        const result = await checkAccessibility({
          code: `
            <label for="email">Email</label>
            <input type="email" id="email" />
          `,
          patternType: 'form',
        })

        const issue = result.issues.find(
          (i) => i.criterion === '3.3.1' && i.pattern === 'form'
        )
        expect(issue).toBeUndefined()
      })

      it('should pass for forms with aria-invalid on error fields', async () => {
        const result = await checkAccessibility({
          code: `
            <input type="email" aria-invalid="true" aria-describedby="error" />
            <span className="error" id="error">Invalid email</span>
          `,
          patternType: 'form',
        })

        const issue = result.issues.find(
          (i) => i.criterion === '3.3.1' && i.pattern === 'form'
        )
        expect(issue).toBeUndefined()
      })
    })

    describe('WCAG Level Filtering', () => {
      it('should only run Level A checks when wcagLevel is A', async () => {
        const result = await checkAccessibility({
          code: '<div style="outline: none;">Content</div>',
          wcagLevel: 'A',
        })

        // 2.4.7 is Level AA, should not be checked
        const aaIssue = result.issues.find((i) => i.criterion === '2.4.7')
        expect(aaIssue).toBeUndefined()
      })

      it('should include Level A and AA checks when wcagLevel is AA', async () => {
        const result = await checkAccessibility({
          code: `
            <img src="test.jpg">
            <div style="outline: none;">Content</div>
          `,
          wcagLevel: 'AA',
        })

        const aIssue = result.issues.find((i) => i.criterion === '1.1.1') // Level A
        const aaIssue = result.issues.find((i) => i.criterion === '2.4.7') // Level AA

        expect(aIssue).toBeDefined()
        expect(aaIssue).toBeDefined()
      })
    })

    describe('Passed checks tracking', () => {
      it('should include passed criteria', async () => {
        const result = await checkAccessibility({
          code: '<img src="test.jpg" alt="Description">',
        })

        expect(result.passed).toContain('1.1.1 (Level A)')
      })

      it('should include passed pattern-specific checks', async () => {
        const result = await checkAccessibility({
          code: '<div role="dialog" aria-labelledby="title"><h2 id="title">Title</h2></div>',
          patternType: 'modal',
        })

        expect(result.passed.some((p) => p.includes('modal'))).toBe(true)
      })

      it('should deduplicate passed criteria', async () => {
        const result = await checkAccessibility({
          code: '<p>Simple text content</p>',
        })

        const uniquePassed = [...new Set(result.passed)]
        expect(result.passed.length).toBe(uniquePassed.length)
      })
    })

    describe('Case insensitivity', () => {
      it('should be case-insensitive for pattern type', async () => {
        const result = await checkAccessibility({
          code: '<div>Modal content</div>',
          patternType: 'MODAL',
        })

        const modalIssue = result.issues.find((i) => i.pattern === 'modal')
        expect(modalIssue).toBeDefined()
      })
    })
  })
})
