import { JsonLd } from "@/components/json-ld";

interface GlossaryStructuredDataProps {
	term: string;
	definition: string;
	category: string[];
	url?: string;
}

export function GlossaryStructuredData({
	term,
	definition,
	category,
	url,
}: GlossaryStructuredDataProps) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name: term,
		description: definition,
		url: url,
		inDefinedTermSet: {
			"@type": "DefinedTermSet",
			name: "UX Patterns Glossary",
			url: "https://uxpatterns.dev/glossary",
		},
		...(category.length > 0 && { termCode: category.join(",") }),
	};

	return <JsonLd data={structuredData} />;
}
