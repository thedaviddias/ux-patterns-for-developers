import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
	return (
		<section
			aria-labelledby="final-cta-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container relative mx-auto max-w-4xl px-6">
				<div className="rounded-[2rem] border border-border/70 bg-card/85 px-6 py-10 text-center backdrop-blur sm:px-8">
					<p className="font-display text-sm italic text-muted-foreground">
						Start here
					</p>
					<h2
						id="final-cta-heading"
						className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
					>
						Start with the pattern library
					</h2>

					<p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
						Open the getting started page if you want structure first, or go
						straight into the patterns if you already know what you are trying
						to build.
					</p>

					<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/patterns/getting-started"
							className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-base font-semibold text-background transition-all duration-200 hover:bg-foreground/90 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							<BookOpen className="h-4 w-4" />
							Getting Started Guide
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>

						<Link
							href="/patterns"
							className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-base font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
