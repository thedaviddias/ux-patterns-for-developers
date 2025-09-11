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
	source: docs.toFumadocsSource(),
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

export const blog = loader({
	baseUrl: "/blog",
	source: createMDXSource(blogPosts),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
