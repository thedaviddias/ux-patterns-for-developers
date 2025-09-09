import { BASE_URL } from "@/constants/project";

interface BreadcrumbItem {
	name: string;
	url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${BASE_URL}${item.url}`,
		})),
	};
}
