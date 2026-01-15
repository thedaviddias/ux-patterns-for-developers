/**
 * Implementation checklists for patterns
 * Provides step-by-step guidance for implementing patterns
 */

export interface ChecklistItem {
  id: string
  task: string
  category: 'structure' | 'styling' | 'accessibility' | 'behavior' | 'testing'
  priority: 'required' | 'recommended' | 'optional'
  details?: string
}

export interface PatternChecklist {
  pattern: string
  items: ChecklistItem[]
}

/**
 * Generic checklist items that apply to most patterns
 */
const genericChecklist: ChecklistItem[] = [
  {
    id: 'semantic-html',
    task: 'Use semantic HTML elements',
    category: 'structure',
    priority: 'required',
    details: 'Use appropriate HTML elements (button, input, nav, etc.) instead of generic divs',
  },
  {
    id: 'keyboard-nav',
    task: 'Implement keyboard navigation',
    category: 'accessibility',
    priority: 'required',
    details: 'Ensure all interactive elements are reachable and operable with keyboard',
  },
  {
    id: 'focus-visible',
    task: 'Add visible focus indicators',
    category: 'accessibility',
    priority: 'required',
    details: 'Provide clear visual feedback when elements receive focus',
  },
  {
    id: 'aria-labels',
    task: 'Add ARIA labels where needed',
    category: 'accessibility',
    priority: 'required',
    details: 'Use aria-label, aria-labelledby, or aria-describedby for context',
  },
  {
    id: 'color-contrast',
    task: 'Verify color contrast ratios',
    category: 'styling',
    priority: 'required',
    details: 'Ensure 4.5:1 for normal text, 3:1 for large text (WCAG AA)',
  },
  {
    id: 'responsive',
    task: 'Test responsive behavior',
    category: 'styling',
    priority: 'required',
    details: 'Verify component works on mobile, tablet, and desktop',
  },
  {
    id: 'unit-tests',
    task: 'Write unit tests',
    category: 'testing',
    priority: 'recommended',
    details: 'Cover main functionality and edge cases',
  },
  {
    id: 'a11y-tests',
    task: 'Run accessibility tests',
    category: 'testing',
    priority: 'recommended',
    details: 'Use tools like axe-core or jest-axe',
  },
]

/**
 * Pattern-specific checklists
 */
