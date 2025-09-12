import type { SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class HowToSchema extends StructuredDataGenerator {
	/**
	 * Generate FAQPage schema
	 */
	faq(
		questions: Array<{
			question: string;
			answer: string;
		}>,
	): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: questions.map((q) => ({
				"@type": "Question",
				name: q.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: q.answer,
				},
			})),
		};
	}

	/**
	 * Generate HowTo schema
	 */
	howTo(options: {
		name: string;
		description: string;
		url: string;
		image?: string;
		totalTime?: string;
		estimatedCost?: {
			value: string;
			currency?: string;
		};
		steps: Array<{
			name: string;
			text: string;
			url?: string;
			image?: string;
		}>;
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "HowTo",
			name: options.name,
			description: options.description,
			url: this.absoluteUrl(options.url),
			...(options.image && {
				image: {
					"@type": "ImageObject",
					url: this.absoluteUrl(options.image),
				},
			}),
			...(options.totalTime && { totalTime: options.totalTime }),
			...(options.estimatedCost && {
				estimatedCost: {
					"@type": "MonetaryAmount",
					currency: options.estimatedCost.currency || "USD",
					value: options.estimatedCost.value,
				},
			}),
			step: options.steps.map((step, index) => ({
				"@type": "HowToStep",
				position: index + 1,
				name: step.name,
				text: step.text,
				...(step.url && { url: this.absoluteUrl(step.url) }),
				...(step.image && {
					image: {
						"@type": "ImageObject",
						url: this.absoluteUrl(step.image),
					},
				}),
			})),
			author: {
				"@id": this.config.authorUrl || `${this.config.baseUrl}/about#author`,
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
}
