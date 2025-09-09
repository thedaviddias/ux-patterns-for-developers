"use client";

import Link from "next/link";

interface PatternOption {
	title: string;
	href: string;
	criteria: string[];
}

interface ComparisonGridProps {
	patterns: PatternOption[];
}

export function ComparisonGrid({ patterns }: ComparisonGridProps) {
	return (
		<div className="mb-16">
			<h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{patterns.map((pattern) => (
					<div
						key={pattern.title}
						className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 hover:border-neutral-200 dark:hover:bg-neutral-900 dark:hover:border-neutral-400 transition-all duration-100 ease-in-out p-6"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-medium text-indigo-600 dark:text-indigo-400 mt-0">
								<Link
									href={
										pattern.href.startsWith("/")
											? pattern.href
											: `/${pattern.href}`
									}
									className="relative z-10 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 no-underline"
								>
									{pattern.title}
								</Link>
							</h3>
						</div>
						<div className="space-y-4">
							<div>
								<h4 className="font-medium mb-2">Choose When</h4>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
									{pattern.criteria.map((criterion, index) => (
										<li key={`criterion-${pattern.title}-${index}`}>
											✓ {criterion}
										</li>
									))}
								</ul>
							</div>
						</div>
						<Link
							href={
								pattern.href.startsWith("/") ? pattern.href : `/${pattern.href}`
							}
							className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
							aria-label={`View ${pattern.title} pattern details`}
						>
							<span className="sr-only">View pattern details</span>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
