import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import { createGenerator, remarkAutoTypeTable } from "fumadocs-typescript";
import { z } from "zod";

const generator = createGenerator({
	cache: false, // Disable caching to avoid ENOENT errors in CI
});

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
		remarkPlugins: [[remarkAutoTypeTable, { generator }]],
		providerImportSource: "@/mdx-components",
	},
});
