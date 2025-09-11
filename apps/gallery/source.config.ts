import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
	docs: {
		schema: frontmatterSchema,
	},
	meta: {
		schema: metaSchema,
	},
});

// Extended schema for gallery entries
const entrySchema = frontmatterSchema.extend({
	id: z.string(),
	pattern: z.string(),
	platform: z.enum(["web", "mobile"]),
	type: z.enum(["do", "dont"]),
	website: z.string(),
	media: z.object({
		type: z.enum(["image", "video"]),
		src: z.string(),
	}),
	tags: z.array(z.string()).optional(),
	source: z
		.object({
			url: z.string().optional(),
			capturedAt: z.string().optional(),
		})
		.optional(),
});

export const entries = defineDocs({
	dir: "content/entries",
	docs: {
		schema: entrySchema,
	},
});

export const pages = defineDocs({
	dir: "content/pages",
	docs: {
		schema: frontmatterSchema,
	},
});

export default defineConfig({
	mdxOptions: {
		// MDX options
	},
});
