export interface BaseMetadataConfig {
	title?: string;
	description?: string;
	keywords?: string[];
	creator?: string;
	baseUrl: string;
	locale?: string;
	category?: string;
}

export interface OpenGraphConfig {
	title?: string;
	description?: string;
	url?: string;
	siteName?: string;
	images?: Array<{
		url: string;
		width?: number;
		height?: number;
		alt?: string;
		type?: string;
	}>;
	type?: "website" | "article" | "blog" | "product";
	locale?: string;
}

export interface TwitterConfig {
	card?: "summary" | "summary_large_image" | "app" | "player";
	site?: string;
	creator?: string;
	images?: Array<{
		url: string;
		alt?: string;
	}>;
}

export interface RobotsMetaConfig {
	index?: boolean;
	follow?: boolean;
	"max-image-preview"?: "none" | "standard" | "large";
	"max-snippet"?: number;
	"max-video-preview"?: number;
	googleBot?: string;
}

export interface SiteConfig {
	name: string;
	description: string;
	url: string;
	author?: string;
	authorUrl?: string;
	authorPosition?: string;
	authorDescription?: string;
	authorSameAs?: string[];
	logo?: {
		url: string;
		width?: number;
		height?: number;
	};
	social?: {
		twitter?: string;
		github?: string;
		reddit?: string;
	};
}

export interface MetadataGeneratorConfig {
	site: SiteConfig;
	defaults?: {
		robots?: RobotsMetaConfig;
		openGraph?: Partial<OpenGraphConfig>;
		twitter?: Partial<TwitterConfig>;
	};
}

export interface PageMetadataConfig {
	title: string;
	description: string;
	path?: string;
	image?: string;
	keywords?: string[];
	publishedTime?: string;
	modifiedTime?: string;
	authors?: string[];
	section?: string;
	tags?: string[];
}

export interface StructuredDataConfig {
	baseUrl: string;
	organizationName: string;
	organizationLogo?: string;
	authorName?: string;
	authorUrl?: string;
}

export interface BreadcrumbItem {
	name: string;
	url?: string;
	position?: number;
}

export interface SitemapEntry {
	url: string;
	lastModified?: Date | string;
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
}

export interface RobotsRule {
	userAgent: string | string[];
	allow?: string | string[];
	disallow?: string | string[];
	crawlDelay?: number;
}

export interface RobotsConfig {
	rules: RobotsRule | RobotsRule[];
	sitemap?: string | string[];
	host?: string;
}

export type SchemaType =
	| "WebSite"
	| "Organization"
	| "Person"
	| "Article"
	| "BlogPosting"
	| "HowTo"
	| "ItemList"
	| "CollectionPage"
	| "SoftwareSourceCode"
	| "Course"
	| "BreadcrumbList"
	| "FAQPage"
	| "Product"
	| "Review";

export interface SchemaOrgBase {
	"@context": "https://schema.org";
	"@type": SchemaType | SchemaType[];
	"@id"?: string;
}
