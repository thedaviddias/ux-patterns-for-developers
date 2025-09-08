import { Monitor, Smartphone } from "lucide-react";
import { cn, formatWebsite } from "@/lib/utils";

interface WebsitePillProps {
	website: string;
	platform: "web" | "mobile";
	className?: string;
}

export function WebsitePill({
	website,
	platform,
	className,
}: WebsitePillProps) {
	const formattedWebsite = formatWebsite(website);

	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
				"bg-fd-muted text-fd-muted-foreground text-sm font-medium",
				className,
			)}
		>
			{platform === "web" ? (
				<Monitor className="w-3 h-3" />
			) : (
				<Smartphone className="w-3 h-3" />
			)}
			<span className="truncate max-w-32">{formattedWebsite}</span>
		</div>
	);
}
