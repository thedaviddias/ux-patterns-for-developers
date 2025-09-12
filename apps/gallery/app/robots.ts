import { createSEORobots } from "@ux-patterns/seo/robots";
import { siteConfig } from "@/lib/site.config";

export default function robots() {
	return createSEORobots(siteConfig.url, {
		disallowPaths: ["/404", "/500", "/api/*"],
		blockBadBots: true,
	});
}
