import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import {
	defineCollections,
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
	dir: "./content",
	docs: {
		schema: frontmatterSchema.extend({
			title: z.string().optional(),
			description: z.string().optional(),
			summary: z.string().optional(),
			status: z.string().optional(),
			icon: z.string().optional(),
			date: z.union([z.string(), z.date()]).optional(),
			datePublished: z.union([z.string(), z.date()]).optional(),
			dateModified: z.union([z.string(), z.date()]).optional(),
			lastModified: z.union([z.string(), z.date()]).optional(),
			author: z.string().optional(),
			image: z.string().optional(),
			tags: z.array(z.string()).optional(),
			keywords: z.array(z.string()).optional(),
			category: z.array(z.string()).optional(),
			wordCount: z.number().optional(),
			hideFromNav: z.boolean().optional(),
			publishedAt: z.union([z.string(), z.date()]).optional(),
			lastMajorUpdate: z.union([z.string(), z.date()]).optional(),
			steps: z
				.array(
					z.object({
						name: z.string(),
						text: z.string(),
						url: z.string().optional(),
						image: z.string().optional(),
					}),
				)
				.optional(),
			totalTime: z.string().optional(),
			educationalLevel: z.string().optional(),
			timeRequired: z.string().optional(),
			prerequisites: z.array(z.string()).optional(),
			featured: z.boolean().optional().default(false),
			readTime: z.string().optional(),
			thumbnail: z.string().optional(),
		}),
	},
	meta: {
		schema: metaSchema.extend({
			title: z.string(),
			pages: z.array(z.string()),
		}),
	},
});

export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: frontmatterSchema.extend({
		author: z.string(),
		date: z.string().date().or(z.date()),
	}),
});

export default defineConfig({
	lastModifiedTime: "git",
	mdxOptions: {
		remarkPlugins: [remarkMdxMermaid],
		providerImportSource: "@/mdx-components",
	},
});
