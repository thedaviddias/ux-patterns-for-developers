"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

type RelatedPattern = {
	title: string;
	path: string;
	description?: string;
	category?: string;
};

type RelatedPatternsCardProps = {
	patterns?: RelatedPattern[];
	category?: string;
	maxItems?: number;
	className?: string;
};

// Mock data for demonstration - in production, this would come from a data source
const categoryPatterns: Record<string, RelatedPattern[]> = {
	navigation: [
		{
			title: "Pagination",
			path: "/patterns/navigation/pagination",
			description: "Split content into pages",
		},
		{
			title: "Infinite Scroll",
			path: "/patterns/navigation/infinite-scroll",
			description: "Auto-load on scroll",
		},
		{
			title: "Load More",
			path: "/patterns/navigation/load-more",
			description: "Manual content loading",
		},
		{
			title: "Breadcrumb",
			path: "/patterns/navigation/breadcrumb",
			description: "Show navigation hierarchy",
		},
		{
			title: "Tabs",
			path: "/patterns/navigation/tabs",
			description: "Organize content sections",
		},
		{
			title: "Back to Top",
			path: "/patterns/navigation/back-to-top",
			description: "Quick scroll to top",
		},
	],
	forms: [
		{
			title: "Text Field",
			path: "/patterns/forms/text-field",
			description: "Basic text input",
		},
		{
			title: "Autocomplete",
			path: "/patterns/forms/autocomplete",
			description: "Suggest as users type",
		},
		{
			title: "Date Picker",
			path: "/patterns/forms/date-picker",
			description: "Calendar date selection",
		},
		{
			title: "Multi-Select",
			path: "/patterns/forms/multi-select-input",
			description: "Choose multiple options",
		},
		{
			title: "Form Validation",
			path: "/patterns/forms/form-validation",
			description: "Error handling",
		},
	],
	"data-display": [
		{
			title: "Table",
			path: "/patterns/data-display/table",
			description: "Tabular data display",
		},
		{
			title: "Card Grid",
			path: "/patterns/data-display/card-grid",
			description: "Grid of content cards",
		},
		{
			title: "List View",
			path: "/patterns/data-display/list-view",
			description: "Vertical item list",
		},
		{
			title: "Dashboard",
			path: "/patterns/data-display/dashboard",
			description: "Data overview page",
		},
		{
			title: "Chart",
			path: "/patterns/data-display/chart",
			description: "Data visualization",
		},
	],
	"content-management": [
		{
			title: "Accordion",
			path: "/patterns/content-management/accordion",
			description: "Expandable sections",
		},
		{
			title: "Tabs",
			path: "/patterns/navigation/tabs",
			description: "Switch between views",
		},
		{
			title: "Modal",
			path: "/patterns/content-management/modal",
			description: "Overlay dialog",
		},
		{
			title: "Tooltip",
			path: "/patterns/content-management/tooltip",
			description: "Contextual hints",
		},
		{
			title: "Popover",
			path: "/patterns/content-management/popover",
			description: "Interactive overlays",
		},
	],
};

export const RelatedPatternsCard = ({
	patterns,
	category,
	maxItems = 4,
	className,
}: RelatedPatternsCardProps) => {
	const pathname = usePathname();
	const slug =
		pathname.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";

	// Use provided patterns or get from category
	let displayPatterns = patterns;

	if (!displayPatterns && category) {
		displayPatterns = categoryPatterns[category] || [];
	}

	// Filter out current pattern and limit items
	displayPatterns = displayPatterns
		?.filter((p) => {
			if (!slug) return true;
			const targetSlug =
				p.path.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";
			return targetSlug !== slug;
		})
		.slice(0, maxItems);

	if (!displayPatterns || displayPatterns.length === 0) return null;

	return (
		<div className={cn("mt-6", className)}>
			<h3 className="text-xl font-semibold mb-4 text-foreground">
				Explore Related Patterns
			</h3>

			<div className="grid gap-3 sm:grid-cols-2">
				{displayPatterns.map((pattern) => (
					<Link
						key={pattern.path}
						href={pattern.path}
						className={cn(
							"group block p-4 rounded-lg border border-border",
							"bg-card hover:bg-secondary/50",
							"transition-all duration-200",
							"hover:shadow-sm dark:hover:shadow-none",
						)}
					>
						<div className="flex items-start justify-between">
							<div>
								<h4 className="font-medium text-base text-card-foreground group-hover:text-primary">
									{pattern.title}
								</h4>
								{pattern.description && (
									<p className="text-sm text-muted-foreground mt-1">
										{pattern.description}
									</p>
								)}
							</div>
							<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};
