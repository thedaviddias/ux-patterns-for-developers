import { GlossaryStructuredData } from "./structured-data";

interface TermPageProps {
	frontMatter: {
		title: string;
		description: string;
		category?: string[];
		related_patterns?: string[];
		synonyms?: string[];
	};
	url?: string;
	children: React.ReactNode;
}

export function TermPage({ frontMatter, url, children }: TermPageProps) {
	return (
		<div className="max-w-4xl mx-auto">
			<GlossaryStructuredData
				term={frontMatter.title}
				definition={frontMatter.description}
				category={frontMatter.category || []}
				url={url}
			/>
			{children}
		</div>
	);
}
