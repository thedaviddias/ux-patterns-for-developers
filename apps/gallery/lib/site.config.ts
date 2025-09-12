import { PROJECT } from "@ux-patterns/constants/author";

export const siteConfig = {
	name: "UX Patterns Gallery",
	description:
		"Browse 1000+ real UX patterns from top sites. See how Netflix, Spotify & others solve design challenges. Filter by quality & platform.",
	url: PROJECT.urls.gallery,
	ogImage: "/og/opengraph-image.png",
	logo: "/logo.png",

	// SEO metadata
	keywords: [
		"ux patterns gallery",
		"ui examples",
		"design inspiration",
		"real world ui patterns",
		"website examples",
		"ui showcase",
		"design gallery",
		"pattern examples",
		"interface gallery",
		"web design examples",
		"mobile ui examples",
		"desktop ui patterns",
		"ui pattern collection",
		"design reference",
		"pattern implementation examples",
	],

	// Page-specific metadata
	pages: {
		home: {
			title: "Real-World UI Examples",
			description:
				"Browse 1000+ real UX patterns from top sites. See how Netflix, Spotify & others solve design challenges. Find your inspiration.",
		},
		search: {
			title: "Search Patterns",
			description:
				"Find the perfect UX pattern example. Search by platform, quality, or pattern type from our curated collection.",
		},
		privacyPolicy: {
			title: "Privacy Policy",
			description:
				"Your privacy matters. Learn how we handle data and protect your information at UX Patterns Gallery.",
		},
		disclaimer: {
			title: "Disclaimer",
			description:
				"Usage guidelines and legal information for UX Patterns Gallery. Understand our terms before browsing.",
		},
	},

	links: {
		github: PROJECT.repository.url,
		mainSite: PROJECT.urls.main,
	},

	// Advanced meta tags
	other: {
		"theme-color": "#09090b",
		"color-scheme": "dark light",
		"msapplication-TileColor": "#09090b",
	},
};
