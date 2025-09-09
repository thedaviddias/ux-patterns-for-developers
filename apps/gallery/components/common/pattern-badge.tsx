import Link from "next/link";
import { getCategoryForPattern } from "@/lib/url-utils";
import { cn } from "@/lib/utils";

interface PatternBadgeProps {
	pattern: string;
	platform: string;
	className?: string;
}

export function PatternBadge({
	pattern,
	platform,
	className,
}: PatternBadgeProps) {
	const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, "-");
	const category = getCategoryForPattern(normalizedPattern) || "navigation";
	const href = `/${platform}/${category}/${normalizedPattern}`;

	return (
		<Link
			href={href}
			className={cn(
				"inline-block px-2 py-1 text-sm font-medium bg-fd-muted text-fd-muted-foreground rounded-md hover:bg-fd-muted/80 transition-colors",
				className,
			)}
		>
			{pattern}
		</Link>
	);
}
