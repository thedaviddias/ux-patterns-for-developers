"use client";

import { enrichPatternsWithIcons } from "../utils/enrich-patterns-with-icons";
import { RelatedPatternsCard } from "./related-patterns-card";

// Mock data for demonstration - in production, this would come from a data source
const categoryPatterns: Record<
	string,
	Array<{
		title: string;
		path: string;
		description?: string;
		category?: string;
	}>
> = {
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

type RelatedPatternsCardServerProps = {
	patterns?: Array<{
		title: string;
		path: string;
		description?: string;
		category?: string;
	}>;
	category?: string;
	maxItems?: number;
	className?: string;
};

export const RelatedPatternsCardServer = ({
	patterns,
	category,
	maxItems = 4,
	className,
}: RelatedPatternsCardServerProps) => {
	// Use provided patterns or get from category
	let displayPatterns = patterns;

	if (!displayPatterns && category) {
		displayPatterns = categoryPatterns[category] || [];
	}

	// Enrich patterns with icons from source data
	const enrichedPatterns = displayPatterns
		? enrichPatternsWithIcons(displayPatterns)
		: undefined;

	return (
		<RelatedPatternsCard
			patterns={enrichedPatterns}
			category={category}
			maxItems={maxItems}
			className={className}
		/>
	);
};
