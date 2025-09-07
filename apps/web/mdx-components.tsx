import {
	ComponentPreviewServer,
	type ComponentPreviewServerProps,
} from "@ux-patterns/ui/components/custom/registry/component-preview-server";
import { Pre, withIcons } from "nextra/components";
import { GitHubIcon } from "nextra/icons";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type React from "react";
import { BrowserSupport } from "./app/_components/browser-support";
import { BuildEffort } from "./app/_components/build-effort";
import {
	ComponentPreviewWithMetadata,
	MetadataProvider,
} from "./app/_components/component-preview-wrapper";
import { FaqStructuredData } from "./app/_components/faq-structured-data";
import { KitBanner } from "./app/_components/kit-banner";
import { LinkCustom } from "./app/_components/link-custom";
import { PatternComparison } from "./app/_components/pattern-comparison";
import { PatternPreview } from "./app/_components/pattern-preview";
import { PatternStats } from "./app/_components/pattern-stats";
import { RelatedPatternsCard } from "./app/_components/related-patterns-card";

const docsComponents = getDocsMDXComponents({
	pre: withIcons(Pre, { js: GitHubIcon }),
});

export const useMDXComponents = (
	components: Record<string, unknown>,
): Record<string, unknown> => ({
	...docsComponents,
	...components,
	a: LinkCustom,
	ComponentPreview: ComponentPreviewWithMetadata,
	ComponentPreviewServer: (props: ComponentPreviewServerProps) => (
		<ComponentPreviewServer showHTML={true} kit={true} {...props} />
	),
	BrowserSupport,
	BuildEffort,
	FaqStructuredData,
	PatternPreview,
	PatternStats,
	PatternComparison,
	RelatedPatternsCard,
	KitBanner,
	wrapper: ({ children, metadata, ...props }: any) => {
		const Wrapper = docsComponents.wrapper as
			| React.ComponentType<any>
			| undefined;

		// Remove known non-DOM keys to avoid React warnings
		const { components, ...domProps } = props;

		// If no wrapper is provided by nextra-theme-docs, use a simple div
		if (!Wrapper) {
			return (
				<div {...domProps}>
					<MetadataProvider metadata={metadata}>{children}</MetadataProvider>
				</div>
			);
		}

		return (
			<Wrapper {...domProps} metadata={metadata}>
				<MetadataProvider metadata={metadata}>{children}</MetadataProvider>
			</Wrapper>
		);
	},
});
