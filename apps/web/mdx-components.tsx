import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrowserSupport } from "@/components/browser-support";
import { BuildEffort } from "@/components/build-effort";
import { ComponentPreviewWithMetadata } from "@/components/component-preview-wrapper";
import { FaqStructuredData } from "@/components/faq-structured-data";
import { GalleryBanner } from "@/components/gallery-banner";
import { GalleryImage } from "@/components/gallery-image";
import { KitBanner } from "@/components/kit-banner";
import { LinkCustom } from "@/components/link-custom";
import { LazyMermaid } from "@/components/mdx/lazy-mermaid";
import { PatternComparison } from "@/components/pattern-comparison";
import { PatternGuideList } from "@/components/pattern-guide-list";
import { PatternPreview } from "@/components/pattern-preview";
import { PatternStats } from "@/components/pattern-stats";
import { RelatedPatternsCardServer } from "@/components/related-patterns-card-server";

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
		RelatedPatternsCard: RelatedPatternsCardServer,
		PatternGuideList,
		KitBanner,
		GalleryBanner,
		GalleryImage,
		...components,
	};
}

// Export useMDXComponents for the providerImportSource
export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return getMDXComponents(components);
}
