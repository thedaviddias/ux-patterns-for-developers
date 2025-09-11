/**
 * Shared tracking helper functions
 * These helpers ensure consistent event tracking across all apps
 */

import { SHARED_TRACKING_EVENTS } from "./events";
import type {
	FooterLinkType,
	NavigationType,
	NewsletterEventType,
	NewsletterVariant,
	PlausibleTracker,
} from "./types";

// Helper function to convert event name to Plausible class
export const asPlausibleClass = (eventName: string): string => {
	const encoded = encodeURIComponent(eventName).replace(/%20/g, "+");
	return `plausible-event-name=${encoded}`;
};

// Helper function to track footer clicks - standardized across all apps
export const trackFooterClick = (
	plausible: PlausibleTracker,
	linkType: FooterLinkType,
	linkLabel: string,
) => {
	const eventName =
		linkType === "social"
			? SHARED_TRACKING_EVENTS.FOOTER_SOCIAL_CLICK
			: SHARED_TRACKING_EVENTS.FOOTER_LINK_CLICK;

	plausible(eventName, {
		props: {
			link_type: linkType,
			link_label: linkLabel,
		},
	});
};

// Helper function to track navigation events - standardized across all apps
export const trackNavigationEvent = (
	plausible: PlausibleTracker,
	type: NavigationType,
	url: string,
	label?: string,
) => {
	const eventMap = {
		github: SHARED_TRACKING_EVENTS.GITHUB_LINK_CLICK,
		main_site: SHARED_TRACKING_EVENTS.MAIN_SITE_LINK_CLICK,
		pattern: SHARED_TRACKING_EVENTS.PATTERN_LINK_CLICK,
	};

	plausible(eventMap[type], {
		props: {
			url,
			...(label && { label }),
		},
	});
};

// Helper function to track newsletter events - standardized across all apps
export const trackNewsletterEvent = (
	plausible: PlausibleTracker,
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

	plausible(
		SHARED_TRACKING_EVENTS[eventKey as keyof typeof SHARED_TRACKING_EVENTS],
	);
};

// Helper function to track GitHub star clicks - standardized across all apps
export const trackGitHubStarClick = (plausible: PlausibleTracker) => {
	plausible(SHARED_TRACKING_EVENTS.GITHUB_STAR_CLICK);
};

// Helper function to track component page views - standardized across all apps
export const trackComponentPageView = (
	plausible: PlausibleTracker,
	componentName: string,
) => {
	plausible(SHARED_TRACKING_EVENTS.COMPONENT_PAGE_VIEW, {
		props: {
			component_name: componentName,
		},
	});
};

// Helper function to track component search - standardized across all apps
export const trackComponentSearch = (
	plausible: PlausibleTracker,
	searchTerm: string,
	resultsCount?: number,
) => {
	const props: Record<string, string | number> = {
		search_term: searchTerm,
	};

	if (typeof resultsCount === "number") {
		props.results_count = resultsCount;
	}

	plausible(SHARED_TRACKING_EVENTS.COMPONENT_SEARCH, { props });
};

// Helper function to get CSS classes for auto-tracking
export const getSharedTrackingClasses = () => ({
	GITHUB_LINK_CLICK: asPlausibleClass(SHARED_TRACKING_EVENTS.GITHUB_LINK_CLICK),
	GITHUB_STAR_CLICK: asPlausibleClass(SHARED_TRACKING_EVENTS.GITHUB_STAR_CLICK),
	MAIN_SITE_LINK_CLICK: asPlausibleClass(
		SHARED_TRACKING_EVENTS.MAIN_SITE_LINK_CLICK,
	),
	FOOTER_LINK_CLICK: asPlausibleClass(SHARED_TRACKING_EVENTS.FOOTER_LINK_CLICK),
	FOOTER_SOCIAL_CLICK: asPlausibleClass(
		SHARED_TRACKING_EVENTS.FOOTER_SOCIAL_CLICK,
	),
	NEWSLETTER_INPUT_FOCUS: asPlausibleClass(
		SHARED_TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS,
	),
	NEWSLETTER_INLINE_INPUT_FOCUS: asPlausibleClass(
		SHARED_TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS,
	),
	NEWSLETTER_BUTTON_CLICK: asPlausibleClass(
		SHARED_TRACKING_EVENTS.NEWSLETTER_BUTTON_CLICK,
	),
	NEWSLETTER_INLINE_BUTTON_CLICK: asPlausibleClass(
		SHARED_TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK,
	),
	PATTERN_LINK_CLICK: asPlausibleClass(
		SHARED_TRACKING_EVENTS.PATTERN_LINK_CLICK,
	),
});

// Helper function to get newsletter CSS classes with variant support
export const getNewsletterTrackingClasses = (variant?: NewsletterVariant) => ({
	newsletterInputFocus:
		variant === "inline"
			? asPlausibleClass(SHARED_TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS)
			: asPlausibleClass(SHARED_TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS),

	newsletterButtonClick:
		variant === "inline"
			? asPlausibleClass(SHARED_TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK)
			: asPlausibleClass(SHARED_TRACKING_EVENTS.NEWSLETTER_BUTTON_CLICK),
});
