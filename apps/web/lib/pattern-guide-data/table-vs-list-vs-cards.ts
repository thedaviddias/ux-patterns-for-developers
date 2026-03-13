/**
 * Data for the table-vs-list-vs-cards pattern guide
 */

export const comparisonData = {
	patterns: [
		{
			title: "Table",
			href: "/patterns/data-display/table",
			criteria: [
				"Cross-item comparison is critical",
				"Sorting and filtering matter",
				"Many fields must stay visible together",
				"Density matters more than visual browsing",
			],
		},
		{
			title: "List View",
			href: "/patterns/data-display/list-view",
			criteria: [
				"Users scan a single vertical stream",
				"Only a few attributes matter per item",
				"Mobile-first readability matters",
				"Chronological or priority order is important",
			],
		},
		{
			title: "Card Grid",
			href: "/patterns/data-display/card-grid",
			criteria: [
				"Visual content is a primary part of the decision",
				"Each item should feel self-contained",
				"Browsing matters more than direct comparison",
				"Responsive visual layout is a priority",
			],
		},
	],
};
