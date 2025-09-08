import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ux-patterns/ui/components/shadcn/accordion";
import { cn } from "@ux-patterns/ui/lib/utils";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		Tab,
		Tabs,
		TypeTable,
		Video: ({ className, ...props }: React.ComponentProps<"video">) => (
			<video
				className={cn("rounded-md border", className)}
				controls
				loop
				{...props}
			/>
		),
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent,
		...components,
	};
}

// Export useMDXComponents for the providerImportSource
export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return getMDXComponents(components);
}
