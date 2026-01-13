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

// Decision flow data imports for MDX scope
import {
	nodes as overlayNodes,
	edges as overlayEdges,
} from "@/components/decision-flow/data/overlay-patterns";
import {
	nodes as dataDisplayNodes,
	edges as dataDisplayEdges,
} from "@/components/decision-flow/data/data-display-patterns";
import {
	nodes as inputTypeNodes,
	edges as inputTypeEdges,
} from "@/components/decision-flow/data/input-types";
import {
	nodes as navigationNodes,
	edges as navigationEdges,
} from "@/components/decision-flow/data/navigation-patterns";

// Pattern guide data imports for MDX scope
import {
	inputTypesComparisonData,
	inputTypesImplementationData,
	inputTypesExamplesData,
	paginationComparisonData,
	paginationPerformanceData,
	paginationExamplesData,
	modalComparisonData,
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
	// Pattern guide data
	inputTypesComparisonData,
	inputTypesImplementationData,
	inputTypesExamplesData,
	paginationComparisonData,
	paginationPerformanceData,
	paginationExamplesData,
	modalComparisonData,
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
	const source = await readFile(filePath, "utf-8");

	// Compile with next-mdx-remote
	const { content, frontmatter } = await compileMDX<TFrontmatter>({
		source,
		components,
		options: {
			parseFrontmatter: true,
			scope: mdxScope,
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
