"use client";

import { ArrowRight, CheckCircle, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
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
				"not-prose mt-8 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-white p-5 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900",
				className,
			)}
		>
			<div className="mb-5">
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
						<Sparkles className="h-3.5 w-3.5" />
						Choose this vs that
					</div>
					{current ? (
						<div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
							Current pattern: {current}
						</div>
					) : null}
				</div>
				<div className="max-w-3xl">
					<h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
						{heading}
					</h3>
					<p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
						{subheading}
					</p>
				</div>
			</div>

			<div className={cn("grid gap-4", gridClassName)}>
				{alternatives.map((alt) => (
					<div
						className="group relative flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
						key={alt.name}
					>
						<div className="mb-4">
							<div className="inline-flex items-center gap-1 text-base font-medium">
								<Link
									href={alt.path}
									data-card
									className="inline-flex items-center gap-1 text-xl text-neutral-950 no-underline after:absolute after:inset-0 after:content-[''] dark:text-neutral-50"
								>
									{alt.name}
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								</Link>
							</div>
						</div>

						<div className="flex flex-1 flex-col justify-between gap-4 text-sm">
							<div>
								<div className="mb-1 font-medium text-neutral-950 dark:text-neutral-50">
									Choose when
								</div>
								<p className="leading-6 text-neutral-600 dark:text-neutral-300">
									{alt.when}
								</p>
							</div>

							<div className="mt-auto space-y-4">
								{(alt.pros || alt.cons) && (
									<div className="space-y-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
										{alt.pros ? (
											<div className="flex items-start gap-2">
												<CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
												<div>
													<div className="font-medium text-neutral-950 dark:text-neutral-50">
														Why it wins
													</div>
													<p className="leading-6 text-neutral-600 dark:text-neutral-300">
														{alt.pros.join(", ")}
													</p>
												</div>
											</div>
										) : null}
										{alt.cons ? (
											<div className="flex items-start gap-2">
												<XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
												<div>
													<div className="font-medium text-neutral-950 dark:text-neutral-50">
														Tradeoffs
													</div>
													<p className="leading-6 text-neutral-600 dark:text-neutral-300">
														{alt.cons.join(", ")}
													</p>
												</div>
											</div>
										) : null}
									</div>
								)}

								<div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
									<span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
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
