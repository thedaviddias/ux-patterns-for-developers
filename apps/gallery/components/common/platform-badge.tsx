import { Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
	platform: string;
	className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
	const Icon = platform === "web" ? Monitor : Smartphone;
	const href = `/${platform}`;

	return (
		<Link
			href={href}
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium bg-fd-muted text-fd-muted-foreground rounded-md hover:bg-fd-muted/80 transition-colors",
				className,
			)}
		>
			<Icon className="w-3.5 h-3.5" />
			<span className="capitalize">{platform}</span>
		</Link>
	);
}
