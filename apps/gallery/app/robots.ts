import { createSEORobots } from "@ux-patterns/seo/robots";

const baseUrl = "https://gallery.uxpatterns.dev";

export default function robots() {
	return createSEORobots(baseUrl, {
		disallowPaths: ["/404", "/500", "/api/*"],
		blockBadBots: true,
	});
}
