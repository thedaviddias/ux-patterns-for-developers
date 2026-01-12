import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs: ReturnType<typeof defineDocs> = defineDocs({
	docs: {
		schema: frontmatterSchema.extend({
			date: z.string().optional(),
			tags: z.array(z.string()).optional(),
			version: z.string().optional(),
		}),
	},
	meta: {
		schema: metaSchema,
	},
});

// Explicitly type the export to avoid type inference issues
export type Docs = typeof docs;

export default defineConfig({
	lastModifiedTime: "git",
	mdxOptions: {
		remarkPlugins: [],
		providerImportSource: "@/mdx-components",
	},
});
