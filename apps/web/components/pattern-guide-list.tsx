"use client";

import { Card, Cards } from "@/components/mdx";

/**
 * Pattern Guide data
 *
 * This is static data for pattern guides. When adding new pattern guides,
 * update this list. The data is embedded client-side because MDXContent
 * evaluates MDX on the client and cannot use server-only APIs like source.getPages().
 */
const patternGuides = [
	{
		slug: "choosing-input-types",
		title: "Choosing Input Types",
		description:
			"A comprehensive guide to selecting the right input type for your forms.",
	},
	{
		slug: "input-selection-guide",
		title: "Input Selection Guide",
		description:
			"Learn how to choose between different input components based on your use case.",
	},
	{
		slug: "modal-vs-popover-guide",
		title: "Modal vs Popover vs Tooltip",
		description:
			"Choose the right overlay pattern based on attention level and interaction complexity.",
	},
	{
		slug: "pagination-vs-infinite-scroll",
		title: "Pagination vs Infinite Scroll",
		description:
			"Compare pagination and infinite scroll patterns for content loading.",
	},
	{
		slug: "pagination-vs-infinite-scroll-vs-load-more",
		title: "Pagination vs Infinite Scroll vs Load More",
		description:
			"Choose the right content loading pattern for search, feeds, and browse-heavy interfaces.",
	},
	{
		slug: "search-field-vs-command-palette",
		title: "Search Field vs Command Palette",
		description:
			"Decide between visible search and a keyboard-first command surface.",
	},
	{
		slug: "table-vs-list-vs-cards",
		title: "Table vs List vs Cards",
		description: "Choose the right pattern for displaying collections of data.",
	},
];

export function PatternGuideList() {
	return (
		<Cards className="gap-5">
			{patternGuides.map((guide) => (
				<Card
					key={guide.slug}
					title={guide.title}
					href={`/pattern-guide/${guide.slug}`}
					className="rounded-[1.5rem] border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.12),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,249,0.86))] p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,249,0.9))] dark:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_25%),linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.72))]"
				>
					{guide.description}
				</Card>
			))}
		</Cards>
	);
}
