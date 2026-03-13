/**
 * MDX Compilation Utilities
 *
 * Uses next-mdx-remote to compile MDX content on the server.
 * This replaces the runtime AsyncFunction evaluation approach.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import rehypeShiki from "@shikijs/rehype";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
	edges as dataDisplayEdges,
	nodes as dataDisplayNodes,
} from "@/components/decision-flow/data/data-display-patterns";
import {
	edges as inputTypeEdges,
	nodes as inputTypeNodes,
} from "@/components/decision-flow/data/input-types";
import {
	edges as loadingPatternEdges,
	nodes as loadingPatternNodes,
} from "@/components/decision-flow/data/loading-patterns";
import {
	edges as navigationEdges,
	nodes as navigationNodes,
} from "@/components/decision-flow/data/navigation-patterns";
// Decision flow data imports for MDX scope
import {
	edges as overlayEdges,
	nodes as overlayNodes,
} from "@/components/decision-flow/data/overlay-patterns";
import {
	edges as searchVsCommandEdges,
	nodes as searchVsCommandNodes,
} from "@/components/decision-flow/data/search-vs-command-palette";

// Pattern guide data imports for MDX scope
import {
	inputTypesComparisonData,
	inputTypesExamplesData,
	inputTypesImplementationData,
	loadingPatternsComparisonData,
	modalComparisonData,
	paginationComparisonData,
	paginationExamplesData,
	paginationPerformanceData,
	searchVsCommandComparisonData,
	tableComparisonData,
} from "@/lib/pattern-guide-data";

// Scope data to make available to MDX files
const mdxScope = {
	// Decision flow nodes/edges
	overlayNodes,
	overlayEdges,
	dataDisplayNodes,
	dataDisplayEdges,
	inputTypeNodes,
	inputTypeEdges,
	navigationNodes,
	navigationEdges,
	loadingPatternNodes,
	loadingPatternEdges,
	searchVsCommandNodes,
	searchVsCommandEdges,
	// Pattern guide data
	inputTypesComparisonData,
	inputTypesImplementationData,
	inputTypesExamplesData,
	loadingPatternsComparisonData,
	paginationComparisonData,
	paginationPerformanceData,
	paginationExamplesData,
	modalComparisonData,
	searchVsCommandComparisonData,
	tableComparisonData,
};

// Content directory path
const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Read and compile an MDX file from the content directory
 *
 * @param slug - The content slug (e.g., "patterns/forms/button")
 * @param components - MDX components to use during compilation
 * @returns Compiled MDX content and frontmatter
 */
export async function compileMDXContent<
	TFrontmatter extends Record<string, unknown>,
>(
	slug: string,
	components: MDXComponents = {},
	options?: {
		sourceTransform?: (source: string) => string;
	},
): Promise<{
	content: React.ReactElement;
	frontmatter: TFrontmatter;
}> {
	// Construct file path - try both direct path and index.mdx
	let filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

	try {
		await readFile(filePath, "utf-8");
	} catch {
		// Try index.mdx for folder-based content
		filePath = path.join(CONTENT_DIR, slug, "index.mdx");
	}

	// Read the raw MDX file
	const rawSource = await readFile(filePath, "utf-8");
	const source = options?.sourceTransform
		? options.sourceTransform(rawSource)
		: rawSource;

	// Compile with next-mdx-remote
	const { content, frontmatter } = await compileMDX<TFrontmatter>({
		source,
		components,
		options: {
			parseFrontmatter: true,
			scope: mdxScope,
			// Local MDX content relies on scoped expressions like data.prop.
			blockJS: false,
			blockDangerousJS: true,
			mdxOptions: {
				remarkPlugins: [remarkGfm, remarkMdxMermaid],
				rehypePlugins: [
					rehypeSlug,
					// Note: rehypeAutolinkHeadings disabled - causes nested <a> errors
					[
						rehypeShiki,
						{
							themes: {
								light: "github-light",
								dark: "github-dark",
							},
							addLanguageClass: true,
							transformers: [
								{
									name: "add-data-language",
									pre(this: { options: { lang?: string } }, node: any) {
										// Add data-language attribute from the lang
										if (this.options.lang) {
											node.properties["data-language"] = this.options.lang;
										}
									},
								},
							],
						},
					],
				],
			},
		},
	});

	return { content, frontmatter };
}

/**
 * Compile MDX from a raw string (for inline content)
 */
export async function compileMDXString<
	TFrontmatter extends Record<string, unknown>,
>(
	source: string,
	components: MDXComponents = {},
): Promise<{
	content: React.ReactElement;
	frontmatter: TFrontmatter;
}> {
	const { content, frontmatter } = await compileMDX<TFrontmatter>({
		source,
		components,
		options: {
			parseFrontmatter: true,
			blockJS: false,
			blockDangerousJS: true,
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [
					rehypeSlug,
					// Note: rehypeAutolinkHeadings disabled - causes nested <a> errors
					[
						rehypeShiki,
						{
							themes: {
								light: "github-light",
								dark: "github-dark",
							},
							addLanguageClass: true,
							transformers: [
								{
									name: "add-data-language",
									pre(this: { options: { lang?: string } }, node: any) {
										// Add data-language attribute from the lang
										if (this.options.lang) {
											node.properties["data-language"] = this.options.lang;
										}
									},
								},
							],
						},
					],
				],
			},
		},
	});

	return { content, frontmatter };
}
