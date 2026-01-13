import { shouldShowInNav } from "@ux-patterns/ui/utils/pattern-status";
import {
	type InferMetaType,
	type InferPageType,
	loader,
} from "fumadocs-core/source";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { createElement } from "react";
import { blog as blogPosts, docs } from "@/.source/server";

// Get the raw source and filter out drafts
const rawSource = docs.toFumadocsSource();

// Filter source files to exclude drafts from navigation
const filteredSource = {
	...rawSource,
	files: rawSource.files.filter((file) => {
		// Check if the file data has a draft status
		const data = file.data as { status?: string } | undefined;
		// Pass object matching PatternMetadata interface
		return shouldShowInNav({ status: data?.status as "draft" | "published" | "complete" | undefined });
	}),
};

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/",
	source: filteredSource,
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
});

// TODO: Fix blog loader for v16 - blog posts collection doesn't have toFumadocsSource
// export const blog = loader({
// 	baseUrl: "/blog",
// 	source: blogPosts as any, // Blog posts collection
// });

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
