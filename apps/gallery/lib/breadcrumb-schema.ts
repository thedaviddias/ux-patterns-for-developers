import type { BreadcrumbItem } from "@/lib/url-utils";

const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL || "https://ux-patterns.com/gallery";

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.label,
			item: `${BASE_URL}${item.href}`,
		})),
	};
}
