import { Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
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
	// For client components, we'll use a simple mapping approach
	// This avoids importing server-side functions that use Node.js APIs
	const getWebsiteDisplayName = (url: string) => {
		const websiteNames: Record<string, string> = {
			"example-shop.com": "Example Shop",
			"cluttered-site.com": "Cluttered Site",
			"social-feed.com": "Social Feed",
			"mobile-app.com": "Mobile App",
			"design-system.com": "Design System",
		};

		return websiteNames[url] || formatWebsite(url);
	};

	const websiteName = getWebsiteDisplayName(website);
	const href = `/website/${website}`;

	return (
		<Link
			href={href}
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
				"bg-fd-muted text-fd-muted-foreground text-sm font-medium hover:bg-fd-muted/80 transition-colors",
				className,
			)}
		>
			{platform === "web" ? (
				<Monitor className="w-3.5 h-3.5" />
			) : (
				<Smartphone className="w-3.5 h-3.5" />
			)}
			<span className="truncate max-w-32">{websiteName}</span>
		</Link>
	);
}
