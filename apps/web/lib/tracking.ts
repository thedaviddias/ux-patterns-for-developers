/**
 * Web app tracking utilities
 * Uses shared tracking package for common events, adds web-specific ones
 */

import { track } from "@ux-patterns/analytics/track";
import { SHARED_TRACKING_EVENTS } from "@ux-patterns/tracking/events";

// Web app tracking events (shared + web-specific)
export const TRACKING_EVENTS = {
	// Import shared events
	...SHARED_TRACKING_EVENTS,

	// Web-specific navigation events
	SUGGEST_PATTERN_CLICK: "Suggest Pattern Click",
	BROWSE_PATTERNS_CLICK: "Browse Patterns Click",
	VIEW_GITHUB_CLICK: "View GitHub Click",

	// Sandbox Events
	SANDBOX_TAB_SWITCH: "Sandbox Tab Switch",
	SANDBOX_CODE_EDIT: "Sandbox Code Edit",

	// Decision Flow Events
	DECISION_FLOW_DOWNLOAD: "Decision Flow Download",

	// External Links
	CANIUSE_LINK_CLICK: "CanIUse Link Click",

	// Search Events
	SEARCH_OPEN: "Search Open",
	SEARCH_QUERY: "Search Query",
	SEARCH_RESULT_CLICK: "Search Result Click",

	// Text-to-Social Events
	TEXT_TO_SOCIAL_POPOVER_SHOWN: "Text to Social Popover Shown",
	TEXT_TO_SOCIAL_BUTTON_CLICK: "Text to Social Button Click",
	TEXT_TO_SOCIAL_IMAGE_GENERATED: "Text to Social Image Generated",
	TEXT_TO_SOCIAL_IMAGE_DOWNLOAD: "Text to Social Image Download",

	// Checklist Download Events
	CHECKLIST_DOWNLOAD_CLICK: "Checklist Download Click",
	CHECKLIST_DOWNLOAD_SUCCESS: "Checklist Download Success",
	CHECKLIST_DOWNLOAD_ERROR: "Checklist Download Error",
} as const;

// Import shared helpers
import { trackNewsletterEvent as sharedTrackNewsletterEvent } from "@ux-patterns/tracking/helpers";

// Re-export shared utilities
export { trackGitHubStarClick } from "@ux-patterns/tracking/helpers";

export const trackNewsletterEvent = (
	type: "success" | "error",
	variant: "default" | "inline" = "default",
) => {
	sharedTrackNewsletterEvent(type, variant);
};

export const trackFooterClick = (
	linkType: "general" | "resource" | "social",
	linkLabel: string,
) => {
	const eventName =
		linkType === "social"
			? TRACKING_EVENTS.FOOTER_SOCIAL_CLICK
			: TRACKING_EVENTS.FOOTER_LINK_CLICK;

	track(eventName, {
		link_type: linkType,
		link_label: linkLabel,
	});
};

// Helper function to track sandbox interactions
export const trackSandboxEvent = (
	action: "tab_switch" | "code_edit",
	tabName?: string,
	additionalProps?: Record<string, string | number>,
) => {
	if (action === "tab_switch" && tabName) {
		track(TRACKING_EVENTS.SANDBOX_TAB_SWITCH, { tab_name: tabName });
	} else if (action === "code_edit") {
		const props: Record<string, string | number> = {};
		if (tabName) {
			props.tab_name = tabName;
		}
		if (additionalProps) {
			Object.assign(props, additionalProps);
		}
		track(TRACKING_EVENTS.SANDBOX_CODE_EDIT, props);
	}
};

// Helper function to track external link clicks
export const trackExternalLink = (
	linkType: "caniuse" | "github" | "social",
	url: string,
) => {
	switch (linkType) {
		case "caniuse":
			track(TRACKING_EVENTS.CANIUSE_LINK_CLICK, { url });
			break;
		case "github":
			track(TRACKING_EVENTS.VIEW_GITHUB_CLICK, { url });
			break;
		case "social":
			track(TRACKING_EVENTS.FOOTER_SOCIAL_CLICK, { url });
			break;
		default: {
			const _exhaustiveCheck: never = linkType;
			return _exhaustiveCheck;
		}
	}
};

// Helper function to track text-to-social events
export const trackTextToSocialEvent = (
	action:
		| "popover_shown"
		| "image_generated"
		| "image_download"
		| "button_clicked",
	options?: {
		platform?: "twitter" | "linkedin";
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
			track(TRACKING_EVENTS.TEXT_TO_SOCIAL_POPOVER_SHOWN, props);
			break;
		case "image_generated":
			track(TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_GENERATED, props);
			break;
		case "image_download":
			track(TRACKING_EVENTS.TEXT_TO_SOCIAL_IMAGE_DOWNLOAD, props);
			break;
		case "button_clicked":
			track(TRACKING_EVENTS.TEXT_TO_SOCIAL_BUTTON_CLICK, props);
			break;
		default: {
			const _exhaustiveCheck: never = action;
			return _exhaustiveCheck;
		}
	}
};

// Helper function to track search events
export const trackSearchEvent = (
	action: "open" | "query" | "result_click",
	options?: {
		query?: string;
		resultsCount?: number;
		resultTitle?: string;
		resultType?: string;
		resultPosition?: number;
		resultUrl?: string;
	},
) => {
	switch (action) {
		case "open":
			track(TRACKING_EVENTS.SEARCH_OPEN);
			break;
		case "query":
			if (options?.query) {
				const props: Record<string, string | number> = {
					query: options.query.toLowerCase(),
					query_length: options.query.length,
				};
				if (typeof options.resultsCount === "number") {
					props.results_count = options.resultsCount;
				}
				track(TRACKING_EVENTS.SEARCH_QUERY, props);
			}
			break;
		case "result_click":
			if (options?.resultTitle) {
				const props: Record<string, string | number> = {
					result_title: options.resultTitle,
				};
				if (options.resultType) props.result_type = options.resultType;
				if (typeof options.resultPosition === "number") {
					props.result_position = options.resultPosition;
				}
				if (options.resultUrl) props.result_url = options.resultUrl;
				if (options.query) props.query = options.query.toLowerCase();
				track(TRACKING_EVENTS.SEARCH_RESULT_CLICK, props);
			}
			break;
		default: {
			const _exhaustiveCheck: never = action;
			return _exhaustiveCheck;
		}
	}
};
