import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Pattern, PatternCategory } from "@/utils/get-pattern-categories";

interface FeaturedPatternsProps {
	categories: PatternCategory[];
}

// Define which patterns to feature (by their path slugs)
const FEATURED_PATTERN_SLUGS = [
	"content-management/modal",
	"forms/form-validation",
	"content-management/carousel",
	"navigation/tabs",
	"ai-intelligence/ai-chat",
];

interface PatternCardProps {
	pattern: Pattern;
}

function PatternCard({ pattern }: PatternCardProps) {
	return (
		<Link
			href={pattern.href}
			className="group block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			{pattern.icon && (
				<pattern.icon
					className="h-8 w-8 text-foreground/80 mb-4"
					aria-hidden="true"
				/>
			)}

			<h3 className="text-xl font-semibold text-foreground mb-2">
				{pattern.title}
			</h3>

			<p className="text-sm text-muted-foreground">
				{pattern.summary || pattern.description}
			</p>
		</Link>
	);
}

export function FeaturedPatterns({ categories }: FeaturedPatternsProps) {
	// Get featured patterns from categories (non-draft)
	const featuredPatterns: Pattern[] = [];

	for (const slug of FEATURED_PATTERN_SLUGS) {
		const [categoryPath, patternSlug] = slug.split("/");
		const category = categories.find((c) => c.path === categoryPath);
		if (category) {
			const pattern = category.patterns.find(
				(p) => p.href.endsWith(patternSlug) && p.status !== "draft",
			);
			if (pattern) {
				featuredPatterns.push(pattern);
			}
		}
	}

	// If we couldn't find the featured patterns, get the first 5 non-draft patterns
	if (featuredPatterns.length < 4) {
		for (const category of categories) {
			for (const pattern of category.patterns) {
				if (pattern.status !== "draft" && featuredPatterns.length < 5) {
					const alreadyIncluded = featuredPatterns.some(
						(fp) => fp.href === pattern.href,
					);
					if (!alreadyIncluded) {
						featuredPatterns.push(pattern);
					}
				}
			}
		}
	}

	const totalPatternCount = categories.reduce(
		(acc, cat) => acc + cat.patterns.filter((p) => p.status !== "draft").length,
		0,
	);

	return (
		<section
			aria-labelledby="featured-patterns-heading"
			className="py-16 sm:py-20 lg:py-24 bg-muted/20"
		>
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="flex items-center justify-between mb-10">
					<div>
						<h2
							id="featured-patterns-heading"
							className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
						>
							Popular Patterns
						</h2>
						<p className="mt-2 text-muted-foreground">
							Explore commonly used patterns with in-depth documentation
						</p>
					</div>
					<Link
						href="/patterns"
						className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						View all {totalPatternCount}+ patterns
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				{/* Patterns Grid */}
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{featuredPatterns.slice(0, 5).map((pattern) => (
						<PatternCard key={pattern.href} pattern={pattern} />
					))}
				</div>

				{/* Mobile CTA */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						href="/patterns"
						className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						View all {totalPatternCount}+ patterns
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
