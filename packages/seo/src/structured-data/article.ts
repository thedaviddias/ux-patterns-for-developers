import type { SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class ArticleSchema extends StructuredDataGenerator {
	/**
	 * Generate Article schema
	 */
	article(options: {
		headline: string;
		description: string;
		url: string;
		image?: string;
		datePublished?: string;
		dateModified?: string;
		author?: {
			name: string;
			url?: string;
		};
		wordCount?: number;
		section?: string;
	}): SchemaOrgBase & Record<string, any> {
		const authorId =
			options.author?.url ||
			this.config.authorUrl ||
			`${this.config.baseUrl}/about#author`;

		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: options.headline,
			description: options.description,
			url: this.absoluteUrl(options.url),
			...(options.image && {
				image: {
					"@type": "ImageObject",
					url: this.absoluteUrl(options.image),
				},
			}),
			...(options.datePublished && { datePublished: options.datePublished }),
			...(options.dateModified && { dateModified: options.dateModified }),
			...(options.section && { articleSection: options.section }),
			...(options.wordCount && { wordCount: options.wordCount }),
			author: {
				"@id": authorId,
				"@type": "Person",
				name: options.author?.name || this.config.authorName || "Author",
				...(options.author?.url && { url: options.author.url }),
			},
			publisher: {
				"@id": `${this.config.baseUrl}/#organization`,
			},
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": this.absoluteUrl(options.url),
			},
			inLanguage: "en-US",
		};
	}

	/**
	 * Generate BlogPosting schema
	 */
	blogPost(options: {
		headline: string;
		description: string;
		url: string;
		image?: string;
		datePublished?: string;
		dateModified?: string;
		author?: {
			name: string;
			url?: string;
		};
		tags?: string[];
		wordCount?: number;
	}): SchemaOrgBase & Record<string, any> {
		const schema = this.article(options);
		schema["@type"] = "BlogPosting";

		if (options.tags && options.tags.length > 0) {
			schema.keywords = options.tags.join(", ");
		}

		return schema;
	}
}
