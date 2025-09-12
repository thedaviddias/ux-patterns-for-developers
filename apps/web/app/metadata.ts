import { MetadataGenerator } from "@ux-patterns/seo/metadata";
import { BASE_URL } from "@/constants/project";

// Create a metadata generator instance
export const metadataGenerator = new MetadataGenerator({
	site: {
		name: "UX Patterns for Developers",
		description:
			"Comprehensive collection of UX patterns, best practices, and implementation guides for developers building accessible, effective, and user-friendly UI components.",
		url: BASE_URL,
		author: "David Dias",
		social: {
			twitter: "@thedaviddias",
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
					url: "/og/opengraph-image.png",
					width: 1200,
					height: 630,
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			creator: "@thedaviddias",
			site: "@thedaviddias",
			images: [
				{
					url: "/og/opengraph-image.png",
					alt: "UX Patterns for Developers - A collection of UX patterns for building effective UI components",
				},
			],
		},
	},
});

// Export base metadata for backward compatibility
export const metadataSEO = metadataGenerator.getBase();

// Add advanced meta tags
metadataSEO.other = {
	"theme-color": "#09090b",
	"color-scheme": "dark light",
	"msapplication-TileColor": "#09090b",
};

// Add additional metadata fields
metadataSEO.keywords = [
	"ux patterns",
	"ui components",
	"user experience",
	"web development",
	"accessibility",
	"design patterns",
	"frontend development",
	"react components",
	"interface design",
	"usability",
	"best practices",
	"developer guide",
	"ui/ux design",
	"component library",
	"design system",
];
metadataSEO.category = "ux";
metadataSEO.appleWebApp = {
	title: "UX Patterns for Developers",
};
