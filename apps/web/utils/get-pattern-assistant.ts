import { source } from "@/lib/source";

// Simple icon type for now - you can replace with lucide-react if needed
export type SimpleIcon = React.ComponentType<{ className?: string }>;

export type PatternAssistantPage = {
	title: string;
	summary: string;
	icon?: SimpleIcon;
	href: string;
	frontMatter?: Record<string, unknown>;
};

export async function getPatternAssistantPages(
	_locale: string,
): Promise<PatternAssistantPage[]> {
	// Get all pages from the source
	const allPages = source.getPages();

	// Filter for pattern-guide pages (pages that start with 'pattern-guide/')
	const patternGuidePages = allPages.filter(
		(page) => page.slugs[0] === "pattern-guide" && page.slugs.length > 1,
	);

	return patternGuidePages.map((page) => {
		return {
			title: page.data.title || page.slugs[page.slugs.length - 1],
			summary: (page.data as any).summary || page.data.description || "",
			href: page.url,
			icon: undefined, // Temporarily disabled until lucide-react is available
			frontMatter: page.data as unknown as Record<string, unknown>,
		};
	});
}
