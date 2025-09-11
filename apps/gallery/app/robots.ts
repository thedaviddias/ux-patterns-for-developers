import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://gallery.uxpatterns.dev";

	return {
		rules: {
			userAgent: "*",
			allow: ["/"],
			disallow: ["/404", "/500", "/api/*"],
		},
		sitemap: [`${baseUrl}/sitemap.xml`],
	};
}
