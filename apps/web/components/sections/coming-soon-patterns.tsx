import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import type { Pattern, PatternCategory } from "@/utils/get-pattern-categories";

interface ComingSoonPatternsProps {
	categories: PatternCategory[];
}

interface PatternCardProps {
	pattern: Pattern;
}

function ComingSoonCard({ pattern }: PatternCardProps) {
	return (
		<div className="block rounded-xl border border-border bg-card p-5 opacity-70">
			<div className="flex items-start justify-between mb-4">
				{pattern.icon && (
					<pattern.icon
						className="h-8 w-8 text-foreground/60"
						aria-hidden="true"
					/>
				)}
				<Badge variant="outline" className="text-[10px]">
					Coming soon
				</Badge>
			</div>

			<h3 className="text-xl font-semibold text-foreground mb-2">
				{pattern.title}
			</h3>

			<p className="text-sm text-muted-foreground">
				{pattern.summary || pattern.description}
			</p>
		</div>
	);
}

export function ComingSoonPatterns({ categories }: ComingSoonPatternsProps) {
	// Get draft patterns for "coming soon" section
	const comingSoonPatterns: Pattern[] = [];
	for (const category of categories) {
		for (const pattern of category.patterns) {
			if (pattern.status === "draft" && comingSoonPatterns.length < 10) {
				comingSoonPatterns.push(pattern);
			}
		}
	}

	// Don't render if no coming soon patterns
	if (comingSoonPatterns.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="coming-soon-patterns-heading"
			className="py-16 sm:py-20 lg:py-24"
		>
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="mb-10">
					<h2
						id="coming-soon-patterns-heading"
						className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
					>
						Coming Soon
					</h2>
					<p className="mt-2 text-muted-foreground">
						Patterns we&apos;re currently working on
					</p>
				</div>

				{/* Patterns Grid - 2 rows of 5 */}
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{comingSoonPatterns.slice(0, 10).map((pattern) => (
						<ComingSoonCard key={pattern.href} pattern={pattern} />
					))}
				</div>
			</div>
		</section>
	);
}
