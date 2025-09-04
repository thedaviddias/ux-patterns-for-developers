import { Pre, withIcons } from "nextra/components";
import { GitHubIcon } from "nextra/icons";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import {
	ComponentPreviewWithMetadata,
	MetadataProvider,
} from "./app/_components/component-preview-wrapper";
import { LinkCustom } from "./app/_components/link-custom";

const docsComponents = getDocsMDXComponents({
	pre: withIcons(Pre, { js: GitHubIcon }),
});

export const useMDXComponents = (components: Record<string, unknown>) => ({
	...docsComponents,
	...components,
	a: LinkCustom,
	ComponentPreview: ComponentPreviewWithMetadata,
	wrapper: ({ children, metadata, ...props }: any) => {
		const Wrapper = docsComponents.wrapper;
		return (
			<Wrapper {...props} metadata={metadata}>
				<MetadataProvider metadata={metadata}>{children}</MetadataProvider>
			</Wrapper>
		);
	},
});
