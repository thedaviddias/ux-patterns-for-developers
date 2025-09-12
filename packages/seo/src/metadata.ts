import type { Metadata } from "next";
import type {
	BaseMetadataConfig,
	MetadataGeneratorConfig,
	OpenGraphConfig,
	PageMetadataConfig,
	RobotsMetaConfig,
	TwitterConfig,
} from "./types";

/**
 * Creates base metadata configuration for Next.js apps
 */
export function createBaseMetadata(config: BaseMetadataConfig): Metadata {
	const {
		title,
		description,
		keywords,
		creator,
		baseUrl,
		locale = "en_US",
		category,
	} = config;

	return {
		title: {
			template: `%s | ${title}`,
			default: title || "",
		},
		description,
		keywords,
		creator,
		metadataBase: new URL(baseUrl),
		category,
		robots: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
			googleBot: "index, follow",
		},
		openGraph: {
			siteName: title,
			type: "website",
			locale,
			title: title || "",
			description: description || "",
			url: baseUrl,
		},
		twitter: {
			card: "summary_large_image",
			creator,
		},
	};
}

/**
 * Merges page-specific metadata with base metadata
 */
export function mergeMetadata(
	base: Metadata,
	page: Partial<Metadata>,
): Metadata {
	return {
		...base,
		...page,
		openGraph: {
			...(base.openGraph || {}),
			...(page.openGraph || {}),
		},
		twitter: {
			...(base.twitter || {}),
			...(page.twitter || {}),
		},
		robots: Object.assign(
			{},
			base.robots || {},
			page.robots || {},
		) as Metadata["robots"],
	};
}

/**
 * Generates metadata for a specific page
 */
export function generatePageMetadata(
	base: Metadata,
	config: PageMetadataConfig,
): Metadata {
	const {
		title,
		description,
		path = "",
		image,
		keywords,
		publishedTime,
		modifiedTime,
		authors,
		section,
		tags,
	} = config;
	const baseUrl = base.metadataBase?.toString() || "";
	const fullUrl = path
		? `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
		: baseUrl;

	const metadata: Metadata = {
		title,
		description,
		keywords: keywords || base.keywords,
		authors: authors?.map((name) => ({ name })),
	};

	if (base.openGraph) {
		metadata.openGraph = {
			...base.openGraph,
			title,
			description,
			url: fullUrl,
			...(image && {
				images: [
					{
						url: image.startsWith("http")
							? image
							: `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`,
						width: 1200,
						height: 630,
					},
				],
			}),
			...(publishedTime && { publishedTime }),
			...(modifiedTime && { modifiedTime }),
			...(section && { section }),
			...(tags && { tags }),
		};
	}

	if (base.twitter) {
		metadata.twitter = {
			...base.twitter,
			title,
			description,
			...(image && {
				images: [
					{
						url: image.startsWith("http")
							? image
							: `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`,
						alt: title,
					},
				],
			}),
		};
	}

	return mergeMetadata(base, metadata);
}

/**
 * Creates a metadata generator with default configuration
 */
export class MetadataGenerator {
	private baseMetadata: Metadata;
	private config: MetadataGeneratorConfig;

	constructor(config: MetadataGeneratorConfig) {
		this.config = config;
		this.baseMetadata = this.createBase();
	}

	private createBase(): Metadata {
		const { site, defaults } = this.config;

		const base: Metadata = {
			title: {
				template: `%s | ${site.name}`,
				default: site.name,
			},
			description: site.description,
			metadataBase: new URL(site.url),
			creator: site.author,
			robots: defaults?.robots || {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
				googleBot: "index, follow",
			},
			openGraph: {
				siteName: site.name,
				type: "website",
				locale: defaults?.openGraph?.locale || "en_US",
				title: site.name,
				description: site.description,
				url: site.url,
				...defaults?.openGraph,
			},
			twitter: {
				card: defaults?.twitter?.card || "summary_large_image",
				site: site.social?.twitter,
				creator: site.social?.twitter,
				...defaults?.twitter,
			},
		};

		return base;
	}

	/**
	 * Get the base metadata
	 */
	getBase(): Metadata {
		return this.baseMetadata;
	}

	/**
	 * Generate metadata for a page
	 */
	generate(config: PageMetadataConfig): Metadata {
		return generatePageMetadata(this.baseMetadata, config);
	}

	/**
	 * Generate metadata for an article/blog post
	 */
	generateArticle(
		config: PageMetadataConfig & {
			type?: "article" | "blog";
			authors?: string[];
			tags?: string[];
		},
	): Metadata {
		const metadata = this.generate(config);

		if (metadata.openGraph) {
			// Note: Next.js OpenGraph type is limited to specific values
			// Additional article-specific data should be handled via structured data
		}

		return metadata;
	}

	/**
	 * Generate metadata for a product page
	 */
	generateProduct(
		config: PageMetadataConfig & {
			price?: number;
			currency?: string;
			availability?: string;
		},
	): Metadata {
		const metadata = this.generate(config);

		// Product-specific OpenGraph data should be handled via structured data
		// Next.js OpenGraph type is limited to specific values

		return metadata;
	}
}

/**
 * Helper to create consistent robots configuration
 */
export function createRobotsConfig(
	config: Partial<RobotsMetaConfig> = {},
): RobotsMetaConfig {
	return {
		index: config.index ?? true,
		follow: config.follow ?? true,
		"max-image-preview": config["max-image-preview"] ?? "large",
		"max-snippet": config["max-snippet"] ?? -1,
		"max-video-preview": config["max-video-preview"] ?? -1,
		googleBot: config.googleBot ?? "index, follow",
	};
}

/**
 * Helper to create OpenGraph configuration
 */
export function createOpenGraphConfig(
	config: OpenGraphConfig & { baseUrl: string },
): NonNullable<Metadata["openGraph"]> {
	const { baseUrl, url, images, ...rest } = config;

	return {
		...rest,
		url: url || baseUrl,
		images: images?.map((img) => ({
			...img,
			url: img.url.startsWith("http")
				? img.url
				: `${baseUrl}${img.url.startsWith("/") ? img.url : `/${img.url}`}`,
		})),
	};
}

/**
 * Helper to create Twitter configuration
 */
export function createTwitterConfig(
	config: TwitterConfig & { baseUrl?: string },
): NonNullable<Metadata["twitter"]> {
	const { baseUrl = "", images, ...rest } = config;

	return {
		...rest,
		images: images?.map((img) => ({
			...img,
			url: img.url.startsWith("http")
				? img.url
				: `${baseUrl}${img.url.startsWith("/") ? img.url : `/${img.url}`}`,
		})),
	};
}
