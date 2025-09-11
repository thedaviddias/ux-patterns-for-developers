import type { Metadata } from "next";

const GALLERY_BASE_URL = "https://gallery.uxpatterns.dev";

export const metadataSEO: Metadata = {
	title: {
		template: "%s | UX Patterns Gallery",
		default: "UX Patterns Gallery",
	},
	description:
		"Visual examples of UX patterns - good and bad implementations from real websites for educational purposes",
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
		googleBot: "index, follow",
	},
	keywords: [
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
	],
	creator: "David Dias",
	metadataBase: new URL(GALLERY_BASE_URL),
	category: "design",
	openGraph: {
		siteName: "UX Patterns Gallery",
		type: "website",
		locale: "en_US",
		title: "UX Patterns Gallery",
		description:
			"Visual examples of UX patterns - good and bad implementations from real websites for educational purposes",
		url: GALLERY_BASE_URL,
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
		creator: "@thedaviddias",
		site: "@thedaviddias",
		images: [
			{
				url: "/og-image.png",
				alt: "UX Patterns Gallery - Visual examples of good and bad UX patterns from real websites",
			},
		],
	},
	appleWebApp: {
		title: "UX Patterns Gallery",
	},
	other: {
		"msapplication-TileColor": "#fff",
	},
};
