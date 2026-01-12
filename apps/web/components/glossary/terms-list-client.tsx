"use client";

import { docs } from "@/.velite";
import { TermsList } from "./terms-list";
import { useMemo } from "react";

interface GlossaryTerm {
	title: string;
	description: string;
	category: string[];
	slug: string;
	url: string;
}

/**
 * Client-side version of TermsListContainer
 * Uses Velite-generated data that's available at build time
 */
export function TermsListClient() {
	const terms = useMemo<GlossaryTerm[]>(() => {
		// Filter for glossary pages (excluding index)
		const glossaryPages = docs.filter(
			(doc) =>
				doc.slug.startsWith("glossary/") &&
				doc.slug !== "glossary" &&
				doc.slug.split("/").length > 1
		);

		return glossaryPages.map((page) => {
			const slugParts = page.slug.split("/");
			return {
				title: page.title || slugParts[slugParts.length - 1],
				description: page.description || "",
				category: Array.isArray((page as any).category)
					? (page as any).category
					: [],
				slug: slugParts[slugParts.length - 1],
				url: page.url,
			};
		});
	}, []);

	if (!terms || terms.length === 0) {
		return <p>No glossary terms found.</p>;
	}

	return <TermsList terms={terms} />;
}
