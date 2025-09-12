import { createSEORobots } from "@ux-patterns/seo/robots";
import { BASE_URL } from "@/constants/project";

export default function robots() {
	return createSEORobots(BASE_URL, {
		blockBadBots: true,
		crawlDelay: 1,
	});
}
