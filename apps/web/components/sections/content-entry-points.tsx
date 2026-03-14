import { ArrowRight, BookOpen, Compass, FileText, LibraryBig } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

type EntryPoint = {
	title: string;
	description: string;
	href: string;
	countLabel: string;
	icon: ComponentType<{ className?: string }>;
	accentClass: string;
	surfaceClass: string;
};

interface ContentEntryPointsProps {
	patternCount: number;
	glossaryCount: number;
	guideCount: number;
	blogCount: number;
}

export function ContentEntryPoints({
	patternCount,
	glossaryCount,
	guideCount,
	blogCount,
}: ContentEntryPointsProps) {
	const entries: EntryPoint[] = [
		{
			title: "Patterns",
			description:
				"Specimen-led documentation for building common interfaces with confidence.",
			href: "/patterns",
			countLabel: `${patternCount}+ references`,
			icon: LibraryBig,
			accentClass: "text-orange-700 dark:text-orange-300",
			surfaceClass:
				"from-orange-100 via-white to-amber-50 dark:from-orange-950/40 dark:via-slate-950 dark:to-slate-950",
		},
		{
			title: "Guides",
			description:
				"Decision-first comparisons to help teams choose the right interaction pattern.",
			href: "/pattern-guide",
			countLabel: `${guideCount} comparisons`,
			icon: Compass,
			accentClass: "text-fuchsia-700 dark:text-fuchsia-300",
			surfaceClass:
				"from-fuchsia-100 via-white to-violet-50 dark:from-fuchsia-950/40 dark:via-slate-950 dark:to-slate-950",
		},
		{
			title: "Glossary",
			description:
				"Quick definitions for UX, accessibility, and web platform terminology.",
			href: "/glossary",
			countLabel: `${glossaryCount} terms`,
			icon: BookOpen,
			accentClass: "text-teal-700 dark:text-teal-300",
			surfaceClass:
				"from-teal-100 via-white to-cyan-50 dark:from-teal-950/40 dark:via-slate-950 dark:to-slate-950",
		},
		{
			title: "Blog",
			description:
				"Editorial posts, launch notes, and deeper thinking around product and interaction design.",
			href: "/blog",
			countLabel: `${blogCount} posts`,
			icon: FileText,
			accentClass: "text-blue-700 dark:text-blue-300",
			surfaceClass:
				"from-blue-100 via-white to-slate-50 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-950",
		},
	];

	return (
		<section
			aria-labelledby="entry-points-heading"
			className="py-8 sm:py-10 lg:py-12"
		>
			<div className="container mx-auto px-6">
				<div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-display text-sm italic text-muted-foreground">
							Start with the job you need to do
						</p>
						<h2
							id="entry-points-heading"
							className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
						>
							Four ways into the library
						</h2>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{entries.map((entry) => (
						<Link
							key={entry.title}
							href={entry.href}
							className={cn(
								"group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-foreground/20",
								entry.surfaceClass,
							)}
						>
							<div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
							<div className="flex items-start justify-between gap-4">
								<div
									className={cn(
										"flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5",
										entry.accentClass,
									)}
								>
									<entry.icon className="h-5 w-5" />
								</div>
								<span className="rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
									{entry.countLabel}
								</span>
							</div>

							<div className="mt-10 space-y-3">
								<h3 className="text-2xl font-semibold text-foreground">
									{entry.title}
								</h3>
								<p className="text-sm leading-6 text-muted-foreground">
									{entry.description}
								</p>
							</div>

							<div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
								Enter collection
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
