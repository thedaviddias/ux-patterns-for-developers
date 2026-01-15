/**
 * Utility exports for MCP server
 */

export { LRUCache, serverCache } from './cache'
export { checkRateLimit, getClientIdentifier, type RateLimitResult } from './rate-limit'
export {
  encodeCursor,
  decodeCursor,
  paginate,
  getPaginationMeta,
  type PaginationParams,
  type PaginatedResult,
} from './pagination'
export {
  levenshteinDistance,
  similarityRatio,
  findBestMatches,
  containsIgnoreCase,
  fuzzySearch,
} from './fuzzy-match'
export {
  mdxToMarkdown,
  extractFrontmatter,
  truncateContent,
} from './mdx-to-markdown'
export {
  linkGlossaryTerms,
  findMentionedTerms,
  getBriefDefinition,
  type GlossaryTerm,
} from './glossary-linker'
export {
  recordToolCall,
  recordError,
  getTelemetrySummary,
  resetTelemetry,
  getMostPopularTools,
} from './telemetry'
