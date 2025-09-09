"use client";

import { ArrowRight, Package2 } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import { cn } from "@/lib/cn";

type KitBannerProps = {
	className?: string;
	componentUrl?: string;
};

export const KitBanner = ({ className, componentUrl }: KitBannerProps) => {
	const plausible = usePlausible();
	const href = componentUrl || "https://kit.uxpatterns.dev";

	return (
		<div
			className={cn(
				"border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-4 p-6 rounded-lg",
				className,
			)}
		>
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
					<Package2 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
				</div>
				<div className="flex flex-col items-start">
					<Link
						href={href}
						target="_blank"
						rel="noopener"
						className="group flex items-center justify-between hover:no-underline"
						onClick={() => {
							plausible("UP Kit Banner Click", {
								props: {
									source: "pattern_page",
								},
							});
						}}
					>
						<span className="text-lg font-semibold tracking-tight">
							UP Kit Component
						</span>
					</Link>
					<p className="text-sm text-gray-600 dark:text-gray-300">
						Get ready-to-use React components for this pattern
					</p>
				</div>
			</div>
			<ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-1" />
		</div>
	);
};
