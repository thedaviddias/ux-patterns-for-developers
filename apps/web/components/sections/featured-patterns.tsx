import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPatternTheme } from "@/constants/pattern-themes";
import { getPatternCoverSrc } from "@/lib/pattern-cover-assets";
import { TRACKING_CLASSES } from "@/lib/tracking";
import type { Pattern, PatternCategory } from "@/utils/get-pattern-categories";

interface FeaturedPatternsProps {
	categories: PatternCategory[];
}

const FEATURED_PATTERN_SLUGS = [
	"content-management/modal",
	"navigation/pagination",
	"forms/autocomplete",
	"data-display/table",
	"forms/text-field",
];

interface PatternCardProps {
	pattern: Pattern;
}

function getPatternCategory(path: string) {
	return path.split("/")[2] ?? "";
}

function getPatternSlug(path: string) {
	return path.split("/").at(-1) ?? "";
}

function PatternCard({ pattern }: PatternCardProps) {
	const category = getPatternCategory(pattern.href);
	const patternSlug = getPatternSlug(pattern.href);
	const theme = getPatternTheme(category);
	const coverSrc = getPatternCoverSrc(patternSlug);

	return (
		<Link
			href={pattern.href}
			className={`${TRACKING_CLASSES.VIEW_PATTERN_CLICK} group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_28px_90px_-55px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
		>
			<div
				className="relative min-h-[220px] overflow-hidden border-b border-border/60"
				style={{ boxShadow: `inset 0 -24px 60px -34px ${theme.glow}` }}
			>
				{coverSrc ? (
					<Image
						src={coverSrc}
						alt={`${pattern.title} pattern specimen`}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
						sizes="(max-width: 1024px) 100vw, 20vw"
						unoptimized
					/>
				) : (
					<div
						className="absolute inset-0"
						style={{
							background: `radial-gradient(circle at top left, ${theme.glow}, transparent 40%), linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.78))`,
						}}
					/>
				)}
			</div>

			<div className="p-5">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.badgeClass}`}>
						{theme.label}
					</span>
					{pattern.icon && (
						<pattern.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
					)}
				</div>

				<h3 className="text-2xl font-semibold text-foreground">{pattern.title}</h3>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{pattern.summary || pattern.description}
				</p>

				<div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
					Explore pattern
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
		</Link>
	);
}

export function FeaturedPatterns({ categories }: FeaturedPatternsProps) {
	const featuredPatterns: Pattern[] = [];

	for (const slug of FEATURED_PATTERN_SLUGS) {
		const [categoryPath, patternSlug] = slug.split("/");
		const category = categories.find((item) => item.path === categoryPath);
		if (!category) continue;

		const pattern = category.patterns.find(
			(item) => item.href.endsWith(patternSlug) && item.status !== "draft",
		);
		if (pattern) {
			featuredPatterns.push(pattern);
		}
	}

	if (featuredPatterns.length < 4) {
		for (const category of categories) {
			for (const pattern of category.patterns) {
				if (pattern.status === "draft" || featuredPatterns.length >= 5) continue;
				if (featuredPatterns.some((item) => item.href === pattern.href)) continue;
				featuredPatterns.push(pattern);
			}
		}
	}

	const totalPatternCount = categories.reduce(
		(acc, category) =>
			acc + category.patterns.filter((pattern) => pattern.status !== "draft").length,
		0,
	);

	return (
		<section
			aria-labelledby="featured-patterns-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container mx-auto px-6">
				<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-display text-sm italic text-muted-foreground">
							Pattern specimens
						</p>
						<h2
							id="featured-patterns-heading"
							className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
						>
							See the library through real interface surfaces
						</h2>
					</div>
					<Link
						href="/patterns"
						className={`${TRACKING_CLASSES.VIEW_PATTERN_CLICK} inline-flex items-center gap-2 text-sm font-semibold text-foreground`}
					>
						View all {totalPatternCount}+ patterns
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					{featuredPatterns.slice(0, 5).map((pattern) => (
						<PatternCard key={pattern.href} pattern={pattern} />
					))}
				</div>
			</div>
		</section>
	);
}
