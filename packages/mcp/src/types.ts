/**
 * MCP Server Types for UX Patterns
 * Based on spec.md definitions
 */

// ============================================================================
// Pattern Types
// ============================================================================

export interface Pattern {
	slug: string
	title: string
	summary?: string
	description: string
	category: string
	tags?: string[]
	status: "complete" | "published" | "draft"
	body: string
	toc?: TocItem[]
	metadata: {
		readingTime: number
		wordCount: number
	}
	aliases?: string[]
	icon?: string
	featured?: boolean
	url: string
}

export interface TocItem {
	title: string
	url: string
	items: TocItem[]
}

export interface Category {
	slug: string
	name: string
	description?: string
	patternCount: number
	patterns?: string[]
}

export interface GlossaryEntry {
	slug: string
	term: string
	definition: string
	body?: string
	toc?: TocItem[]
	relatedTerms?: string[]
	relatedPatterns?: string[]
	url: string
}

// Alias for backward compatibility
export type GlossaryTerm = GlossaryEntry

// ============================================================================
// Pattern Relationships
// ============================================================================

export type RelationshipType =
	| "related"
	| "alternative"
	| "complementary"
	| "prerequisite"

export interface PatternRelation {
	slug: string
	type: RelationshipType
	reason?: string
}

export interface RelatedPattern {
	slug: string
	title: string
	relationship: RelationshipType
	reason?: string
}

// ============================================================================
// Tool Parameters & Responses
// ============================================================================

// get_pattern
export interface GetPatternParams {
	name: string
	includeToc?: boolean
}

export interface GetPatternResponse {
	slug: string
	title: string
	summary: string
	description: string
	category: string[]
	tags: string[]
	status: "complete" | "published"
	body: string
	toc?: TocItem[]
	relatedPatterns: RelatedPattern[]
	glossaryTerms: { term: string; definition: string }[]
	metadata: {
		wordCount: number
		readingTime: number
	}
}

// search_patterns
export interface SearchPatternsParams {
	query: string
	category?: string
	tags?: string[]
	limit?: number
	cursor?: string
}

export interface SearchPatternsResponse {
	results: {
		slug: string
		title: string
		summary: string
		category: string[]
		tags: string[]
		score: number
	}[]
	total: number
	cursor?: string
	hasMore: boolean
}

// list_patterns
export interface ListPatternsParams {
	category?: string
	status?: "complete" | "published"
	limit?: number
	cursor?: string
}

export interface ListPatternsResponse {
	patterns: {
		slug: string
		title: string
		summary: string
		category: string[]
		status: string
	}[]
	total: number
	cursor?: string
	hasMore: boolean
	suggestions?: string[]
}

// list_categories
export interface ListCategoriesResponse {
	categories: Category[]
}

// get_glossary_term
export interface GetGlossaryTermParams {
	term: string
}

export interface GetGlossaryTermResponse {
	term: string
	definition: string
	relatedTerms?: string[]
	relatedPatterns?: string[]
}

// review_code
export interface ReviewCodeParams {
	code: string
	focus?: string[]
	minPriority?: "low" | "medium" | "high" | "critical"
}

export interface ReviewCodeResponse {
	issues: {
		pattern: string
		title: string
		severity: "error" | "warning" | "suggestion"
		message: string
		line?: number
		suggestion: string
	}[]
	summary: {
		total: number
		byCategory: Record<string, number>
		bySeverity: Record<string, number>
	}
}

// check_accessibility
export interface CheckAccessibilityParams {
	code: string
	patternType?: string
	wcagLevel?: "A" | "AA" | "AAA"
}

export interface CheckAccessibilityResponse {
	issues: {
		criterion: string
		level: string
		pattern?: string
		message: string
		impact: "critical" | "serious" | "moderate" | "minor"
		fix: string
	}[]
	passed: string[]
}

// suggest_pattern
export interface SuggestPatternParams {
	context: string
	category?: string
	limit?: number
}

export interface SuggestPatternResponse {
	suggestions: {
		pattern: string
		title: string
		relevance: number
		reason: string
		category: string
	}[]
}

// get_quick_reference
export interface GetQuickReferenceParams {
	category?: string
	limit?: number
	includeRelated?: boolean
}

export interface GetQuickReferenceResponse {
	patterns: {
		slug: string
		title: string
		summary: string
		category: string
		tags: string[]
	}[]
	total: number
}

// pattern_advisor
export interface PatternAdvisorParams {
	mode: "interactive" | "direct"
	requirements?: string
	sessionId?: string
	answers?: Record<string, string>
}

export interface PatternAdvisorInteractiveResponse {
	sessionId: string
	questions: {
		id: string
		question: string
		options?: string[]
		type: "single" | "multiple" | "text"
	}[]
	progress: number
}

export interface PatternAdvisorRecommendationResponse {
	recommendations: {
		pattern: string
		title: string
		confidence: number
		rationale: string
		category: string
	}[]
	alternativeApproaches?: string[]
}

// get_implementation_checklist
export interface GetImplementationChecklistParams {
	pattern: string
}

export interface GetImplementationChecklistResponse {
	pattern: string
	title: string
	checklist: {
		phase: string
		items: {
			task: string
			priority: "required" | "recommended" | "optional"
			details?: string
			patternRef?: string
		}[]
	}[]
	estimatedTime: string
	prerequisites?: string[]
}

// ============================================================================
// Error Types
// ============================================================================

export interface MCPError {
	error: string
	message: string
	suggestions?: string[]
	details?: Record<string, unknown>
}

export type ErrorCode =
	| "NOT_FOUND"
	| "INVALID_PARAMS"
	| "RATE_LIMITED"
	| "INTERNAL_ERROR"

// ============================================================================
// Telemetry Types
// ============================================================================

export interface TelemetryStats {
	toolCalls: Record<string, number>
	totalCalls: number
	cacheHits: number
	cacheMisses: number
	errors: Record<string, number>
	since: string
}

// ============================================================================
// Rate Limit Types
// ============================================================================

export interface RateLimitInfo {
	limit: number
	remaining: number
	reset: number
}

export type RateLimitTier = "get" | "search" | "review"

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationOptions {
	limit: number
	cursor?: string
}

export interface PaginatedResult<T> {
	items: T[]
	total: number
	nextCursor?: string
	hasMore: boolean
}

// ============================================================================
// Velite Data Types (from .velite/docs.json)
// ============================================================================

export interface VeliteDoc {
	title: string
	description?: string
	summary?: string
	status: "complete" | "published" | "draft"
	date?: string
	author?: string
	tags?: string[]
	hideFromNav?: boolean
	featured?: boolean
	icon?: string
	aliases?: string[]
	body: string
	toc?: TocItem[]
	metadata?: {
		readingTime: number
		wordCount: number
	}
	slug: string
	slugAsParams: string[]
	url: string
	readTime?: string
}
