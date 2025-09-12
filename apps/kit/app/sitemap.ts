import { SitemapBuilder } from "@ux-patterns/seo/sitemap";

export default function sitemap() {
	const builder = new SitemapBuilder("https://kit.uxpatterns.dev");

	// Add static pages
	builder.addStaticPages([
		"", // Homepage
		"changelog",
	]);

	return builder.build();
}
