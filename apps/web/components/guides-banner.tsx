"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";

type GuidesBannerProps = {
	title?: string;
	description?: string;
	guidePath?: string;
	className?: string;
};

export const GuidesBanner = ({
	title = "Compare Pattern Options",
	description = "Make the right choice with our decision guide",
	guidePath = "/pattern-guide",
	className,
}: GuidesBannerProps) => {
	const plausible = usePlausible();

	return (
		<Link
			href={guidePath}
			data-card
			className={cn(
				"not-prose group relative mt-8 mb-8 flex items-center justify-between rounded-lg",
				"border border-border/50 overflow-hidden",
				"px-4 py-3 transition-all duration-200",
				"hover:border-emerald-500/30 hover:shadow-md",
				"no-underline hover:no-underline",
				className,
			)}
			onClick={() => {
				plausible("Pattern Guide Click", {
					props: {
						guide_path: guidePath,
						title: title,
					},
				});
			}}
		>
			{/* Background gradient animation - green/teal theme */}
			<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-50 group-hover:opacity-70 transition-opacity" />

			{/* Geometric SVG pattern */}
			<svg
				className="absolute inset-0 w-full h-full opacity-10"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern
						id="guides-pattern"
						x="0"
						y="0"
						width="60"
						height="60"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M30 5 L55 30 L30 55 L5 30 Z"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							className="text-emerald-500"
						>
							<animateTransform
								attributeName="transform"
								type="rotate"
								from="0 30 30"
								to="360 30 30"
								dur="20s"
								repeatCount="indefinite"
							/>
						</path>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#guides-pattern)" />
			</svg>

			<div className="relative flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm">
					<Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div className="flex flex-col">
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						Decision Guide
					</span>
					<span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
						{title}
					</span>
					<span className="text-xs text-muted-foreground mt-0.5">
						{description}
					</span>
				</div>
			</div>
			<ArrowRight className="relative h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
		</Link>
	);
};
