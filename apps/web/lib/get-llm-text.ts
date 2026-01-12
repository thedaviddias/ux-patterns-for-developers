import fs from "node:fs/promises";
import { remarkNpm } from "fumadocs-core/mdx-plugins";
import { remarkInclude } from "fumadocs-mdx/config";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import type { source } from "@/lib/source";

const processor = remark()
	.use(remarkMdx)
	.use(remarkInclude)
	.use(remarkGfm)
	.use(remarkAutoTypeTable)
	.use(remarkNpm);

export async function getLLMText(
	page: NonNullable<ReturnType<typeof source.getPage>>,
) {
	const categoryMap = {
		patterns: "UX Patterns for Devs",
		"pattern-guide": "UX Patterns for Devs",
		glossary: "UX Patterns for Devs",
	} as const;

	const category =
		categoryMap[page.slugs[0] as keyof typeof categoryMap] ?? page.slugs[0];

	if (!page.absolutePath) {
		throw new Error(`No absolute path for page: ${page.url}`);
	}

	const processed = await processor.process({
		path: page.absolutePath,
		value: await fs.readFile(page.absolutePath),
	});

	return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/thedaviddias/ux-patterns-for-developers/refs/heads/main/apps/web/content/${page.path}

${page.data.description}

${processed.value}`;
}
