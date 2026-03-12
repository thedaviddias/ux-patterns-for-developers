import { buildLlmsIndexText } from "@/lib/pattern-skills-text.mjs";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	return new Response(buildLlmsIndexText(source.getPages()), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control":
				"public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
			"CDN-Cache-Control": "max-age=86400",
			"Vercel-CDN-Cache-Control": "max-age=86400",
		},
	});
}
