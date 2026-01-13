import { cn } from "@ux-patterns/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TRACKING_CLASSES } from "@/lib/tracking";
import { getPatternCategories } from "@/utils/get-pattern-categories";

export default async function Hero() {
	// Get pattern count dynamically
	const categories = await getPatternCategories();
	const patternCount = categories.reduce(
		(acc, cat) => acc + cat.patterns.filter((p) => p.status !== "draft").length,
		0,
	);
	const categoryCount = categories.length;

	return (
		<section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
			{/* Subtle gradient background */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20" />

			<div className="container max-w-4xl mx-auto px-6 text-center">
				{/* Trust Badge */}
				<Link
					href="/patterns"
					className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium transition-all hover:border-foreground/30 hover:bg-muted/50 mb-8"
				>
					<span className="inline-flex items-center rounded-full bg-foreground text-background px-2.5 py-0.5 text-xs font-bold tabular-nums">
						{patternCount}+
					</span>
					<span className="text-muted-foreground">
						UX Patterns across {categoryCount} categories
					</span>
				</Link>

				{/* Main Headline */}
				<h1
					className={cn(
						"text-foreground",
						"mx-auto max-w-3xl",
						"text-balance font-semibold tracking-tight",
						"text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
						"leading-[1.1]",
					)}
				>
					The Developer's Guide to UX Patterns
				</h1>

				{/* Subheadline */}
				<p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl leading-relaxed">
					Comprehensive documentation covering{" "}
					<span className="text-foreground font-medium">when to use</span> each
					pattern, accessibility guidelines, and real implementation examples.
				</p>

				{/* CTA */}
				<div className="mt-10 flex items-center justify-center">
					<Link
						href="/patterns"
						className={`${TRACKING_CLASSES.BROWSE_PATTERNS_CLICK} group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-base font-semibold transition-all duration-200 hover:bg-foreground/90 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
					>
						Browse Patterns
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
