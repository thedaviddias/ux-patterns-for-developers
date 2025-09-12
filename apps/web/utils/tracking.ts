/**
 * Web app tracking utilities
 * Uses shared tracking package for common events, adds web-specific ones
 */

import { SHARED_TRACKING_EVENTS } from "@ux-patterns/tracking/events";

// Web app tracking events (shared + web-specific)
export const TRACKING_EVENTS = {
	// Import shared events
	...SHARED_TRACKING_EVENTS,

	// Web-specific navigation events
	SUGGEST_PATTERN_CLICK: "Suggest Pattern Click",
	VIEW_PATTERN_CLICK: "View Pattern Click",
	GET_STARTED_CLICK: "Get Started Click",
	VIEW_GITHUB_CLICK: "View GitHub Click",
	PATTERN_GUIDE_CLICK: "Pattern Guide Click",
	EXPLORE_UI_KIT_CLICK: "Explore UI Kit Click",

	// Sandbox Events
	SANDBOX_TAB_SWITCH: "Sandbox Tab Switch",
	SANDBOX_CODE_EDIT: "Sandbox Code Edit",

	// Decision Flow Events
	DECISION_FLOW_DOWNLOAD: "Decision Flow Download",

	// External Links
	CANIUSE_LINK_CLICK: "CanIUse Link Click",

	// Pattern Navigation
	PATTERN_NEXT_CLICK: "Pattern Next Click",
	PATTERN_PREV_CLICK: "Pattern Previous Click",

	// Text-to-Social Events
	TEXT_TO_SOCIAL_POPOVER_SHOWN: "Text to Social Popover Shown",
	TEXT_TO_SOCIAL_IMAGE_GENERATED: "Text to Social Image Generated",
	TEXT_TO_SOCIAL_IMAGE_DOWNLOAD: "Text to Social Image Download",
} as const;

// Import shared helpers
import {
	asPlausibleClass,
	getNewsletterTrackingClasses,
	trackFooterClick as sharedTrackFooterClick,
	trackNewsletterEvent as sharedTrackNewsletterEvent,
} from "@ux-patterns/tracking/helpers";

import type { PlausibleTracker } from "@ux-patterns/tracking/types";

// Re-export shared utilities
export {
	asPlausibleClass,
	trackGitHubStarClick,
} from "@ux-patterns/tracking/helpers";
export type { PlausibleTracker } from "@ux-patterns/tracking/types";

// CSS Class Names for auto-tracking (plausible-event-name)
export const TRACKING_CLASSES = {
	// Newsletter
	NEWSLETTER_INPUT_FOCUS: asPlausibleClass(
		TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS,
	),
	NEWSLETTER_INLINE_INPUT_FOCUS: asPlausibleClass(
		TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS,
	),
	NEWSLETTER_BUTTON_CLICK: asPlausibleClass(
		TRACKING_EVENTS.NEWSLETTER_BUTTON_CLICK,
	),
	NEWSLETTER_INLINE_BUTTON_CLICK: asPlausibleClass(
		TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK,
	),

	// Navigation
	GITHUB_STAR_CLICK: asPlausibleClass(TRACKING_EVENTS.GITHUB_STAR_CLICK),
	SUGGEST_PATTERN_CLICK: asPlausibleClass(
		TRACKING_EVENTS.SUGGEST_PATTERN_CLICK,
	),
	VIEW_PATTERN_CLICK: asPlausibleClass(TRACKING_EVENTS.VIEW_PATTERN_CLICK),
	GET_STARTED_CLICK: asPlausibleClass(TRACKING_EVENTS.GET_STARTED_CLICK),
	VIEW_GITHUB_CLICK: asPlausibleClass(TRACKING_EVENTS.VIEW_GITHUB_CLICK),
	PATTERN_GUIDE_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_GUIDE_CLICK),
	EXPLORE_UI_KIT_CLICK: asPlausibleClass(TRACKING_EVENTS.EXPLORE_UI_KIT_CLICK),

	// Footer
	FOOTER_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.FOOTER_LINK_CLICK),
	FOOTER_SOCIAL_CLICK: asPlausibleClass(TRACKING_EVENTS.FOOTER_SOCIAL_CLICK),

	// Sandbox
	SANDBOX_TAB_SWITCH: asPlausibleClass(TRACKING_EVENTS.SANDBOX_TAB_SWITCH),

	// Decision Flow
	DECISION_FLOW_DOWNLOAD: asPlausibleClass(
		TRACKING_EVENTS.DECISION_FLOW_DOWNLOAD,
	),

	// External Links
	CANIUSE_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.CANIUSE_LINK_CLICK),

	// Pattern Navigation
	PATTERN_NEXT_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_NEXT_CLICK),
	PATTERN_PREV_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_PREV_CLICK),

	// Text-to-Social
	TEXT_TO_SOCIAL_POPOVER_SHOWN: asPlausibleClass(
		TRACKING_EVENTS.TEXT_TO_SOCIAL_POPOVER_SHOWN,
	),
	TEXT_TO_SOCIAL_IMAGE_GENERATED: asPlausibleClass(
		TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_GENERATED,
	),
	TEXT_TO_SOCIAL_IMAGE_DOWNLOAD: asPlausibleClass(
		TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_DOWNLOAD,
	),
} as const;

