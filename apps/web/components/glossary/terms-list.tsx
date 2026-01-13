"use client";

import { Cards } from "@/components/mdx";
import { AlphabetNav } from "./alphabet-nav";
import { TermCard } from "./term-card";

interface Term {
	title: string;
	description: string;
	category: string[];
	slug: string;
	url: string;
}

interface TermsListProps {
	terms: Term[];
}

export function TermsList({ terms }: TermsListProps) {
	// Group terms by first letter
	const groupedTerms = terms.reduce<Record<string, Term[]>>((acc, term) => {
		// Ensure title exists and has at least one character
		const title = term.title || "";
		if (title.length === 0) return acc;

		// Get the first character and ensure it's a letter
		const firstChar = title[0];
		if (!firstChar) return acc;

		const firstLetter = firstChar.toUpperCase();
		if (!acc[firstLetter]) {
			acc[firstLetter] = [];
		}
		acc[firstLetter].push(term);
		return acc;
	}, {});

	// Sort letters alphabetically
	const sortedLetters = Object.keys(groupedTerms).sort();

	if (sortedLetters.length === 0) {
		return <p>No glossary terms found.</p>;
	}

	return (
		<div className="space-y-12">
			<AlphabetNav availableLetters={sortedLetters} />
			{sortedLetters.map((letter) => {
				const letterTerms = groupedTerms[letter];
				if (!letterTerms?.length) return null;

				return (
					<section key={letter} id={letter.toLowerCase()}>
						<h2 className="text-2xl font-bold mb-6 text-foreground scroll-mt-20">
							{letter}
						</h2>
						<Cards className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{letterTerms
								.sort((a, b) => a.title.localeCompare(b.title))
								.map((term) => (
									<TermCard
										key={term.slug}
										title={term.title}
										description={term.description}
										category={term.category}
										url={term.url}
									/>
								))}
						</Cards>
					</section>
				);
			})}
		</div>
	);
}
