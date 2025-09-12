import type { BreadcrumbItem, SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class BreadcrumbSchema extends StructuredDataGenerator {
	/**
	 * Generate BreadcrumbList schema
	 */
	breadcrumbs(items: BreadcrumbItem[]): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: items.map((item, index) => ({
				"@type": "ListItem",
				position: item.position || index + 1,
				name: item.name,
				...(item.url && {
					item: this.absoluteUrl(item.url),
				}),
			})),
		};
	}
}
