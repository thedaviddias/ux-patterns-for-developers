import { MetadataGenerator } from "@ux-patterns/seo/metadata";
import { BASE_URL } from "@/constants/project";

// Create a metadata generator instance
export const metadataGenerator = new MetadataGenerator({
	site: {
		name: "UX Patterns for Devs",
		description:
			"UX Patterns for Developers is a collection of UX Patterns for Devs to use in their projects.",
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

// Add additional metadata fields
metadataSEO.keywords = [
	"ux",
	"ux patterns",
	"ux for devs",
	"ux design",
	"ux design patterns",
];
metadataSEO.category = "ux";
metadataSEO.appleWebApp = {
	title: "UX Patterns for Devs",
};
metadataSEO.other = {
	"msapplication-TileColor": "#fff",
};
