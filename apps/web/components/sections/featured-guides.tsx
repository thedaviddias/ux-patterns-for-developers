import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Doc } from "@/lib/content";

interface FeaturedGuidesProps {
	guides: Doc[];
}

export function FeaturedGuides({ guides }: FeaturedGuidesProps) {
	if (guides.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="featured-guides-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container mx-auto px-6">
				<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-display text-sm italic text-muted-foreground">
							Guides
						</p>
						<h2
							id="featured-guides-heading"
							className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
						>
							Pattern comparisons for decisions teams actually face
						</h2>
					</div>
					<Link
						href="/pattern-guide"
						className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
					>
						View all guides
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="grid gap-4 xl:grid-cols-4">
					{guides.map((guide, index) => (
						<Link
							key={guide.slug}
							href={guide.url}
							className={cn(
								"group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 transition-all duration-200 hover:border-foreground/20 hover:shadow-[0_26px_80px_-50px_rgba(15,23,42,0.45)]",
								index % 2 === 0
									? "bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))]"
									: "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))]",
							)}
						>
							<div className="space-y-3">
								<h3 className="text-2xl font-semibold text-foreground">
									{guide.title}
								</h3>
								<p className="text-sm leading-6 text-muted-foreground">
									{guide.description}
								</p>
							</div>

							<div className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
								Read guide
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
