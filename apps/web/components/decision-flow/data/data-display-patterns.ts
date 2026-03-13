import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Do users need to compare multiple items side by side?",
			description:
				"Use this when people must line up attributes, sort columns, or scan across rows.",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "pattern",
		data: {
			label: "Table",
			description:
				"Best for dense comparison, sorting, and structured analysis",
			patternLink: "/patterns/data-display/table",
		},
		position: { x: -280, y: 140 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "Is visual browsing more important than strict comparison?",
			description:
				"Think images, covers, thumbnails, and self-contained cards.",
		},
		position: { x: 220, y: 140 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Card Grid",
			description: "Best for visual discovery and self-contained item browsing",
			patternLink: "/patterns/data-display/card-grid",
		},
		position: { x: 420, y: 300 },
	},
	{
		id: "5",
		type: "question",
		data: {
			label:
				"Do users mostly scan a single stream with only a few key attributes?",
			description:
				"Use this for inboxes, activity feeds, lightweight records, and mobile-first lists.",
		},
		position: { x: 40, y: 300 },
	},
	{
		id: "6",
		type: "pattern",
		data: {
			label: "List View",
			description:
				"Best for simple scanning, prioritization, and mobile readability",
			patternLink: "/patterns/data-display/list-view",
		},
		position: { x: 40, y: 450 },
	},
	{
		type: "consideration",
		id: "7",
		data: {
			label: "Use Table Instead",
			description:
				"If fields keep growing and comparison becomes the main job, a table will outperform a list.",
			patternLink: "/patterns/data-display/table",
		},
		position: { x: -220, y: 450 },
	},
];

export const edges: DecisionEdge[] = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		label: "Yes",
	},
	{
		id: "e1-3",
		source: "1",
		target: "3",
		label: "No",
	},
	{
		id: "e3-4",
		source: "3",
		target: "4",
		label: "Yes",
	},
	{
		id: "e3-5",
		source: "3",
		target: "5",
		label: "No",
	},
	{
		id: "e5-6",
		source: "5",
		target: "6",
		label: "Yes",
	},
	{
		id: "e5-7",
		source: "5",
		target: "7",
		label: "No",
	},
];
