import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PatternHeaderProps {
	pattern: string;
	description?: string;
	category?: string;
	className?: string;
}

// Map category names to folder names in the web app
const categoryToFolderMap: Record<string, string> = {
	Forms: "forms",
	Navigation: "navigation",
	"Data Display": "data-display",
	"Content Management": "content-management",
	"User Feedback": "user-feedback",
	Authentication: "authentication",
	"E-commerce": "e-commerce",
	Media: "media",
	Social: "social",
	"AI Intelligence": "ai-intelligence",
	Advanced: "advanced",
};

export function PatternHeader({
	pattern,
	description,
	category,
	className,
}: PatternHeaderProps) {
	// Construct the proper URL with category
	const getPatternUrl = () => {
		const patternSlug = pattern.toLowerCase().replace(/\s+/g, "-");
		if (category && categoryToFolderMap[category]) {
			return `http://localhost:3062/patterns/${categoryToFolderMap[category]}/${patternSlug}`;
		}
		// Fallback to pattern name only if category mapping not found
		return `http://localhost:3062/patterns/${patternSlug}`;
	};

	return (
		<div className={cn("bg-fd-card border-b border-fd-border", className)}>
			<div className="container-responsive py-8">
				<div className="space-y-4">
					<div>
						{category && (
							<span className="inline-block px-2 py-1 text-xs font-medium bg-fd-muted text-fd-muted-foreground rounded-md mb-3">
								{category}
							</span>
						)}
						<h1 className="text-3xl font-bold text-fd-foreground mb-2">
							{pattern}
						</h1>

						{description && (
							<p className="text-lg text-fd-muted-foreground max-w-2xl mb-4">
								{description}
							</p>
						)}

						{/* Link to pattern documentation */}
						<Link
							href={getPatternUrl()}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fd-muted text-fd-muted-foreground rounded-md hover:bg-fd-muted/80 hover:text-fd-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-fd-primary focus:ring-offset-2"
						>
							<span>View UX Pattern</span>
							<ExternalLink className="w-3.5 h-3.5" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
