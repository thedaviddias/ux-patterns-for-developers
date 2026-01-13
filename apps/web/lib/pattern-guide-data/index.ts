/**
 * Pattern guide data exports
 * 
 * These are exported to be used in MDX scope since next-mdx-remote
 * doesn't support inline exports in MDX files.
 */

// Choosing input types data
export {
  comparisonData as inputTypesComparisonData,
  implementationData as inputTypesImplementationData,
  examplesData as inputTypesExamplesData,
} from "./choosing-input-types";

// Pagination vs infinite scroll data
export {
  comparisonData as paginationComparisonData,
  performanceData as paginationPerformanceData,
  examplesData as paginationExamplesData,
} from "./pagination-vs-infinite-scroll";

// Modal vs popover data
export { comparisonData as modalComparisonData } from "./modal-vs-popover";

// Table vs list vs cards data
export { comparisonData as tableComparisonData } from "./table-vs-list-vs-cards";
