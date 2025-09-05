import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import { createGenerator, remarkAutoTypeTable } from "fumadocs-typescript";

const generator = createGenerator();

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs: ReturnType<typeof defineDocs> = defineDocs({
	docs: {
		schema: frontmatterSchema,
	},
	meta: {
		schema: metaSchema,
	},
});

// Explicitly type the export to avoid type inference issues
export type Docs = typeof docs;

export default defineConfig({
	mdxOptions: {
		remarkPlugins: [[remarkAutoTypeTable, { generator }]],
	},
});
