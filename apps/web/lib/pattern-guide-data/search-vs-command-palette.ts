/**
 * Data for the search-field-vs-command-palette pattern guide
 */

export const comparisonData = {
	patterns: [
		{
			title: "Search Field",
			href: "/patterns/forms/search-field",
			criteria: [
				"Users are retrieving existing content or filtering a dataset",
				"The control should stay visible and obvious",
				"Discovery matters more than expert speed",
				"Results should feel like content, not commands",
			],
		},
		{
			title: "Command Palette",
			href: "/patterns/advanced/command-palette",
			criteria: [
				"Users need actions, navigation, and shortcuts in one place",
				"The product already has enough complexity to justify a power surface",
				"Keyboard-first speed matters",
				"Queries should trigger commands, pages, or recent items",
			],
		},
	],
};
