import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		InstallTabs: ({
			children,
			items,
		}: {
			items: string[];
			children: ReactNode;
		}) => (
			<Tabs items={items} id="package-manager" className="cursor-pointer">
				{children}
			</Tabs>
		),
		Tab,
		Tabs,
		...components,
	};
}
