import { siteConfig } from "@/lib/site.config";

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
			item: `${siteConfig.url}${item.url}`,
		})),
	};
}
