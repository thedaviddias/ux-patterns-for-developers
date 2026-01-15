/**
 * check_accessibility tool
 * WCAG compliance checking for UI code
 */

import type { CheckAccessibilityParams, CheckAccessibilityResponse } from '../types'

export const checkAccessibilityDefinition = {
  name: 'check_accessibility',
  description: 'Check code for WCAG accessibility compliance issues',
  inputSchema: {
    type: 'object' as const,
    properties: {
      code: {
        type: 'string',
        description: 'HTML or JSX code to check for accessibility issues',
      },
      patternType: {
        type: 'string',
        description: 'Type of UI pattern being checked (e.g., "modal", "form")',
      },
      wcagLevel: {
        type: 'string',
        enum: ['A', 'AA', 'AAA'],
        description: 'WCAG compliance level to check against (default: "AA")',
        default: 'AA',
      },
    },
    required: ['code'],
  },
}

interface A11yIssue {
  criterion: string
  level: 'A' | 'AA' | 'AAA'
  pattern?: string
  message: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  fix: string
}

// WCAG criterion checks
const wcagChecks: Array<{
  criterion: string
  level: 'A' | 'AA' | 'AAA'
  check: (code: string) => A11yIssue | null
}> = [
  // 1.1.1 Non-text Content (Level A)
  {
    criterion: '1.1.1',
    level: 'A',
    check: (code) => {
      if (/<img(?![^>]*alt=)[^>]*>/i.test(code)) {
        return {
          criterion: '1.1.1',
          level: 'A',
          message: 'Images must have alt text',
          impact: 'critical',
          fix: 'Add alt="" for decorative images or descriptive text for informative images',
        }
      }
      return null
    },
  },
  // 1.3.1 Info and Relationships (Level A)
  {
    criterion: '1.3.1',
    level: 'A',
    check: (code) => {
      if (/<input[^>]*>/i.test(code) && !/<label/i.test(code) && !/aria-label/i.test(code)) {
        return {
          criterion: '1.3.1',
          level: 'A',
          message: 'Form inputs must have programmatically associated labels',
          impact: 'critical',
          fix: 'Add <label htmlFor="id"> or aria-label/aria-labelledby',
        }
      }
      return null
    },
  },
  // 1.4.3 Contrast Minimum (Level AA)
  {
    criterion: '1.4.3',
    level: 'AA',
    check: (code) => {
      // Check for potentially problematic color combinations
      if (/color:\s*#[a-f0-9]{3,6}/i.test(code) && /background(-color)?:\s*#[a-f0-9]{3,6}/i.test(code)) {
        return {
          criterion: '1.4.3',
          level: 'AA',
          message: 'Ensure text has sufficient contrast (4.5:1 for normal text, 3:1 for large text)',
          impact: 'serious',
          fix: 'Use a contrast checker to verify color combinations meet WCAG requirements',
        }
      }
      return null
    },
  },
  // 2.1.1 Keyboard (Level A)
  {
    criterion: '2.1.1',
    level: 'A',
    check: (code) => {
      if (/<div[^>]*onClick[^>]*>/i.test(code)) {
        return {
          criterion: '2.1.1',
          level: 'A',
          message: 'Interactive elements must be keyboard accessible',
          impact: 'critical',
          fix: 'Use <button> instead of <div> for clickable elements, or add tabIndex and onKeyDown',
        }
      }
      return null
    },
  },
  // 2.4.4 Link Purpose (Level A)
  {
    criterion: '2.4.4',
    level: 'A',
    check: (code) => {
      if (/<a[^>]*>(\s*(click here|read more|learn more)\s*)<\/a>/i.test(code)) {
        return {
          criterion: '2.4.4',
          level: 'A',
          message: 'Link text must be descriptive',
          impact: 'moderate',
          fix: 'Use descriptive link text that makes sense out of context (e.g., "Read the accessibility guide")',
        }
      }
      return null
    },
  },
  // 2.4.7 Focus Visible (Level AA)
  {
    criterion: '2.4.7',
    level: 'AA',
    check: (code) => {
      if (/outline:\s*(none|0)|:focus\s*{\s*outline:\s*(none|0)/i.test(code)) {
        return {
          criterion: '2.4.7',
          level: 'AA',
          message: 'Focus indicators must be visible',
          impact: 'serious',
          fix: 'Provide alternative focus styles if removing outline (e.g., ring, background color change)',
        }
      }
      return null
    },
  },
  // 4.1.1 Parsing (Level A) - Duplicate IDs
  {
    criterion: '4.1.1',
    level: 'A',
    check: (code) => {
      const ids = code.match(/id="([^"]+)"/g) || []
      const idValues = ids.map((id) => id.match(/id="([^"]+)"/)?.[1])
      const duplicates = idValues.filter((id, index) => idValues.indexOf(id) !== index)
      if (duplicates.length > 0) {
        return {
          criterion: '4.1.1',
          level: 'A',
          message: `Duplicate ID attributes found: ${duplicates.join(', ')}`,
          impact: 'serious',
          fix: 'Ensure all id attributes are unique within the document',
        }
      }
      return null
    },
  },
  // 4.1.2 Name, Role, Value (Level A)
  {
    criterion: '4.1.2',
    level: 'A',
    check: (code) => {
      // Check for custom components without ARIA roles
      if (/<div[^>]*className="[^"]*button[^"]*"[^>]*>/i.test(code) && !/role=/i.test(code)) {
        return {
          criterion: '4.1.2',
          level: 'A',
          message: 'Custom interactive components must have appropriate ARIA roles',
          impact: 'critical',
          fix: 'Add role="button" to elements that function as buttons but are not <button> elements',
        }
      }
      return null
    },
  },
]

