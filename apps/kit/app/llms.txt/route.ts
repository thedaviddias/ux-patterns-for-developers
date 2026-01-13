import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	const scanned: string[] = [];
	scanned.push("# UX Patterns Kit");
	const map = new Map<string, string[]>();

	for (const page of source.getPages()) {
		const dir = page.slugs[0];
		const list = map.get(dir) ?? [];
		list.push(`- [${page.data.title}](${page.url}): ${page.data.description}`);
		map.set(dir, list);
	}

	// Add sections
	for (const [key, value] of map) {
		scanned.push(`## ${key}`);
		scanned.push(value.join("\n"));
	}

	return new Response(scanned.join("\n\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control":
				"public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
			"CDN-Cache-Control": "max-age=86400",
			"Vercel-CDN-Cache-Control": "max-age=86400",
		},
	});
}
