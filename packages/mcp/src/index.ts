/**
 * UX Patterns MCP Server
 * Exports for programmatic usage and HTTP API integration
 */

export type { ToolHandler } from "./server";
export {
	createServer,
	MCP_PROTOCOL_VERSION,
	MCP_SERVER_INFO,
	UXPatternsMCPServer,
} from "./server";
// Export tool registration for HTTP API usage
export { registerAllTools } from "./tools";
// Re-export types
export type {
	Category,
	CheckAccessibilityParams,
	CheckAccessibilityResponse,
	ErrorCode,
	GetGlossaryTermParams,
	GetGlossaryTermResponse,
	GetImplementationChecklistParams,
	GetImplementationChecklistResponse,
	// Tool parameter/response types
	GetPatternParams,
	GetPatternResponse,
	GetQuickReferenceParams,
	GetQuickReferenceResponse,
	GlossaryTerm,
	ListCategoriesResponse,
	ListPatternsParams,
	ListPatternsResponse,
	// Error and utility types
	MCPError,
	PaginatedResult,
	PaginationOptions,
	// Pattern types
	Pattern,
	PatternAdvisorInteractiveResponse,
	PatternAdvisorParams,
	PatternAdvisorRecommendationResponse,
	PatternRelation,
	RateLimitInfo,
	RateLimitTier,
	RelatedPattern,
	RelationshipType,
	ReviewCodeParams,
	ReviewCodeResponse,
	SearchPatternsParams,
	SearchPatternsResponse,
	SuggestPatternParams,
	SuggestPatternResponse,
	TelemetryStats,
	TocItem,
	VeliteDoc,
} from "./types";
