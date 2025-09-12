/**
 * Kit app tracking utilities
 * Uses shared tracking package for common events, adds kit-specific ones
 */

import { SHARED_TRACKING_EVENTS } from "@ux-patterns/tracking/events";

// Kit app tracking events (shared + kit-specific)
export const TRACKING_EVENTS = {
	// Import shared events
	...SHARED_TRACKING_EVENTS,

	// Kit-specific component events
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

	// Documentation Events
	COPY_CODE_BLOCK: "Copy Code Block",
	VIEW_API_REFERENCE: "View API Reference",

	GET_STARTED_CLICK: "Get Started Click",
	VIEW_COMPONENT_CLICK: "View Component Click",

	// Footer Events
	FOOTER_LINK_CLICK: "Footer Link Click",
	FOOTER_SOCIAL_CLICK: "Footer Social Click",
} as const;

// Import shared helpers and types
import {
	asPlausibleClass,
	getSharedTrackingClasses,
	trackComponentPageView as sharedTrackComponentPageView,
	trackNavigationEvent as sharedTrackNavigationEvent,
} from "@ux-patterns/tracking/helpers";

import type { PlausibleTracker } from "@ux-patterns/tracking/types";

// Re-export shared utilities
export { asPlausibleClass } from "@ux-patterns/tracking/helpers";
export type { PlausibleTracker } from "@ux-patterns/tracking/types";

// CSS Class Names - combine shared + kit-specific
const sharedClasses = getSharedTrackingClasses();
export const TRACKING_CLASSES = {
	...sharedClasses,

	// Kit-specific CSS classes
	COMPONENT_CODE_COPY: asPlausibleClass(TRACKING_EVENTS.COMPONENT_CODE_COPY),
	COMPONENT_DOCS_MODAL_OPEN: asPlausibleClass(
		TRACKING_EVENTS.COMPONENT_DOCS_MODAL_OPEN,
	),
	INSTALL_COMMAND_COPY: asPlausibleClass(TRACKING_EVENTS.INSTALL_COMMAND_COPY),
	OPEN_IN_V0: asPlausibleClass(TRACKING_EVENTS.OPEN_IN_V0),
	OPEN_IN_KIT: asPlausibleClass(TRACKING_EVENTS.OPEN_IN_KIT),
	COPY_CODE_BLOCK: asPlausibleClass(TRACKING_EVENTS.COPY_CODE_BLOCK),

	GET_STARTED_CLICK: asPlausibleClass(TRACKING_EVENTS.GET_STARTED_CLICK),
	VIEW_COMPONENT_CLICK: asPlausibleClass(TRACKING_EVENTS.VIEW_COMPONENT_CLICK),
} as const;

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

// Use shared navigation tracking
export const trackNavigationEvent = (
	plausible: PlausibleTracker,
	type: "pattern" | "github" | "main_site",
	url: string,
	label?: string,
) => {
	sharedTrackNavigationEvent(plausible, type, url, label);
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

// Use shared component page view tracking
export const trackComponentPageView = (
	plausible: PlausibleTracker,
	componentName: string,
) => {
	sharedTrackComponentPageView(plausible, componentName);
};

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
