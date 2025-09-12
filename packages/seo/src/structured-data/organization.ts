import type { SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class OrganizationSchema extends StructuredDataGenerator {
	/**
	 * Generate Organization schema
	 */
	organization(
		options: {
			name?: string;
			logo?: string;
			sameAs?: string[];
			founder?: {
				name: string;
				url?: string;
			};
		} = {},
	): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "Organization",
			"@id": `${this.config.baseUrl}/#organization`,
			name: options.name || this.config.organizationName,
			url: this.config.baseUrl,
			...(options.logo || this.config.organizationLogo
				? {
						logo: {
							"@type": "ImageObject",
							url: this.absoluteUrl(
								options.logo || this.config.organizationLogo,
							),
						},
					}
				: {}),
			...(options.sameAs && { sameAs: options.sameAs }),
			...(options.founder && {
				founder: {
					"@type": "Person",
					name: options.founder.name,
					...(options.founder.url && { url: options.founder.url }),
				},
			}),
		};
	}

	/**
	 * Generate WebSite schema
	 */
	website(
		options: {
			name?: string;
			description?: string;
			url?: string;
			inLanguage?: string;
		} = {},
	): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "WebSite",
			"@id": `${this.config.baseUrl}/#website`,
			url: options.url || this.config.baseUrl,
			name: options.name || this.config.organizationName,
			description: options.description,
			publisher: {
				"@id": `${this.config.baseUrl}/#organization`,
			},
			inLanguage: options.inLanguage || "en-US",
		};
	}

	/**
	 * Generate Person schema
	 */
	person(options: {
		name: string;
		url?: string;
		image?: string;
		jobTitle?: string;
		description?: string;
		sameAs?: string[];
		knowsAbout?: string[];
	}): SchemaOrgBase & Record<string, any> {
		const personId = options.url || `${this.config.baseUrl}/about#author`;

		return {
			"@context": "https://schema.org",
			"@type": "Person",
			"@id": personId,
			name: options.name,
			...(options.url && { url: options.url }),
			...(options.image && {
				image: {
					"@type": "ImageObject",
					url: this.absoluteUrl(options.image),
				},
			}),
			...(options.jobTitle && { jobTitle: options.jobTitle }),
			...(options.description && { description: options.description }),
			...(options.sameAs && { sameAs: options.sameAs }),
			...(options.knowsAbout && { knowsAbout: options.knowsAbout }),
		};
	}

	/**
	 * Generate SoftwareApplication schema
	 */
	softwareApplication(options: {
		name: string;
		description?: string;
		applicationCategory?: string;
		operatingSystem?: string;
		offers?: {
			price: string;
			priceCurrency: string;
		};
		screenshot?: string;
		downloadUrl?: string;
		featureList?: string[];
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			name: options.name,
			...(options.description && { description: options.description }),
			...(options.applicationCategory && {
				applicationCategory: options.applicationCategory,
			}),
			...(options.operatingSystem && {
				operatingSystem: options.operatingSystem,
			}),
			...(options.offers && {
				offers: {
					"@type": "Offer",
					price: options.offers.price,
					priceCurrency: options.offers.priceCurrency,
				},
			}),
			...(options.screenshot && {
				screenshot: this.absoluteUrl(options.screenshot),
			}),
			...(options.downloadUrl && { downloadUrl: options.downloadUrl }),
			...(options.featureList && { featureList: options.featureList }),
		};
	}
}
