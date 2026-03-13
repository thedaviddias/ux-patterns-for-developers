/**
 * Data for the pagination-vs-infinite-scroll-vs-load-more pattern guide
 */

export const comparisonData = {
	patterns: [
		{
			title: "Pagination",
			href: "/patterns/navigation/pagination",
			criteria: [
				"Users need precise jumps and stable URLs",
				"SEO and shareability matter",
				"People compare results or revisit earlier items",
				"Orientation matters more than immersion",
			],
		},
		{
			title: "Infinite Scroll",
			href: "/patterns/navigation/infinite-scroll",
			criteria: [
				"Browsing should feel uninterrupted",
				"Discovery and engagement are the primary job",
				"Mobile-heavy consumption matters",
				"Users rarely need a known stopping point",
			],
		},
		{
			title: "Load More",
			href: "/patterns/navigation/load-more",
			criteria: [
				"You want progressive disclosure with user control",
				"Footer access still matters",
				"Users browse, but not as passively as a feed",
				"You need a safer default than infinite scroll",
			],
		},
	],
};
