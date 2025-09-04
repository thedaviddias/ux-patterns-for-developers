import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "What is your primary content type?",
			description: "Consider how users typically consume your content",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "question",
		data: {
			label: "Is SEO critical for your content?",
			description:
				"Consider if content needs to be easily discoverable and indexed",
		},
		position: { x: -200, y: 100 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "Do users need to bookmark/share specific items?",
			description: "Consider if users need to return to specific content",
		},
		position: { x: 200, y: 100 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Pagination",
			description:
				"Best for structured, searchable content with clear navigation",
			patternLink: "/patterns/navigation/pagination#implementation",
		},
		position: { x: -300, y: 200 },
	},
	{
		id: "5",
		type: "pattern",
		data: {
			label: "Infinite Scroll",
			description: "Ideal for continuous browsing and discovery",
			patternLink: "/patterns/navigation/infinite-scroll#implementation",
		},
		position: { x: 300, y: 200 },
	},
	{
		id: "6",
		type: "consideration",
		data: {
			label: "Consider Hybrid Approach",
			description: "Load More button with limited infinite scroll",
			patternLink: "/patterns/navigation/infinite-scroll#hybrid-approach",
		},
		position: { x: 0, y: 300 },
	},
	{
		id: "7",
		type: "question",
		data: {
			label: "Is mobile the primary platform?",
			description: "Consider touch interfaces and screen size",
		},
		position: { x: 100, y: 150 },
	},
	{
		id: "8",
		type: "consideration",
		data: {
			label: "Performance Considerations",
			description:
				"Memory usage, loading states, and scroll position management",
			patternLink: "/patterns/navigation/pagination#performance",
		},
		position: { x: -100, y: 250 },
	},
];

export const edges: DecisionEdge[] = [
	// Content type decisions
	{
		id: "e1-2",
		source: "1",
		target: "2",
		label: "Structured Content",
	},
	{
		id: "e1-3",
		source: "1",
		target: "3",
		label: "Social/Feed Content",
	},

	// SEO path
	{
		id: "e2-4",
		source: "2",
		target: "4",
		label: "Yes",
	},
	{
		id: "e2-8",
		source: "2",
		target: "8",
		label: "No",
	},

	// Bookmarking path
	{
		id: "e3-7",
		source: "3",
		target: "7",
		label: "No",
	},
	{
		id: "e3-4",
		source: "3",
		target: "4",
		label: "Yes",
	},

	// Mobile consideration
	{
		id: "e7-5",
		source: "7",
		target: "5",
		label: "Yes",
	},
	{
		id: "e7-6",
		source: "7",
		target: "6",
		label: "No",
	},

	// Performance to hybrid
	{
		id: "e8-6",
		source: "8",
		target: "6",
		label: "Consider",
	},
];
