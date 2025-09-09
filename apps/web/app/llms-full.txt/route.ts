import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

// Cache for 24 hours (86400 seconds)
export const revalidate = 86400;

export async function GET() {
	const scan = source
		.getPages()
		.filter((file) => file.slugs[0] !== "pages")
		.filter((file) => file.slugs[0] !== "blog")
		.map(getLLMText);
	const scanned = await Promise.all(scan);

	const content = scanned.join("\n\n");

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control":
				"public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
			"CDN-Cache-Control": "max-age=86400",
			"Vercel-CDN-Cache-Control": "max-age=86400",
		},
	});
}
