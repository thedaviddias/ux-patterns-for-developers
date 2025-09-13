"use client";

import { ArrowRight, Package2 } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import { cn } from "@/lib/cn";

type KitBannerProps = {
	className?: string;
	componentUrl?: string;
	title?: string;
	description?: string;
};

export const KitBanner = ({
	className,
	componentUrl,
	title = "UX Patterns Kit Component",
	description = "Get ready-to-use React components for this pattern",
}: KitBannerProps) => {
	const plausible = usePlausible();
	const href = componentUrl || "https://kit.uxpatterns.dev";

	return (
		<div className="mt-6">
			<div
				className={cn(
					"block border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg p-4 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 relative",
					className,
				)}
			>
				<div className="flex items-center gap-3 justify-between">
					<div className="flex items-start gap-3 ">
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
							<Package2 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
						</div>
						<div className="flex flex-col items-start">
							<Link
								href={href}
								target="_blank"
								rel="noopener"
								className="group flex items-center justify-between hover:no-underline no-underline after:content-[''] after:absolute after:inset-0"
								onClick={() => {
									plausible("UX Patterns Kit Banner Click", {
										props: {
											source: "pattern_page",
										},
									});
								}}
							>
								<span className="text-lg font-semibold tracking-tight">
									{title}
								</span>
							</Link>
							<p className="text-sm text-gray-600 dark:text-gray-300 mt-0 mb-0">
								{description}
							</p>
						</div>
					</div>
					<ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
		</div>
	);
};
