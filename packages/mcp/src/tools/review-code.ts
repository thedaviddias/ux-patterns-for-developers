/**
 * review_code tool
 * Analyzes UI code against UX pattern best practices
 */

import { getPatterns } from '../data'
import type { ReviewCodeParams, ReviewCodeResponse } from '../types'

export const reviewCodeDefinition = {
  name: 'review_code',
  description: 'Review UI code against UX pattern best practices and identify potential issues',
  inputSchema: {
    type: 'object' as const,
    properties: {
      code: {
        type: 'string',
        description: 'The code snippet to review (HTML, JSX, or component code)',
      },
      focus: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific areas to focus on (e.g., ["accessibility", "forms"])',
      },
      minPriority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Minimum priority level to report (default: "low")',
        default: 'low',
      },
    },
    required: ['code'],
  },
}

interface CodeIssue {
  pattern: string
  title: string
  severity: 'error' | 'warning' | 'suggestion'
  message: string
  line?: number
  suggestion: string
}

// Pattern-based code rules
const codeRules: Array<{
  pattern: RegExp
  check: (match: RegExpMatchArray, code: string) => CodeIssue | null
}> = [
  // Missing labels on inputs
  {
    pattern: /<input[^>]*(?!.*aria-label|.*aria-labelledby)[^>]*>/gi,
    check: (match, code) => {
      const hasLabel = code.includes('<label') && code.includes('for=')
      if (!hasLabel && !match[0].includes('aria-label')) {
        return {
          pattern: 'forms/text-field',
          title: 'Missing Input Label',
          severity: 'error',
          message: 'Input elements should have associated labels for accessibility',
          suggestion: 'Add a <label> with htmlFor attribute or aria-label to the input',
        }
      }
      return null
    },
  },
  // Missing button type
  {
    pattern: /<button(?![^>]*type=)[^>]*>/gi,
    check: () => ({
      pattern: 'forms/submit-button',
      title: 'Missing Button Type',
      severity: 'warning',
      message: 'Button elements should have an explicit type attribute',
      suggestion: 'Add type="button", type="submit", or type="reset"',
    }),
  },
  // onClick on div (should be button)
  {
    pattern: /<div[^>]*onClick[^>]*>/gi,
    check: () => ({
      pattern: 'accessibility',
      title: 'Non-semantic Click Handler',
      severity: 'error',
      message: 'Click handlers on divs are not accessible. Use a button or link instead',
      suggestion: 'Replace <div onClick> with <button onClick> for keyboard accessibility',
    }),
  },
  // Missing alt on images
  {
    pattern: /<img(?![^>]*alt=)[^>]*>/gi,
    check: () => ({
      pattern: 'accessibility',
      title: 'Missing Image Alt Text',
      severity: 'error',
      message: 'Images must have alt attributes for screen readers',
      suggestion: 'Add alt="" for decorative images or descriptive text for meaningful images',
    }),
  },
  // Missing aria-label on icon buttons
  {
    pattern: /<button[^>]*>[^<]*<(svg|i|span class="icon")[^>]*>[^<]*<\/button>/gi,
    check: (match) => {
      if (!match[0].includes('aria-label')) {
        return {
          pattern: 'accessibility',
          title: 'Icon Button Missing Label',
          severity: 'error',
          message: 'Icon-only buttons must have an aria-label',
          suggestion: 'Add aria-label="Description" to the button',
        }
      }
      return null
    },
  },
  // Form without onSubmit
  {
    pattern: /<form(?![^>]*onSubmit)[^>]*>/gi,
    check: () => ({
      pattern: 'forms/form-layout',
      title: 'Form Missing Submit Handler',
      severity: 'warning',
      message: 'Forms should have an onSubmit handler to support keyboard submission',
      suggestion: 'Add onSubmit handler to handle Enter key submission',
    }),
  },
  // Autofocus attribute
  {
    pattern: /autoFocus|autofocus/gi,
    check: () => ({
      pattern: 'accessibility',
      title: 'Autofocus May Cause Issues',
      severity: 'suggestion',
      message: 'Autofocus can be disorienting for screen reader users and on mobile',
      suggestion: 'Consider if autofocus is truly necessary for your use case',
    }),
  },
  // Missing role on custom components
  {
    pattern: /<div[^>]*className="[^"]*modal[^"]*"[^>]*>/gi,
    check: (match) => {
      if (!match[0].includes('role=')) {
        return {
          pattern: 'overlays/modal',
          title: 'Modal Missing ARIA Role',
          severity: 'error',
          message: 'Modal elements should have role="dialog" and aria-modal="true"',
          suggestion: 'Add role="dialog" aria-modal="true" to the modal container',
        }
      }
      return null
    },
  },
  // Placeholder as label anti-pattern
  {
    pattern: /<input[^>]*placeholder="[^"]{20,}"[^>]*>/gi,
    check: () => ({
      pattern: 'forms/text-field',
      title: 'Long Placeholder Text',
      severity: 'warning',
      message: 'Long placeholder text is an anti-pattern. Use labels and helper text instead',
      suggestion: 'Move instructions to a label or helper text below the input',
    }),
  },
]

const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
const severityToPriority: Record<string, keyof typeof priorityOrder> = {
  suggestion: 'low',
  warning: 'medium',
  error: 'high',
}

export async function reviewCode(
  args: Record<string, unknown>
): Promise<ReviewCodeResponse> {
  const params = args as unknown as ReviewCodeParams
  const { code, focus, minPriority = 'low' } = params

  if (!code || code.trim().length === 0) {
    return {
      issues: [],
      summary: { total: 0, byCategory: {}, bySeverity: {} },
    }
  }

  const issues: CodeIssue[] = []

  // Run all pattern rules
  for (const rule of codeRules) {
    const matches = code.matchAll(rule.pattern)
    for (const match of matches) {
      const issue = rule.check(match, code)
      if (issue) {
        // Find line number
        const beforeMatch = code.slice(0, match.index)
        const line = beforeMatch.split('\n').length

        issues.push({ ...issue, line })
      }
    }
  }

  // Filter by focus areas if specified
  let filteredIssues = issues
  if (focus && focus.length > 0) {
    const focusLower = focus.map((f) => f.toLowerCase())
    filteredIssues = issues.filter((issue) =>
      focusLower.some(
        (f) =>
          issue.pattern.toLowerCase().includes(f) ||
          issue.title.toLowerCase().includes(f)
      )
    )
  }

  // Filter by minimum priority
  const minPriorityLevel = priorityOrder[minPriority]
  filteredIssues = filteredIssues.filter((issue) => {
    const issuePriority = severityToPriority[issue.severity]
    return priorityOrder[issuePriority] >= minPriorityLevel
  })

  // Build summary
  const byCategory: Record<string, number> = {}
  const bySeverity: Record<string, number> = {}

  for (const issue of filteredIssues) {
    const category = issue.pattern.split('/')[0] || 'general'
    byCategory[category] = (byCategory[category] || 0) + 1
    bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1
  }

  return {
    issues: filteredIssues,
    summary: {
      total: filteredIssues.length,
      byCategory,
      bySeverity,
    },
  }
}
