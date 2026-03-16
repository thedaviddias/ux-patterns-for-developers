/**
 * Shared tracking helper functions
 * These helpers ensure consistent event tracking across all apps
 */

import { track } from "@ux-patterns/analytics/track";

import { SHARED_TRACKING_EVENTS } from "./events";
import type {
	FooterLinkType,
	NavigationType,
	NewsletterEventType,
	NewsletterVariant,
} from "./types";

// Helper function to track footer clicks - standardized across all apps
export const trackFooterClick = (
	linkType: FooterLinkType,
	linkLabel: string,
) => {
	const eventName =
		linkType === "social"
			? SHARED_TRACKING_EVENTS.FOOTER_SOCIAL_CLICK
			: SHARED_TRACKING_EVENTS.FOOTER_LINK_CLICK;

	track(eventName, {
		link_type: linkType,
		link_label: linkLabel,
	});
};

// Helper function to track navigation events - standardized across all apps
export const trackNavigationEvent = (
	type: NavigationType,
	url: string,
	label?: string,
) => {
	const eventMap = {
		github: SHARED_TRACKING_EVENTS.GITHUB_LINK_CLICK,
		main_site: SHARED_TRACKING_EVENTS.MAIN_SITE_LINK_CLICK,
		pattern: SHARED_TRACKING_EVENTS.PATTERN_LINK_CLICK,
	};

	track(eventMap[type], {
		url,
		...(label && { label }),
	});
};

// Helper function to track newsletter events - standardized across all apps
export const trackNewsletterEvent = (
	type: NewsletterEventType,
	variant: NewsletterVariant = "default",
) => {
	const eventKey =
		variant === "inline"
			? type === "success"
				? "NEWSLETTER_SUBSCRIBE_SUCCESS_INLINE"
				: "NEWSLETTER_SUBSCRIBE_ERROR_INLINE"
			: type === "success"
				? "NEWSLETTER_SUBSCRIBE_SUCCESS"
				: "NEWSLETTER_SUBSCRIBE_ERROR";

	track(
		SHARED_TRACKING_EVENTS[eventKey as keyof typeof SHARED_TRACKING_EVENTS],
	);
};

// Helper function to track GitHub star clicks - standardized across all apps
export const trackGitHubStarClick = () => {
	track(SHARED_TRACKING_EVENTS.GITHUB_STAR_CLICK);
};

// Helper function to track component page views - standardized across all apps
export const trackComponentPageView = (componentName: string) => {
	track(SHARED_TRACKING_EVENTS.COMPONENT_PAGE_VIEW, {
		component_name: componentName,
	});
};

// Helper function to track component search - standardized across all apps
export const trackComponentSearch = (
	searchTerm: string,
	resultsCount?: number,
) => {
	const props: Record<string, string | number> = {
		search_term: searchTerm,
	};

	if (typeof resultsCount === "number") {
		props.results_count = resultsCount;
	}

	track(SHARED_TRACKING_EVENTS.COMPONENT_SEARCH, props);
};

// Helper function to track docs feedback - standardized across all apps
export const trackDocsFeedback = (
	opinion: "good" | "bad",
	url: string,
	message?: string,
) => {
	const eventName =
		opinion === "good"
			? SHARED_TRACKING_EVENTS.DOCS_FEEDBACK_GOOD
			: SHARED_TRACKING_EVENTS.DOCS_FEEDBACK_BAD;

	const props: Record<string, string | number> = {
		url,
	};

	if (message) {
		props.message_length = message.length;
	}

	track(eventName, props);
};
