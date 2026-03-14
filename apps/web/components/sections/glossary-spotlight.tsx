import { ArrowRight, BookMarked } from "lucide-react";
import Link from "next/link";
import type { GlossaryTerm } from "@/utils/get-glossary-terms";

interface GlossarySpotlightProps {
	terms: GlossaryTerm[];
}

export function GlossarySpotlight({ terms }: GlossarySpotlightProps) {
	if (terms.length === 0) {
		return null;
	}

	const letters = Array.from(
		new Set(terms.map((term) => term.title[0]?.toUpperCase())),
	)
		.filter(Boolean)
		.slice(0, 8);

	return (
		<section
			aria-labelledby="glossary-spotlight-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container mx-auto px-6">
				<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-display text-sm italic text-muted-foreground">
							Reference vocabulary
						</p>
						<h2
							id="glossary-spotlight-heading"
							className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
						>
							Learn the terms behind the patterns
						</h2>
					</div>
					<Link
						href="/glossary"
						className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
					>
						Open glossary
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur">
					<div className="mb-6 flex flex-wrap items-center gap-2">
						<div className="mr-3 flex items-center gap-2 text-sm font-semibold text-foreground">
							<BookMarked className="h-4 w-4" />
							Quick jump
						</div>
						{letters.map((letter) => (
							<Link
								key={letter}
								href={`/glossary#${letter.toLowerCase()}`}
								className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
							>
								{letter}
							</Link>
						))}
					</div>

					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{terms.map((term) => (
							<Link
								key={term.slug}
								href={term.url}
								className="group rounded-[1.5rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,250,249,0.86))] p-5 transition-all duration-200 hover:border-foreground/15 hover:-translate-y-0.5 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.72))]"
							>
								<div className="flex items-start justify-between gap-3">
									<span className="font-display text-4xl italic leading-none text-teal-700/80 dark:text-teal-300/80">
										{term.title[0]}
									</span>
									{term.category[0] && (
										<span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
											{term.category[0]}
										</span>
									)}
								</div>
								<h3 className="mt-6 text-xl font-semibold text-foreground">
									{term.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-muted-foreground">
									{term.description}
								</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
