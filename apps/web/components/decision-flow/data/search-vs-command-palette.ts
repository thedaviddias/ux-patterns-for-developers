import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Is the primary job finding existing content or filtering a list?",
			description:
				"Use this for site search, scoped dataset filtering, and retrieval tasks.",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "pattern",
		data: {
			label: "Search Field",
			description:
				"Best for visible retrieval, filtering, and content-first search experiences.",
			patternLink: "/patterns/forms/search-field",
		},
		position: { x: -260, y: 150 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label:
				"Does the product need a keyboard-first launcher for actions and navigation?",
			description:
				"Think commands, destinations, recent items, and power-user speed.",
		},
		position: { x: 220, y: 150 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Command Palette",
			description:
				"Best for action-heavy interfaces where search doubles as a launcher.",
			patternLink: "/patterns/advanced/command-palette",
		},
		position: { x: 220, y: 300 },
	},
	{
		id: "5",
		type: "consideration",
		data: {
			label: "Start With Search Field",
			description:
				"If the surface is still simple, prefer a visible search input before introducing a hidden power-user layer.",
			patternLink: "/patterns/forms/search-field",
		},
		position: { x: -40, y: 300 },
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
];