export const patternChecklists: Record<string, PatternChecklist> = {
  'forms/text-field': {
    pattern: 'forms/text-field',
    items: [
      ...genericChecklist,
      {
        id: 'input-type',
        task: 'Use correct input type attribute',
        category: 'structure',
        priority: 'required',
        details: 'Choose appropriate type: text, email, tel, url, number, etc.',
      },
      {
        id: 'label-association',
        task: 'Associate label with input',
        category: 'accessibility',
        priority: 'required',
        details: 'Use htmlFor/for attribute or wrap input in label element',
      },
      {
        id: 'placeholder',
        task: 'Use placeholder appropriately',
        category: 'structure',
        priority: 'recommended',
        details: 'Placeholder should hint at format, not replace label',
      },
      {
        id: 'error-state',
        task: 'Handle error state',
        category: 'behavior',
        priority: 'required',
        details: 'Show clear error messages with aria-describedby',
      },
      {
        id: 'autocomplete',
        task: 'Set autocomplete attribute',
        category: 'accessibility',
        priority: 'recommended',
        details: 'Use appropriate autocomplete values for user data',
      },
    ],
  },
  'forms/autocomplete': {
    pattern: 'forms/autocomplete',
    items: [
      ...genericChecklist,
      {
        id: 'combobox-role',
        task: 'Use combobox ARIA pattern',
        category: 'accessibility',
        priority: 'required',
        details: 'Set role="combobox" and related ARIA attributes',
      },
      {
        id: 'listbox',
        task: 'Implement listbox for suggestions',
        category: 'structure',
        priority: 'required',
        details: 'Use role="listbox" with role="option" children',
      },
      {
        id: 'arrow-keys',
        task: 'Support arrow key navigation',
        category: 'behavior',
        priority: 'required',
        details: 'Up/Down to navigate, Enter to select, Escape to close',
      },
      {
        id: 'debounce',
        task: 'Debounce search requests',
        category: 'behavior',
        priority: 'recommended',
        details: 'Wait 200-300ms after typing stops before fetching',
      },
      {
        id: 'loading-state',
        task: 'Show loading indicator',
        category: 'behavior',
        priority: 'recommended',
        details: 'Indicate when suggestions are being fetched',
      },
      {
        id: 'no-results',
        task: 'Handle no results state',
        category: 'behavior',
        priority: 'required',
        details: 'Show helpful message when no matches found',
      },
    ],
  },
  'overlays/modal': {
    pattern: 'overlays/modal',
    items: [
      ...genericChecklist,
      {
        id: 'dialog-role',
        task: 'Use dialog role',
        category: 'accessibility',
        priority: 'required',
        details: 'Set role="dialog" and aria-modal="true"',
      },
      {
        id: 'focus-trap',
        task: 'Trap focus inside modal',
        category: 'accessibility',
        priority: 'required',
        details: 'Tab should cycle through modal elements only',
      },
      {
        id: 'initial-focus',
        task: 'Set initial focus appropriately',
        category: 'accessibility',
        priority: 'required',
        details: 'Focus first interactive element or close button',
      },
      {
        id: 'escape-close',
        task: 'Close on Escape key',
        category: 'behavior',
        priority: 'required',
        details: 'Allow users to close modal with Escape key',
      },
      {
        id: 'backdrop-click',
        task: 'Handle backdrop click',
        category: 'behavior',
        priority: 'recommended',
        details: 'Optionally close modal when clicking outside',
      },
      {
        id: 'restore-focus',
        task: 'Restore focus on close',
        category: 'accessibility',
        priority: 'required',
        details: 'Return focus to the element that opened the modal',
      },
      {
        id: 'scroll-lock',
        task: 'Prevent background scroll',
        category: 'behavior',
        priority: 'recommended',
        details: 'Lock body scroll while modal is open',
      },
    ],
  },
  'navigation/pagination': {
    pattern: 'navigation/pagination',
    items: [
      ...genericChecklist,
      {
        id: 'nav-landmark',
        task: 'Use nav element with label',
        category: 'structure',
        priority: 'required',
        details: 'Wrap in <nav aria-label="Pagination">',
      },
      {
        id: 'current-page',
        task: 'Indicate current page',
        category: 'accessibility',
        priority: 'required',
        details: 'Use aria-current="page" on current page link',
      },
      {
        id: 'prev-next',
        task: 'Include previous/next buttons',
        category: 'structure',
        priority: 'required',
        details: 'Provide clear navigation to adjacent pages',
      },
      {
        id: 'disabled-state',
        task: 'Handle disabled state',
        category: 'behavior',
        priority: 'required',
        details: 'Disable prev on first page, next on last page',
      },
      {
        id: 'page-count',
        task: 'Show total pages',
        category: 'structure',
        priority: 'recommended',
        details: 'Display "Page X of Y" or similar',
      },
      {
        id: 'url-sync',
        task: 'Sync with URL',
        category: 'behavior',
        priority: 'recommended',
        details: 'Update URL query param for bookmarkable pages',
      },
    ],
  },
  'user-feedback/toast': {
    pattern: 'user-feedback/toast',
    items: [
      ...genericChecklist,
      {
        id: 'role-alert',
        task: 'Use appropriate ARIA role',
        category: 'accessibility',
        priority: 'required',
        details: 'Use role="alert" for important messages, role="status" for general',
      },
      {
        id: 'auto-dismiss',
        task: 'Configure auto-dismiss timing',
        category: 'behavior',
        priority: 'recommended',
        details: '4-6 seconds for success, longer for errors/warnings',
      },
      {
        id: 'manual-dismiss',
        task: 'Allow manual dismissal',
        category: 'behavior',
        priority: 'required',
        details: 'Provide close button or swipe gesture',
      },
      {
        id: 'stack-multiple',
        task: 'Handle multiple toasts',
        category: 'behavior',
        priority: 'recommended',
        details: 'Stack or queue multiple notifications',
      },
      {
        id: 'persist-errors',
        task: 'Persist error toasts',
        category: 'behavior',
        priority: 'recommended',
        details: 'Error messages should not auto-dismiss',
      },
      {
        id: 'action-button',
        task: 'Support action buttons',
        category: 'structure',
        priority: 'optional',
        details: 'Allow undo or other actions within toast',
      },
    ],
  },
}

/**
 * Get checklist for a pattern
 */
export function getPatternChecklist(patternSlug: string): PatternChecklist | null {
  const normalizedSlug = patternSlug.replace(/^patterns\//, '')
  return patternChecklists[normalizedSlug] || null
}

/**
 * Get generic checklist (applies to all patterns)
 */
export function getGenericChecklist(): ChecklistItem[] {
  return [...genericChecklist]
}

/**
 * Filter checklist by category
 */
export function filterChecklistByCategory(
  items: ChecklistItem[],
  category: ChecklistItem['category']
): ChecklistItem[] {
  return items.filter((item) => item.category === category)
}

/**
 * Filter checklist by priority
 */
export function filterChecklistByPriority(
  items: ChecklistItem[],
  priority: ChecklistItem['priority']
): ChecklistItem[] {
  return items.filter((item) => item.priority === priority)
}