// Pattern-specific checks
const patternChecks: Record<
  string,
  Array<{ criterion: string; level: 'A' | 'AA' | 'AAA'; check: (code: string) => A11yIssue | null }>
> = {
  modal: [
    {
      criterion: '2.4.3',
      level: 'A',
      check: (code) => {
        if (!(/role="dialog"/i.test(code) || /role='dialog'/i.test(code))) {
          return {
            criterion: '2.4.3',
            level: 'A',
            pattern: 'modal',
            message: 'Modal dialogs must have role="dialog"',
            impact: 'critical',
            fix: 'Add role="dialog" and aria-modal="true" to the modal container',
          }
        }
        return null
      },
    },
    {
      criterion: '2.4.3',
      level: 'A',
      check: (code) => {
        if (!/aria-labelledby|aria-label/i.test(code)) {
          return {
            criterion: '2.4.3',
            level: 'A',
            pattern: 'modal',
            message: 'Modal dialogs must have an accessible name',
            impact: 'critical',
            fix: 'Add aria-labelledby pointing to the modal title or aria-label',
          }
        }
        return null
      },
    },
  ],
  form: [
    {
      criterion: '3.3.1',
      level: 'A',
      check: (code) => {
        if (/required/i.test(code) && !/aria-required|aria-invalid/i.test(code)) {
          return {
            criterion: '3.3.1',
            level: 'A',
            pattern: 'form',
            message: 'Required fields should indicate errors accessibly',
            impact: 'moderate',
            fix: 'Use aria-required="true" and aria-invalid="true" with aria-describedby for errors',
          }
        }
        return null
      },
    },
  ],
}

const levelOrder: Record<string, number> = { A: 0, AA: 1, AAA: 2 }

export async function checkAccessibility(
  args: Record<string, unknown>
): Promise<CheckAccessibilityResponse> {
  const params = args as unknown as CheckAccessibilityParams
  const { code, patternType, wcagLevel = 'AA' } = params

  if (!code || code.trim().length === 0) {
    return { issues: [], passed: [] }
  }

  const issues: A11yIssue[] = []
  const passed: string[] = []
  const targetLevel = levelOrder[wcagLevel]

  // Run general WCAG checks
  for (const check of wcagChecks) {
    if (levelOrder[check.level] <= targetLevel) {
      const issue = check.check(code)
      if (issue) {
        issues.push(issue)
      } else {
        passed.push(`${check.criterion} (Level ${check.level})`)
      }
    }
  }

  // Run pattern-specific checks
  if (patternType && patternChecks[patternType.toLowerCase()]) {
    for (const check of patternChecks[patternType.toLowerCase()]) {
      if (levelOrder[check.level] <= targetLevel) {
        const issue = check.check(code)
        if (issue) {
          issues.push(issue)
        }
      }
    }
  }

  // Deduplicate passed criteria
  const uniquePassed = [...new Set(passed)]

  return {
    issues,
    passed: uniquePassed,
  }
}
