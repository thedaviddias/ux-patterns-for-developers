import { cn } from "@ux-patterns/ui/lib/utils";
import type { ReactNode } from "react";

export interface PatternBadgeProps {
	variant: "new" | "updated";
	className?: string;
	children?: ReactNode;
}

export function PatternBadge({
	variant,
	className,
	children,
}: PatternBadgeProps) {
	const variantStyles = {
		new: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		updated: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	};

	const label = children || (variant === "new" ? "New" : "Updated");

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
				variantStyles[variant],
				className,
			)}
			aria-label={`${label} pattern`}
		>
			{label}
		</span>
	);
}
