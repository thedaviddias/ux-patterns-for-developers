/**
 * Tool Registry
 * Registers all MCP tools with the server
 */

import type { UXPatternsMCPServer } from '../server'

// Reactive Tools
import { listCategoriesDefinition, listCategories } from './list-categories'
import { listPatternsDefinition, listPatterns } from './list-patterns'
import { getPatternDefinition, getPattern } from './get-pattern'
import { searchPatternsDefinition, searchPatterns } from './search-patterns'
import { getGlossaryTermDefinition, getGlossaryTerm } from './get-glossary-term'

// Proactive Tools
import { getQuickReferenceDefinition, getQuickReference } from './get-quick-reference'
import { suggestPatternDefinition, suggestPattern } from './suggest-pattern'
import { reviewCodeDefinition, reviewCode } from './review-code'
import { checkAccessibilityDefinition, checkAccessibility } from './check-accessibility'

// Advanced Tools
import { patternAdvisorDefinition, patternAdvisor } from './pattern-advisor'
import { getImplementationChecklistDefinition, getImplementationChecklist } from './get-implementation-checklist'

// Re-export for direct usage
export {
  // Reactive
  listCategoriesDefinition,
  listCategories,
  listPatternsDefinition,
  listPatterns,
  getPatternDefinition,
  getPattern,
  searchPatternsDefinition,
  searchPatterns,
  getGlossaryTermDefinition,
  getGlossaryTerm,
  // Proactive
  getQuickReferenceDefinition,
  getQuickReference,
  suggestPatternDefinition,
  suggestPattern,
  reviewCodeDefinition,
  reviewCode,
  checkAccessibilityDefinition,
  checkAccessibility,
  // Advanced
  patternAdvisorDefinition,
  patternAdvisor,
  getImplementationChecklistDefinition,
  getImplementationChecklist,
}

/**
 * Register all tools with the server
 */
export function registerAllTools(server: UXPatternsMCPServer): void {
  // Reactive Tools (5)
  server.registerTool({
    ...listCategoriesDefinition,
    handler: listCategories,
  })

  server.registerTool({
    ...listPatternsDefinition,
    handler: listPatterns,
  })

  server.registerTool({
    ...getPatternDefinition,
    handler: getPattern,
  })

  server.registerTool({
    ...searchPatternsDefinition,
    handler: searchPatterns,
  })

  server.registerTool({
    ...getGlossaryTermDefinition,
    handler: getGlossaryTerm,
  })

  // Proactive Tools (4)
  server.registerTool({
    ...getQuickReferenceDefinition,
    handler: getQuickReference,
  })

  server.registerTool({
    ...suggestPatternDefinition,
    handler: suggestPattern,
  })

  server.registerTool({
    ...reviewCodeDefinition,
    handler: reviewCode,
  })

  server.registerTool({
    ...checkAccessibilityDefinition,
    handler: checkAccessibility,
  })

  // Advanced Tools (2)
  server.registerTool({
    ...patternAdvisorDefinition,
    handler: patternAdvisor,
  })

  server.registerTool({
    ...getImplementationChecklistDefinition,
    handler: getImplementationChecklist,
  })
}
