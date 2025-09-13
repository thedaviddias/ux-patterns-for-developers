import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Does the interaction require blocking other actions?",
			description:
				"Should users be prevented from interacting with the rest of the page?",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "question",
		data: {
			label: "Is the content complex or lengthy?",
			description: "Forms, wizards, or detailed information",
		},
		position: { x: -200, y: 100 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "Is the interaction contextual to a specific element?",
			description: "Related to a button, link, or specific UI element",
		},
		position: { x: 200, y: 100 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Modal",
			description: "Full attention required, blocks other interactions",
			patternLink: "/patterns/content-management/modal",
		},
		position: { x: -300, y: 200 },
	},
	{
		id: "5",
		type: "question",
		data: {
			label: "Do you need to maintain page context?",
			description: "Should users see the underlying content?",
		},
		position: { x: -100, y: 200 },
	},
	{
		id: "6",
		type: "pattern",
		data: {
			label: "Drawer",
			description:
				"Side panel that maintains context, good for filters/navigation",
			patternLink: "/patterns/navigation/sidebar",
		},
		position: { x: -200, y: 300 },
	},
	{
		id: "7",
		type: "question",
		data: {
			label: "Is it just supplementary information?",
			description: "Brief help text or additional context",
		},
		position: { x: 300, y: 200 },
	},
	{
		id: "8",
		type: "pattern",
		data: {
			label: "Popover",
			description: "Contextual overlay for moderate content",
			patternLink: "/patterns/content-management/popover",
		},
		position: { x: 100, y: 300 },
	},
	{
		id: "9",
		type: "pattern",
		data: {
			label: "Tooltip",
			description: "Brief text-only information on hover/focus",
			patternLink: "/patterns/content-management/tooltip",
		},
		position: { x: 400, y: 300 },
	},
	{
		id: "10",
		type: "consideration",
		data: {
			label: "Consider Mobile Experience",
			description: "Modals work better on mobile than popovers",
			patternLink: "/patterns/content-management/modal#mobile-considerations",
		},
		position: { x: 0, y: 400 },
	},
];

export const edges: DecisionEdge[] = [
	// Initial blocking question
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

	// Complex content path
	{
		id: "e2-4",
		source: "2",
		target: "4",
		label: "Yes",
	},
	{
		id: "e2-5",
		source: "2",
		target: "5",
		label: "No",
	},

	// Context maintenance path
	{
		id: "e5-6",
		source: "5",
		target: "6",
		label: "Yes",
	},
	{
		id: "e5-4",
		source: "5",
		target: "4",
		label: "No",
	},

	// Contextual element path
	{
		id: "e3-7",
		source: "3",
		target: "7",
		label: "Yes",
	},
	{
		id: "e3-5",
		source: "3",
		target: "5",
		label: "No",
	},

	// Supplementary info path
	{
		id: "e7-9",
		source: "7",
		target: "9",
		label: "Yes",
	},
	{
		id: "e7-8",
		source: "7",
		target: "8",
		label: "No",
	},

	// Mobile consideration connections
	{
		id: "e8-10",
		source: "8",
		target: "10",
		label: "Check mobile",
	},
	{
		id: "e4-10",
		source: "4",
		target: "10",
		label: "Consider",
	},
];
