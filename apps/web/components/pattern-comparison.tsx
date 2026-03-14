"use client";

import { ArrowRight, CheckCircle, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { cardHoverClassName } from "../lib/card-interactions";
import { cn } from "../lib/cn";

type Alternative = {
	name: string;
	path: string;
	when: string;
	pros?: string[];
	cons?: string[];
};

type PatternComparisonProps = {
	alternatives: Alternative[];
	current?: string;
	title?: string;
	description?: string;
	className?: string;
};

export const PatternComparison = ({
	alternatives,
	current,
	title,
	description,
	className,
}: PatternComparisonProps) => {
	if (!alternatives || alternatives.length === 0) return null;

	const alternativeNames = alternatives.map((alt) => alt.name).join(", ");
	const heading =
		title ??
		(current
			? `Choose ${current} vs alternatives`
			: "Choose the right pattern");
	const subheading =
		description ??
		(current
			? `Not sure ${current} is the right fit? Compare it with ${alternativeNames}.`
			: "Compare the most relevant alternatives before you commit to a pattern.");
	const gridClassName =
		alternatives.length >= 3
			? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
			: alternatives.length === 2
				? "grid-cols-1 md:grid-cols-2"
				: "grid-cols-1";

	return (
		<section
			className={cn(
				"not-prose mt-8 rounded-[1.75rem] border border-border/70 bg-card/80 p-5 backdrop-blur",
				className,
			)}
		>
			<div className="mb-5">
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
						<Sparkles className="h-3.5 w-3.5" />
						Choose this vs that
					</div>
					{current ? (
						<div className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/35 dark:text-emerald-300">
							Current pattern: {current}
						</div>
					) : null}
				</div>
				<div className="max-w-3xl">
					<h3 className="text-xl font-semibold tracking-tight text-foreground">
						{heading}
					</h3>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						{subheading}
					</p>
				</div>
			</div>

			<div className={cn("grid gap-4", gridClassName)}>
				{alternatives.map((alt) => (
					<div
						className={cn(
							"group relative flex h-full flex-col rounded-[1.5rem] border border-border/70 bg-background/70 p-4",
							cardHoverClassName(),
						)}
						key={alt.name}
					>
						<div className="mb-4">
							<div className="inline-flex items-center gap-1 text-base font-medium">
								<Link
									href={alt.path}
									data-card
									className="inline-flex items-center gap-1 text-xl text-foreground no-underline after:absolute after:inset-0 after:content-['']"
								>
									{alt.name}
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</Link>
							</div>
						</div>

						<div className="flex flex-1 flex-col justify-between gap-4 text-sm">
							<div>
								<div className="mb-1 font-medium text-foreground">
									Choose when
								</div>
								<p className="leading-6 text-muted-foreground">{alt.when}</p>
							</div>

							<div className="mt-auto space-y-4">
								{(alt.pros || alt.cons) && (
									<div className="space-y-3 border-t border-border/60 pt-4">
										{alt.pros ? (
											<div className="flex items-start gap-2">
												<CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
												<div>
													<div className="font-medium text-foreground">
														Why it wins
													</div>
													<p className="leading-6 text-muted-foreground">
														{alt.pros.join(", ")}
													</p>
												</div>
											</div>
										) : null}
										{alt.cons ? (
											<div className="flex items-start gap-2">
												<XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
												<div>
													<div className="font-medium text-foreground">
														Tradeoffs
													</div>
													<p className="leading-6 text-muted-foreground">
														{alt.cons.join(", ")}
													</p>
												</div>
											</div>
										) : null}
									</div>
								)}

								<div className="border-t border-border/60 pt-4">
									<span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
										Read pattern
										<ArrowRight className="h-4 w-4" />
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
