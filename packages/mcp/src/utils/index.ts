/**
 * Utility exports for MCP server
 */

export { LRUCache, serverCache } from "./cache";
export {
	containsIgnoreCase,
	findBestMatches,
	fuzzySearch,
	levenshteinDistance,
	similarityRatio,
} from "./fuzzy-match";
export {
	findMentionedTerms,
	type GlossaryTerm,
	getBriefDefinition,
	linkGlossaryTerms,
} from "./glossary-linker";
export {
	extractFrontmatter,
	mdxToMarkdown,
	truncateContent,
} from "./mdx-to-markdown";
export {
	decodeCursor,
	encodeCursor,
	getPaginationMeta,
	type PaginatedResult,
	type PaginationParams,
	paginate,
} from "./pagination";
export {
	checkRateLimit,
	getClientIdentifier,
	type RateLimitResult,
} from "./rate-limit";
export {
	capResponseText,
	DEFAULT_MAX_RESPONSE_CHARS,
} from "./response-cap";
export {
	getMostPopularTools,
	getTelemetrySummary,
	recordError,
	recordToolCall,
	resetTelemetry,
} from "./telemetry";
