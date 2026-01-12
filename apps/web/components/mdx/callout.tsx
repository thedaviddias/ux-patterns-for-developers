"use client";

import { cn } from "@/lib/cn";
import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export type CalloutType = "info" | "warning" | "error" | "tip";

interface CalloutProps {
	type?: CalloutType;
	title?: string;
	children: ReactNode;
	className?: string;
}

const calloutConfig: Record<
	CalloutType,
	{
		icon: typeof Info;
		containerClass: string;
		iconClass: string;
		titleClass: string;
	}
> = {
	info: {
		icon: Info,
		containerClass: "border-blue-500/20 bg-blue-500/5",
		iconClass: "text-blue-500",
		titleClass: "text-blue-600 dark:text-blue-400",
	},
	warning: {
		icon: AlertTriangle,
		containerClass: "border-yellow-500/20 bg-yellow-500/5",
		iconClass: "text-yellow-500",
		titleClass: "text-yellow-600 dark:text-yellow-400",
	},
	error: {
		icon: AlertCircle,
		containerClass: "border-red-500/20 bg-red-500/5",
		iconClass: "text-red-500",
		titleClass: "text-red-600 dark:text-red-400",
	},
	tip: {
		icon: Lightbulb,
		containerClass: "border-green-500/20 bg-green-500/5",
		iconClass: "text-green-500",
		titleClass: "text-green-600 dark:text-green-400",
	},
};

const defaultTitles: Record<CalloutType, string> = {
	info: "Info",
	warning: "Warning",
	error: "Error",
	tip: "Tip",
};

/**
 * Callout Component
 *
 * Displays an informational callout box with different types:
 * - info: General information
 * - warning: Caution or important notes
 * - error: Error or critical information
 * - tip: Helpful tips or suggestions
 */
export function Callout({
	type = "info",
	title,
	children,
	className,
}: CalloutProps) {
	const config = calloutConfig[type];
	const Icon = config.icon;
	const displayTitle = title ?? defaultTitles[type];

	return (
		<div
			className={cn(
				"my-6 flex gap-3 rounded-lg border p-4",
				config.containerClass,
				className
			)}
			role="note"
		>
			<Icon
				className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.iconClass)}
				aria-hidden="true"
			/>
			<div className="flex-1 min-w-0">
				{displayTitle && (
					<p className={cn("font-semibold mb-1", config.titleClass)}>
						{displayTitle}
					</p>
				)}
				<div className="text-sm text-muted-foreground [&>p]:mb-2 [&>p:last-child]:mb-0">
					{children}
				</div>
			</div>
		</div>
	);
}
