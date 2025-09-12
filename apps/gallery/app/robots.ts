import { createSEORobots } from "@ux-patterns/seo/robots";
import { siteConfig } from "@/lib/site.config";

export default function robots() {
	return createSEORobots(siteConfig.url, {
		blockBadBots: true,
	});
}
