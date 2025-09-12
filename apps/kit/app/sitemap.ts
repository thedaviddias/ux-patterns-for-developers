import { SitemapBuilder } from "@ux-patterns/seo/sitemap";
import { source } from "@/lib/source";

export default function sitemap() {
	const builder = new SitemapBuilder("https://kit.uxpatterns.dev");

	// Add static pages
	builder.addStaticPages([
		"", // Homepage
		"changelog",
	]);

	// Add all documentation pages
	const docPages = source.getPages();
	const docUrls = docPages.map((page) => page.url.substring(1)); // Remove leading slash
	builder.addStaticPages(docUrls);

	return builder.build();
}
