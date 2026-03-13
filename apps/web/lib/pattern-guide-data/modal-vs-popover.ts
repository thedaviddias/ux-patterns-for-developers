/**
 * Data for the modal-vs-popover pattern guide
 */

export const comparisonData = {
	patterns: [
		{
			title: "Modal",
			href: "/patterns/content-management/modal",
			criteria: [
				"The task must interrupt the current flow",
				"Critical confirmations or required input",
				"Complex forms and multi-step interactions",
				"The user should focus on one thing only",
			],
		},
		{
			title: "Popover",
			href: "/patterns/content-management/popover",
			criteria: [
				"The content is contextual to a trigger",
				"Users need lightweight actions or details",
				"Page context should remain visible",
				"The interaction should feel lighter than a modal",
			],
		},
		{
			title: "Tooltip",
			href: "/patterns/content-management/tooltip",
			criteria: [
				"Users only need a brief explanation",
				"The content is non-critical and non-interactive",
				"Hover or focus should be enough to reveal it",
				"Visual disruption should stay minimal",
			],
		},
	],
};
