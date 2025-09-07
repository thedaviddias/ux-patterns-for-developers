/**
 * Centralized Plausible tracking utilities for UP Kit
 * This file contains all event names and tracking functions for consistent analytics
 */

// Event Names - Centralized list of all tracked events
export const TRACKING_EVENTS = {
	// Component Code Events
	COMPONENT_CODE_COPY: "Component Code Copy",
	COMPONENT_DOCS_MODAL_OPEN: "Component Docs Modal Open",
	COMPONENT_RAW_CODE_COPY: "Component Raw Code Copy",

	// Installation Events
	INSTALL_COMMAND_COPY: "Install Command Copy",

	// Component Preview Events
	COMPONENT_VARIANT_VIEW: "Component Variant View",
	COMPONENT_TAB_SWITCH: "Component Tab Switch",

	// External Tool Events
	OPEN_IN_V0: "Open in V0",
	OPEN_IN_KIT: "Open in Kit",

	// Navigation Events
	COMPONENT_PAGE_VIEW: "Component Page View",
	PATTERN_LINK_CLICK: "Pattern Link Click",
	GITHUB_LINK_CLICK: "GitHub Link Click",
	MAIN_SITE_LINK_CLICK: "Main Site Link Click",

	// Search & Discovery
	COMPONENT_SEARCH: "Component Search",

	// Documentation Events
	COPY_CODE_BLOCK: "Copy Code Block",
	VIEW_API_REFERENCE: "View API Reference",
} as const;

// Helper function to convert event name to Plausible class
export const asPlausibleClass = (eventName: string): string => {
	const encoded = encodeURIComponent(eventName).replace(/%20/g, "+");
	return `plausible-event-name=${encoded}`;
};

// CSS Class Names for auto-tracking (plausible-event-name)
export const TRACKING_CLASSES = {
	// Component Events
	COMPONENT_CODE_COPY: asPlausibleClass(TRACKING_EVENTS.COMPONENT_CODE_COPY),
	COMPONENT_DOCS_MODAL_OPEN: asPlausibleClass(
		TRACKING_EVENTS.COMPONENT_DOCS_MODAL_OPEN,
	),

	// Installation
	INSTALL_COMMAND_COPY: asPlausibleClass(TRACKING_EVENTS.INSTALL_COMMAND_COPY),

	// External Tools
	OPEN_IN_V0: asPlausibleClass(TRACKING_EVENTS.OPEN_IN_V0),
	OPEN_IN_KIT: asPlausibleClass(TRACKING_EVENTS.OPEN_IN_KIT),

	// Navigation
	PATTERN_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_LINK_CLICK),
	GITHUB_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.GITHUB_LINK_CLICK),
	MAIN_SITE_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.MAIN_SITE_LINK_CLICK),

	// Documentation
	COPY_CODE_BLOCK: asPlausibleClass(TRACKING_EVENTS.COPY_CODE_BLOCK),
} as const;

// Type for Plausible tracking function
type EventName = (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];
export type PlausibleTracker = (
	event: EventName | string,
	options?: { props?: Record<string, string | number> },
) => void;

// Helper function to track component interactions
export const trackComponentEvent = (
	plausible: PlausibleTracker,
	action: "code_copy" | "docs_open" | "variant_view" | "tab_switch",
	componentName: string,
	additionalProps?: Record<string, string | number>,
) => {
	const eventMap = {
		code_copy: TRACKING_EVENTS.COMPONENT_CODE_COPY,
		docs_open: TRACKING_EVENTS.COMPONENT_DOCS_MODAL_OPEN,
		variant_view: TRACKING_EVENTS.COMPONENT_VARIANT_VIEW,
		tab_switch: TRACKING_EVENTS.COMPONENT_TAB_SWITCH,
	};

	plausible(eventMap[action], {
		props: {
			component_name: componentName,
			...additionalProps,
		},
	});
};

// Helper function to track installation events
export const trackInstallEvent = (
	plausible: PlausibleTracker,
	packageManager: "pnpm" | "npm" | "yarn" | "bun",
	componentName: string,
) => {
	plausible(TRACKING_EVENTS.INSTALL_COMMAND_COPY, {
		props: {
			package_manager: packageManager,
			component_name: componentName,
		},
	});
};

// Helper function to track external tool clicks
export const trackExternalToolClick = (
	plausible: PlausibleTracker,
	tool: "v0" | "kit",
	componentName: string,
) => {
	const eventName =
		tool === "v0" ? TRACKING_EVENTS.OPEN_IN_V0 : TRACKING_EVENTS.OPEN_IN_KIT;

	plausible(eventName, {
		props: {
			component_name: componentName,
		},
	});
};

// Helper function to track navigation events
export const trackNavigationEvent = (
	plausible: PlausibleTracker,
	type: "pattern" | "github" | "main_site",
	url: string,
	label?: string,
) => {
	const eventMap = {
		pattern: TRACKING_EVENTS.PATTERN_LINK_CLICK,
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

// Helper function to track code block copies
export const trackCodeBlockCopy = (
	plausible: PlausibleTracker,
	language: string,
	componentContext?: string,
) => {
	plausible(TRACKING_EVENTS.COPY_CODE_BLOCK, {
		props: {
			language,
			...(componentContext && { component: componentContext }),
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
