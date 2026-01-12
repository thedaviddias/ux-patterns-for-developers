import type { MDXComponents } from "mdx/types";
import { BrowserSupport } from "@/components/browser-support";
import { BuildEffort } from "@/components/build-effort";
import { ComponentPreviewWithMetadata } from "@/components/component-preview-wrapper";
import { FaqStructuredData } from "@/components/faq-structured-data";
import { GlossaryStructuredData } from "@/components/glossary/structured-data";
import { GuidesBanner } from "@/components/guides-banner";
import { TermsListClient } from "@/components/glossary/terms-list-client";
import { LinkCustom } from "@/components/link-custom";
import { PatternComparison } from "@/components/pattern-comparison";
import { ComparisonGrid } from "@/components/pattern-comparison/comparison-grid";
import { ComparisonHero } from "@/components/pattern-comparison/comparison-hero";
import { DecisionFlowSection } from "@/components/pattern-comparison/decision-flow-section";
import { ExamplesGrid } from "@/components/pattern-comparison/examples-grid";
import { ImplementationMetrics } from "@/components/pattern-comparison/implementation-metrics";
import { PerformanceComparison } from "@/components/pattern-comparison/performance-comparison";
import { LazyDecisionFlow } from "@/components/decision-flow/lazy-decision-flow";
import { PatternGuideList } from "@/components/pattern-guide-list";
import { PatternPreview } from "@/components/pattern-preview";
import { PatternStats } from "@/components/pattern-stats";
import { Playground } from "@/components/playground";
import { StepsPagination } from "@/components/seo/steps-pagination";
import { RelatedPatternsCardServer } from "@/components/related-patterns-card-server";
import { ComponentPreviewServerStub } from "@/components/component-preview-server-stub";
import {
	Callout,
	Cards,
	Card,
	Code,
	Pre,
	LazyMermaid,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	P,
	Blockquote,
	Ul,
	Ol,
	Li,
	Hr,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Strong,
	Em,
	Img,
} from "@/components/mdx";

/**
 * Base MDX components for rendering markdown content.
 * These replace the fumadocs defaults with our custom implementations.
 */
const baseMdxComponents: MDXComponents = {
	// Typography
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	p: P,
	blockquote: Blockquote,
	strong: Strong,
	em: Em,

	// Lists
	ul: Ul,
	ol: Ol,
	li: Li,

	// Code
	code: Code,
	pre: Pre,

	// Tables
	table: Table,
	thead: Thead,
	tbody: Tbody,
	tr: Tr,
	th: Th,
	td: Td,

	// Other
	hr: Hr,
	img: Img,
	a: LinkCustom,
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...baseMdxComponents,
		// Custom components
		Callout,
		Cards,
		Card,
		Mermaid: LazyMermaid,
		ComponentPreview: ComponentPreviewWithMetadata,
		ComponentPreviewServer: ComponentPreviewServerStub,
		BrowserSupport,
		BuildEffort,
		FaqStructuredData,
		GlossaryStructuredData,
		PatternPreview,
		PatternStats,
		PatternComparison,
		ComparisonGrid,
		ComparisonHero,
		DecisionFlowSection,
		ExamplesGrid,
		ImplementationMetrics,
		PerformanceComparison,
		LazyDecisionFlow,
		RelatedPatternsCard: RelatedPatternsCardServer,
		PatternGuideList,
		Playground,
		GuidesBanner,
		StepsPagination,
		TermsListContainer: TermsListClient,
		...components,
	};
}

// Export useMDXComponents for the providerImportSource
export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return getMDXComponents(components);
}
