import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrowserSupport } from "@/components/browser-support";
import { BuildEffort } from "@/components/build-effort";
import { ComponentPreviewWithMetadata } from "@/components/component-preview-wrapper";
import { FaqStructuredData } from "@/components/faq-structured-data";
import { KitBanner } from "@/components/kit-banner";
import { LinkCustom } from "@/components/link-custom";
import { LazyMermaid } from "@/components/mdx/lazy-mermaid";
import { PatternComparison } from "@/components/pattern-comparison";
import { PatternGuideList } from "@/components/pattern-guide-list";
import { PatternPreview } from "@/components/pattern-preview";
import { PatternStats } from "@/components/pattern-stats";
import { RelatedPatternsCard } from "@/components/related-patterns-card";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		a: LinkCustom,
		Mermaid: LazyMermaid,
		ComponentPreview: ComponentPreviewWithMetadata,
		ComponentPreviewServer: (_props: any) => <></>,
		// ComponentPreviewServer: (props: ComponentPreviewServerProps) => (
		// 	<ComponentPreviewServer showHTML={true} kit={true} {...props} />
		// ),
		BrowserSupport,
		BuildEffort,
		FaqStructuredData,
		PatternPreview,
		PatternStats,
		PatternComparison,
		RelatedPatternsCard,
		PatternGuideList,
		KitBanner,
		...components,
	};
}

// Export useMDXComponents for the providerImportSource
export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return getMDXComponents(components);
}
