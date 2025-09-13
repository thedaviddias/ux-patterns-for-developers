import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	const scanned: string[] = [];
	scanned.push("# UX Patterns for Developers");
	const map = new Map<string, string[]>();

	for (const page of source.getPages()) {
		// Filter out blog and pages sections
		if (page.slugs[0] === "blog" || page.slugs[0] === "pages") {
			continue;
		}

		const dir = page.slugs[0];
		const list = map.get(dir) ?? [];
		list.push(`- [${page.data.title}](${page.url}): ${page.data.description}`);
		map.set(dir, list);
	}

	// Define the order we want sections to appear
	const sectionOrder = ["pattern-guide", "patterns", "glossary"];

	// Add sections in the specified order
	for (const key of sectionOrder) {
		if (map.has(key)) {
			scanned.push(`## ${key}`);
			const content = map.get(key)?.join("\n");
			if (content) {
				scanned.push(content);
			}
		}
	}

	// Add any remaining sections that weren't in the predefined order
	for (const [key, value] of map) {
		if (!sectionOrder.includes(key)) {
			scanned.push(`## ${key}`);
			scanned.push(value.join("\n"));
		}
	}

	return new Response(scanned.join("\n\n"));
}