// Use shared helper functions with web app API compatibility
export const trackNewsletterEvent = (
	plausible: PlausibleTracker,
	type: "success" | "error",
	variant: "default" | "inline" = "default",
) => {
	sharedTrackNewsletterEvent(plausible, type, variant);
};

export const trackFooterClick = (
	plausible: PlausibleTracker,
	linkType: "general" | "resource" | "social",
	linkLabel: string,
) => {
	sharedTrackFooterClick(plausible, linkType, linkLabel);
};

// Helper function to track sandbox interactions
export const trackSandboxEvent = (
	plausible: PlausibleTracker,
	action: "tab_switch" | "code_edit",
	tabName?: string,
	additionalProps?: Record<string, string | number>,
) => {
	if (action === "tab_switch" && tabName) {
		plausible(TRACKING_EVENTS.SANDBOX_TAB_SWITCH, {
			props: { tab_name: tabName },
		});
	} else if (action === "code_edit") {
		const props: Record<string, string | number> = {};
		if (tabName) {
			props.tab_name = tabName;
		}
		if (additionalProps) {
			Object.assign(props, additionalProps);
		}
		plausible(TRACKING_EVENTS.SANDBOX_CODE_EDIT, {
			props,
		});
	}
};

// Helper function to track external link clicks
export const trackExternalLink = (
	plausible: PlausibleTracker,
	linkType: "caniuse" | "github" | "social",
	url: string,
) => {
	switch (linkType) {
		case "caniuse":
			plausible(TRACKING_EVENTS.CANIUSE_LINK_CLICK, {
				props: { url },
			});
			break;
		case "github":
			plausible(TRACKING_EVENTS.VIEW_GITHUB_CLICK, {
				props: { url },
			});
			break;
		case "social":
			plausible(TRACKING_EVENTS.FOOTER_SOCIAL_CLICK, {
				props: { url },
			});
			break;
	}
};

// Legacy aliases for backward compatibility with existing dashboard queries
export const LEGACY_EVENTS = {
	NEWSLETTER_INPUT_FOCUS_INLINE: TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS,
	NEWSLETTER_BUTTON_CLICK_INLINE:
		TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK,
	// Navigation aliases for backward compatibility
	"View Pattern": TRACKING_EVENTS.VIEW_PATTERN_CLICK,
	"Get Started": TRACKING_EVENTS.GET_STARTED_CLICK,
	"View GitHub": TRACKING_EVENTS.VIEW_GITHUB_CLICK,
	"Star Github": TRACKING_EVENTS.GITHUB_STAR_CLICK,
	"Suggest Pattern": TRACKING_EVENTS.SUGGEST_PATTERN_CLICK,
} as const;

// Helper function to track text-to-social events
export const trackTextToSocialEvent = (
	plausible: PlausibleTracker,
	action: "popover_shown" | "image_generated" | "image_download",
	options?: {
		platform?: "instagram" | "twitter" | "linkedin";
		textLength?: number;
		patternName?: string;
	},
) => {
	const props: Record<string, string | number> = {};

	if (options?.platform) {
		props.platform = options.platform;
	}

	if (typeof options?.textLength === "number") {
		// Categorize text length into ranges
		if (options.textLength <= 10) {
			props.text_length_range = "0-10";
		} else if (options.textLength <= 50) {
			props.text_length_range = "11-50";
		} else if (options.textLength <= 150) {
			props.text_length_range = "51-150";
		} else {
			props.text_length_range = "151-500";
		}
		props.text_length = options.textLength;
	}

	if (options?.patternName) {
		props.pattern_name = options.patternName;
	}

	switch (action) {
		case "popover_shown":
			plausible(TRACKING_EVENTS.TEXT_TO_SOCIAL_POPOVER_SHOWN, { props });
			break;
		case "image_generated":
			plausible(TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_GENERATED, { props });
			break;
		case "image_download":
			plausible(TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_DOWNLOAD, { props });
			break;
	}
};

// Helper function to get CSS class for tracking - use shared implementation
export const getTrackingClass = (variant?: "default" | "inline") => {
	return getNewsletterTrackingClasses(variant);
};
