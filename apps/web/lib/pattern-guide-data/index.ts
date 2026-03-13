/**
 * Pattern guide data exports
 *
 * These are exported to be used in MDX scope since next-mdx-remote
 * doesn't support inline exports in MDX files.
 */

// Choosing input types data
export {
	comparisonData as inputTypesComparisonData,
	examplesData as inputTypesExamplesData,
	implementationData as inputTypesImplementationData,
} from "./choosing-input-types";
// Pagination vs infinite scroll vs load more data
export { comparisonData as loadingPatternsComparisonData } from "./loading-patterns";
// Modal vs popover data
export { comparisonData as modalComparisonData } from "./modal-vs-popover";
// Pagination vs infinite scroll data
export {
	comparisonData as paginationComparisonData,
	examplesData as paginationExamplesData,
	performanceData as paginationPerformanceData,
} from "./pagination-vs-infinite-scroll";

// Search field vs command palette data
export { comparisonData as searchVsCommandComparisonData } from "./search-vs-command-palette";

// Table vs list vs cards data
export { comparisonData as tableComparisonData } from "./table-vs-list-vs-cards";
