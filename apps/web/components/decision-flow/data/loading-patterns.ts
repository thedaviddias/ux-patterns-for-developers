import type { DecisionEdge, DecisionNode } from "../types";

export const nodes: DecisionNode[] = [
	{
		id: "1",
		type: "question",
		data: {
			label: "Do users need to jump to a known position?",
			description:
				"Use this when page numbers, stable URLs, or return visits matter.",
		},
		position: { x: 0, y: 0 },
	},
	{
		id: "2",
		type: "pattern",
		data: {
			label: "Pagination",
			description:
				"Best for search results, directories, and interfaces with strong orientation needs.",
			patternLink: "/patterns/navigation/pagination",
		},
		position: { x: -280, y: 140 },
	},
	{
		id: "3",
		type: "question",
		data: {
			label: "Is passive, uninterrupted browsing the primary behavior?",
			description:
				"Think feeds, endless discovery, and scroll-first consumption.",
		},
		position: { x: 220, y: 140 },
	},
	{
		id: "4",
		type: "pattern",
		data: {
			label: "Infinite Scroll",
			description:
				"Best for feed-like experiences where flow matters more than precise control.",
			patternLink: "/patterns/navigation/infinite-scroll",
		},
		position: { x: 420, y: 280 },
	},
	{
		id: "5",
		type: "question",
		data: {
			label: "Do users benefit from choosing when to fetch the next batch?",
			description:
				"Useful when you want progressive disclosure without removing control.",
		},
		position: { x: 20, y: 280 },
	},
	{
		id: "6",
		type: "pattern",
		data: {
			label: "Load More",
			description:
				"Best balanced default for browse-heavy interfaces that still need control and footer access.",
			patternLink: "/patterns/navigation/load-more",
		},
		position: { x: 20, y: 420 },
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
		id: "e5-2",
		source: "5",
		target: "2",
		label: "No",
	},
];
