/**
 * Data layer exports
 */

export {
  getPatterns,
  getPatternBySlug,
  getGlossaryEntries,
  getGlossaryEntry,
  getCategories,
  searchPatterns,
  clearCache,
} from './loader'

export {
  patternRelationships,
  getPatternRelationships,
  getRelatedPatterns,
  getAlternativePatterns,
  getComplementaryPatterns,
  type PatternRelationship,
} from './relationships'

export {
  patternChecklists,
  getPatternChecklist,
  getGenericChecklist,
  filterChecklistByCategory,
  filterChecklistByPriority,
  type ChecklistItem,
  type PatternChecklist,
} from './checklists'
