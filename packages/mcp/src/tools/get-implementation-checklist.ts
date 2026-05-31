/**
 * get_implementation_checklist tool
 * Returns step-by-step implementation guidance for a pattern
 */

import { getPatternBySlug, getPatterns } from '../data'
import { getPatternChecklist, getGenericChecklist } from '../data/checklists'
import { findBestMatches } from '../utils'
import type { GetImplementationChecklistParams, GetImplementationChecklistResponse, MCPError } from '../types'

export const getImplementationChecklistDefinition = {
  name: 'get_implementation_checklist',
  description: 'Get a step-by-step implementation checklist for a UX pattern',
  inputSchema: {
    type: 'object' as const,
    properties: {
      pattern: {
        type: 'string',
        description: 'Pattern name or slug (e.g., "modal", "forms/text-field")',
      },
    },
    required: ['pattern'],
  },
}

export async function getImplementationChecklist(
  args: Record<string, unknown>
): Promise<GetImplementationChecklistResponse | MCPError> {
  const params = args as unknown as GetImplementationChecklistParams
  const { pattern: patternName } = params

  if (!patternName || patternName.trim().length === 0) {
    return {
      error: 'INVALID_PARAMS',
      message: 'Pattern parameter is required',
    }
  }

  // Try to find the pattern
  let pattern = getPatternBySlug(patternName)

  // If not found by slug, try to find by title
  if (!pattern) {
    const patterns = getPatterns()
    pattern = patterns.find(
      (p) =>
        p.title.toLowerCase() === patternName.toLowerCase() ||
        p.slug.toLowerCase().includes(patternName.toLowerCase())
    ) ?? null
  }

  if (!pattern) {
    const patterns = getPatterns()
    const allNames = patterns.flatMap((p) => [
      p.slug.replace('patterns/', ''),
      p.title,
    ])
    const suggestions = findBestMatches(patternName, allNames, { maxResults: 3 })

    return {
      error: 'NOT_FOUND',
      message: `Pattern "${patternName}" not found`,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    }
  }

  // Get pattern-specific checklist or fall back to generic
  const specificChecklist = getPatternChecklist(pattern.slug)
  const checklistItems = specificChecklist?.items || getGenericChecklist()

  // Group items by category/phase
  const phases: Record<string, typeof checklistItems> = {
    structure: [],
    styling: [],
    behavior: [],
    accessibility: [],
    testing: [],
  }

  for (const item of checklistItems) {
    if (phases[item.category]) {
      phases[item.category].push(item)
    }
  }

  // Build response checklist
  const checklist = Object.entries(phases)
    .filter(([_, items]) => items.length > 0)
    .map(([phase, items]) => ({
      phase: phase.charAt(0).toUpperCase() + phase.slice(1),
      items: items.map((item) => ({
        task: item.task,
        priority: item.priority,
        details: item.details,
        patternRef: item.id,
      })),
    }))

  // Estimate time based on checklist complexity
  const requiredCount = checklistItems.filter((i) => i.priority === 'required').length
  const estimatedTime =
    requiredCount <= 5
      ? '30 minutes - 1 hour'
      : requiredCount <= 10
        ? '1-2 hours'
        : '2-4 hours'

  // Get prerequisites (related patterns that should be understood first)
  const prerequisites: string[] = []
  if (pattern.category === 'overlays') {
    prerequisites.push('Understand focus management basics')
  }
  if (pattern.slug.includes('form')) {
    prerequisites.push('Understand form validation patterns')
  }

  return {
    pattern: pattern.slug,
    title: pattern.title,
    checklist,
    estimatedTime,
    prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
  }
}
