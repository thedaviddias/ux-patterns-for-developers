import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Does the task need to interrupt the user?",
			description:
				"Use this when people should stop and deal with one focused task.",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "pattern",
		data: {
			label: "Modal",
			description:
				"Best for blocking tasks, required actions, and focused input",
			patternLink: "/patterns/content-management/modal",
		},
		position: { x: -260, y: 140 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "Does the content include actions or multi-step interaction?",
			description:
				"Think quick actions, menus, filters, and lightweight contextual UI.",
		},
		position: { x: 220, y: 140 },
	},
	{
		type: "pattern",
		id: "4",
		data: {
			label: "Popover",
			description: "Best for contextual details or lightweight interaction",
			patternLink: "/patterns/content-management/popover",
		},
		position: { x: 80, y: 300 },
	},
	{
		id: "5",
		type: "question",
		data: {
			label: "Is it only a brief explanation with no interaction inside it?",
			description:
				"If yes, it should stay short, non-critical, and easy to dismiss.",
		},
		position: { x: 360, y: 300 },
	},
	{
		id: "6",
		type: "pattern",
		data: {
			label: "Tooltip",
			description: "Best for short explanatory text on hover or focus",
			patternLink: "/patterns/content-management/tooltip",
		},
		position: { x: 360, y: 440 },
	},
	{
		id: "7",
		type: "consideration",
		data: {
			label: "Use Popover Instead",
			description:
				"If users need to click, tab, or read more than a sentence or two, do not force it into a tooltip.",
			patternLink: "/patterns/content-management/popover",
		},
		position: { x: 120, y: 440 },
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
		label: "No",
	},
	{
		id: "e3-5",
		source: "3",
		target: "5",
		label: "Yes",
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
