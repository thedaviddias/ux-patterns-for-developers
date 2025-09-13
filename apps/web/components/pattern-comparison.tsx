import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
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
	className?: string;
};

export const PatternComparison = ({
	alternatives,
	className,
}: PatternComparisonProps) => {
	if (!alternatives || alternatives.length === 0) return null;

	return (
		<div className={cn("mt-6", className)}>
			<h3 className="text-lg font-semibold mb-4">Compare Alternatives</h3>

			<div className="space-y-3">
				{alternatives.map((alt) => (
					<div
						className="block border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg p-4 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 relative"
						key={alt.name}
					>
						<div className="mb-2">
							<div className="text-base font-medium inline-flex items-center gap-1">
								<Link
									key={alt.name}
									href={alt.path}
									className="inline-flex items-center gap-1 no-underline after:content-[''] after:absolute after:inset-0 text-xl"
								>
									{alt.name}
									<ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</div>

						<p className="text-base text-gray-700 dark:text-gray-300 mb-3">
							<span className="font-medium">Best for:</span> {alt.when}
						</p>

						{(alt.pros || alt.cons) && (
							<div className="flex flex-col gap-2 text-sm">
								{alt.pros && (
									<div className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
										<span className="text-gray-700 dark:text-gray-300">
											{alt.pros.join(", ")}
										</span>
									</div>
								)}
								{alt.cons && (
									<div className="flex items-start gap-2">
										<XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
										<span className="text-gray-700 dark:text-gray-300">
											{alt.cons.join(", ")}
										</span>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
