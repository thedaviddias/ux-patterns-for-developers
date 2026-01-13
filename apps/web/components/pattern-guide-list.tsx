"use client";

import { Cards, Card } from "@/components/mdx";

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
		title: "Modal vs Popover Guide",
		description:
			"When to use modals versus popovers for overlay content.",
	},
	{
		slug: "pagination-vs-infinite-scroll",
		title: "Pagination vs Infinite Scroll",
		description:
			"Compare pagination and infinite scroll patterns for content loading.",
	},
	{
		slug: "table-vs-list-vs-cards",
		title: "Table vs List vs Cards",
		description:
			"Choose the right pattern for displaying collections of data.",
	},
];

export function PatternGuideList() {
	return (
		<Cards>
			{patternGuides.map((guide) => (
				<Card
					key={guide.slug}
					title={guide.title}
					href={`/pattern-guide/${guide.slug}`}
				>
					{guide.description}
				</Card>
			))}
		</Cards>
	);
}
