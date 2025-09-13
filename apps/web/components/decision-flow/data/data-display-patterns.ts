import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Do users need to compare data across items?",
			description:
				"Will users analyze relationships between different data points?",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "question",
		data: {
			label: "Is visual content (images/graphics) primary?",
			description: "Are images or visual elements the main focus?",
		},
		position: { x: -200, y: 100 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "How many data fields per item?",
			description: "Consider the amount of information to display",
		},
		position: { x: 200, y: 100 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Table",
			description: "Best for data comparison and analysis",
			patternLink: "/patterns/data-display/table",
		},
		position: { x: -300, y: 200 },
	},
	{
		id: "5",
		type: "question",
		data: {
			label: "Is mobile the primary platform?",
			description: "Will most users access on mobile devices?",
		},
		position: { x: -100, y: 200 },
	},
	{
		id: "6",
		type: "pattern",
		data: {
			label: "Card Grid",
			description: "Visual browsing with flexible layout",
			patternLink: "/patterns/data-display/card-grid",
		},
		position: { x: 300, y: 300 },
	},
	{
		id: "7",
		type: "pattern",
		data: {
			label: "List View",
			description: "Simple, scannable, mobile-friendly",
			patternLink: "/patterns/data-display/list-view",
		},
		position: { x: 100, y: 300 },
	},
	{
		id: "8",
		type: "consideration",
		data: {
			label: "Consider Responsive Table",
			description: "Use horizontal scroll or card transformation on mobile",
			patternLink: "/patterns/data-display/table#responsive-design",
		},
		position: { x: -200, y: 300 },
	},
	{
		id: "9",
		type: "pattern",
		data: {
			label: "Dashboard",
			description: "Multiple data visualizations in one view",
			patternLink: "/patterns/data-display/dashboard",
		},
		position: { x: 0, y: 400 },
	},
	{
		id: "10",
		type: "question",
		data: {
			label: "Need multiple data views?",
			description: "Charts, metrics, and KPIs together?",
		},
		position: { x: 0, y: 200 },
	},
];

export const edges: DecisionEdge[] = [
	// Initial comparison question
	{
		id: "e1-2",
		source: "1",
		target: "2",
		label: "No",
	},
	{
		id: "e1-5",
		source: "1",
		target: "5",
		label: "Yes",
	},

	// Visual content path
	{
		id: "e2-6",
		source: "2",
		target: "6",
		label: "Yes",
	},
	{
		id: "e2-3",
		source: "2",
		target: "3",
		label: "No",
	},

	// Data fields question
	{
		id: "e3-7",
		source: "3",
		target: "7",
		label: "Few (1-3)",
	},
	{
		id: "e3-6",
		source: "3",
		target: "6",
		label: "Many (4+)",
	},

	// Mobile platform path
	{
		id: "e5-8",
		source: "5",
		target: "8",
		label: "Yes",
	},
	{
		id: "e5-4",
		source: "5",
		target: "4",
		label: "No",
	},

	// Multiple views path
	{
		id: "e1-10",
		source: "1",
		target: "10",
		label: "Multiple types",
	},
	{
		id: "e10-9",
		source: "10",
		target: "9",
		label: "Yes",
	},

	// Responsive consideration
	{
		id: "e8-7",
		source: "8",
		target: "7",
		label: "Simplify",
	},
];
