import type { Metadata } from "next";

export const metadataSEO: Metadata = {
	title: {
		absolute: "UP Kit",
		template: "%s | UX Patterns Kit",
	},
	description:
		"UP Kit is a React component library that provides a set of reusable components for building web applications with great UX patterns.",
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
		googleBot: "index, follow",
	},
	keywords: [
		"react",
		"components",
		"ui",
		"ux patterns",
		"component library",
		"typescript",
		"tailwind",
		"shadcn",
	],
	creator: "David Dias",
	metadataBase: new URL("https://kit.uxpatterns.dev"),
	category: "development",
	openGraph: {
		siteName: "UX Patterns Kit",
		type: "website",
		locale: "en_US",
		title: "UP Kit",
		description:
			"UP Kit is a React component library that provides a set of reusable components for building web applications with great UX patterns.",
		url: "https://kit.uxpatterns.dev",
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
				alt: "UP Kit - A React component library for building great UX patterns",
			},
		],
	},
	appleWebApp: {
		title: "UP Kit",
	},
	other: {
		"msapplication-TileColor": "#fff",
	},
};
