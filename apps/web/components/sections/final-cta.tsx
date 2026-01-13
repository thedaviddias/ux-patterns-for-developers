import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
	return (
		<section
			aria-labelledby="final-cta-heading"
			className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 relative overflow-hidden"
		>
			{/* Subtle gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-background to-foreground/[0.03] pointer-events-none" />

			<div className="container max-w-3xl mx-auto px-6 relative">
				<div className="text-center">
					<h2
						id="final-cta-heading"
						className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-tight"
					>
						Ready to build better interfaces?
					</h2>

					<p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
						Start with the getting started guide or dive straight into the
						patterns.
					</p>

					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
						{/* Primary CTA */}
						<Link
							href="/patterns/getting-started"
							className="group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-base font-semibold transition-all duration-200 hover:bg-foreground/90 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							<BookOpen className="h-4 w-4" />
							Getting Started Guide
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>

						{/* Secondary CTA */}
						<Link
							href="/patterns"
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							<Layers className="h-4 w-4" />
							Browse All Patterns
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
