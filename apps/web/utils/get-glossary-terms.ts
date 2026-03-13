import { source } from "@/lib/source";

export interface GlossaryTerm {
	title: string;
	description: string;
	category: string[];
	synonyms: string[];
	relatedPatterns: string[];
	slug: string;
	url: string;
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
	try {
		const allPages = source.getPages();

		// Filter for glossary pages (excluding index)
		const glossaryPages = allPages.filter(
			(page) => page.slugs[0] === "glossary" && page.slugs.length > 1,
		);

		const terms = glossaryPages.map((page) => {
			return {
				title: page.data.title || page.slugs[page.slugs.length - 1],
				description: page.data.description || "",
				category: Array.isArray(page.data.category) ? page.data.category : [],
				synonyms: Array.isArray(page.data.synonyms) ? page.data.synonyms : [],
				relatedPatterns: Array.isArray(page.data.related_patterns)
					? page.data.related_patterns
					: [],
				slug: page.slugs[page.slugs.length - 1],
				url: page.url,
			};
		});

		return terms;
	} catch (error) {
		console.error("Error fetching glossary terms:", error);
		return [];
	}
}
