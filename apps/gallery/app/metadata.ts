import { AUTHOR, PROJECT } from "@ux-patterns/constants/author";
import { MetadataGenerator } from "@ux-patterns/seo/metadata";

const GALLERY_BASE_URL = PROJECT.urls.gallery;

// Create a metadata generator instance
export const metadataGenerator = new MetadataGenerator({
	site: {
		name: "UX Patterns Gallery",
		description:
			"Visual examples of UX patterns - do and don't implementations from real websites",
		url: GALLERY_BASE_URL,
		author: AUTHOR.name,
		social: {
			twitter: AUTHOR.social.twitter,
		},
	},
	defaults: {
		robots: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
			googleBot: "index, follow",
		},
		openGraph: {
			type: "website",
			locale: "en_US",
			images: [
				{
					url: "/og-image.png",
					width: 1200,
					height: 630,
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			creator: AUTHOR.social.twitter,
			site: AUTHOR.social.twitter,
			images: [
				{
					url: "/og-image.png",
					alt: "UX Patterns Gallery - Visual examples of do and don't UX patterns from real websites",
				},
			],
		},
	},
});

// Export base metadata for backward compatibility
export const metadataSEO = metadataGenerator.getBase();

// Add additional metadata fields
metadataSEO.keywords = [
	"UX patterns",
	"UI design",
	"user experience",
	"educational",
	"design examples",
	"good UX",
	"bad UX",
	"pattern gallery",
	"design patterns",
	"UX examples",
];
metadataSEO.category = "design";
metadataSEO.appleWebApp = {
	title: "UX Patterns Gallery",
};
metadataSEO.other = {
	"msapplication-TileColor": "#fff",
};
