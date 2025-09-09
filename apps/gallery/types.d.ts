// Type declarations for fumadocs-mdx generated files

declare module "@/.source" {
	import type { Source } from "fumadocs-core/source";

	// Extended page data that includes MDX compilation output
	interface MDXPageData {
		title: string;
		description?: string;
		icon?: string;
		full?: boolean;
		body: React.ComponentType<{ components?: any }>;
		toc: Array<{
			depth: number;
			url: string;
			title: string;
		}>;
		structuredData?: any;
		[key: string]: any;
	}

	interface GeneratedDocs {
		toFumadocsSource(): Source<{
			pageData: MDXPageData;
			metaData: any;
		}>;
	}

	export const docs: GeneratedDocs;
	export const entries: GeneratedDocs;
	export const pages: GeneratedDocs;
}

declare module "./.source/index" {
	export * from "@/.source";
}

declare module "../source.config" {
	export * from "@/.source";
}

declare module "/Users/thedaviddias/Projects/ux-patterns-for-developers/apps/gallery/.source/index" {
	export * from "@/.source";
}

declare module "/Users/thedaviddias/Projects/ux-patterns-for-developers/apps/gallery/source.config" {
	export * from "@/.source";
}
