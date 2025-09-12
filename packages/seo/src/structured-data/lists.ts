import type { SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class ListSchema extends StructuredDataGenerator {
	/**
	 * Generate ItemList schema
	 */
	itemList(options: {
		name: string;
		description?: string;
		url?: string;
		items: Array<{
			name: string;
			url?: string;
			description?: string;
			position?: number;
		}>;
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: options.name,
			...(options.description && { description: options.description }),
			...(options.url && { url: this.absoluteUrl(options.url) }),
			numberOfItems: options.items.length,
			itemListElement: options.items.map((item, index) => ({
				"@type": "ListItem",
				position: item.position || index + 1,
				item: {
					"@type": "Thing",
					name: item.name,
					...(item.url && { url: this.absoluteUrl(item.url) }),
					...(item.description && { description: item.description }),
				},
			})),
		};
	}

	/**
	 * Generate CollectionPage schema
	 */
	collectionPage(options: {
		name: string;
		description: string;
		url: string;
		hasPart: Array<{
			name: string;
			url: string;
			datePublished?: string;
			description?: string;
		}>;
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: options.name,
			description: options.description,
			url: this.absoluteUrl(options.url),
			inLanguage: "en-US",
			hasPart: options.hasPart.map((item) => ({
				"@type": "CreativeWork",
				headline: item.name,
				url: this.absoluteUrl(item.url),
				...(item.datePublished && { datePublished: item.datePublished }),
				...(item.description && { description: item.description }),
			})),
		};
	}
}
