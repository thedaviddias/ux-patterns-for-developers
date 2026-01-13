import {
	type InferMetaType,
	type InferPageType,
	loader,
} from "fumadocs-core/source";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { createElement } from "react";
import { docs } from "@/.source/server";

// Get the raw source and filter out drafts
const rawSource = docs.toFumadocsSource();

// Filter source files to exclude drafts from navigation
const filteredSource = {
	...rawSource,
	files: rawSource.files.filter((file) => {
		const data = file.data as {
			status?: "draft" | "published" | "complete" | "coming-soon";
			hideFromNav?: boolean;
		} | undefined;
		// Only hide items that are explicitly drafts/coming-soon or have hideFromNav: true
		// Show everything else by default (including blog posts without status)
		if (data?.hideFromNav === true) return false;
		if (data?.status === "draft" || data?.status === "coming-soon") return false;
		return true;
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
