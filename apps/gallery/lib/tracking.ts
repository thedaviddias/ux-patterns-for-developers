/**
 * Centralized Plausible tracking utilities for UP Kit
 * This file contains all event names and tracking functions for consistent analytics
 */

// Event Names - Centralized list of all tracked events
export const TRACKING_EVENTS = {
	GITHUB_LINK_CLICK: "GitHub Link Click",
	MAIN_SITE_LINK_CLICK: "Main Site Link Click",

	GITHUB_STAR_CLICK: "GitHub Star Click",

	// Search & Discovery
	COMPONENT_SEARCH: "Component Search",

	// Navigation Events
	COMPONENT_PAGE_VIEW: "Component Page View",

	// Footer Events
	FOOTER_LINK_CLICK: "Footer Link Click",
	FOOTER_SOCIAL_CLICK: "Footer Social Click",
} as const;

// Helper function to convert event name to Plausible class
export const asPlausibleClass = (eventName: string): string => {
	const encoded = encodeURIComponent(eventName).replace(/%20/g, "+");
	return `plausible-event-name=${encoded}`;
};

// CSS Class Names for auto-tracking (plausible-event-name)
export const TRACKING_CLASSES = {
	GITHUB_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.GITHUB_LINK_CLICK),

	MAIN_SITE_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.MAIN_SITE_LINK_CLICK),

	GITHUB_STAR_CLICK: asPlausibleClass(TRACKING_EVENTS.GITHUB_STAR_CLICK),
} as const;

// Type for Plausible tracking function
type EventName = (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];
export type PlausibleTracker = (
	event: EventName | string,
	options?: { props?: Record<string, string | number> },
) => void;

// Helper function to track navigation events
export const trackNavigationEvent = (
	plausible: PlausibleTracker,
	type: "github" | "main_site",
	url: string,
	label?: string,
) => {
	const eventMap = {
		github: TRACKING_EVENTS.GITHUB_LINK_CLICK,
		main_site: TRACKING_EVENTS.MAIN_SITE_LINK_CLICK,
	};

	plausible(eventMap[type], {
		props: {
			url,
			...(label && { label }),
		},
	});
};

// Helper function to track component page views
export const trackComponentPageView = (
	plausible: PlausibleTracker,
	componentName: string,
) => {
	plausible(TRACKING_EVENTS.COMPONENT_PAGE_VIEW, {
		props: {
			component_name: componentName,
		},
	});
};

// Helper function to track footer clicks
export const trackFooterClick = (
	plausible: PlausibleTracker,
	linkType: "general" | "resource" | "social",
	linkLabel: string,
) => {
	const eventName =
		linkType === "social"
			? TRACKING_EVENTS.FOOTER_SOCIAL_CLICK
			: TRACKING_EVENTS.FOOTER_LINK_CLICK;

	plausible(eventName, {
		props: {
			link_type: linkType,
			link_label: linkLabel,
		},
	});
};
