import { shouldShowInNav } from "@ux-patterns/ui/utils/pattern-status";
import {
	type InferMetaType,
	type InferPageType,
	loader,
} from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { createElement } from "react";
import { blog as blogPosts, docs } from "@/.source";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/",
	source: docs.toFumadocsSource({
		filter: (page) => {
			// Filter out draft pages from source
			return page.data.status !== "draft";
		},
	}),
	icon: (name: string | undefined) => {
		if (!name) return null;
		// Convert icon name to Lucide React component
		const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[
			name
		];
		return IconComponent
			? createElement(IconComponent, { className: "h-4 w-4" })
			: null;
	},
	pageTree: {
		transformers: [
			{
				file(node, file) {
					// Filter out draft pages from navigation tree
					if (file && this.storage.read(file)) {
						const page = this.storage.read(file);
						if (page?.data?.status === "draft") {
							return null; // Remove from tree
						}
					}
					return node;
				},
			},
		],
	},
});

export const blog = loader({
	baseUrl: "/blog",
	source: createMDXSource(blogPosts),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
