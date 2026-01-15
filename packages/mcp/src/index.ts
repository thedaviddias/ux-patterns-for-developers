/**
 * UX Patterns MCP Server
 * Exports for programmatic usage and HTTP API integration
 */

export { createServer, UXPatternsMCPServer } from "./server"
export type { ToolHandler } from "./server"

// Re-export types
export type {
	// Pattern types
	Pattern,
	TocItem,
	Category,
	GlossaryTerm,
	RelationshipType,
	PatternRelation,
	RelatedPattern,

	// Tool parameter/response types
	GetPatternParams,
	GetPatternResponse,
	SearchPatternsParams,
	SearchPatternsResponse,
	ListPatternsParams,
	ListPatternsResponse,
	ListCategoriesResponse,
	GetGlossaryTermParams,
	GetGlossaryTermResponse,
	ReviewCodeParams,
	ReviewCodeResponse,
	CheckAccessibilityParams,
	CheckAccessibilityResponse,
	SuggestPatternParams,
	SuggestPatternResponse,
	GetQuickReferenceParams,
	GetQuickReferenceResponse,
	PatternAdvisorParams,
	PatternAdvisorInteractiveResponse,
	PatternAdvisorRecommendationResponse,
	GetImplementationChecklistParams,
	GetImplementationChecklistResponse,

	// Error and utility types
	MCPError,
	ErrorCode,
	TelemetryStats,
	RateLimitInfo,
	RateLimitTier,
	PaginationOptions,
	PaginatedResult,
	VeliteDoc,
} from "./types"

// Export tool registration for HTTP API usage
export { registerAllTools } from "./tools"
