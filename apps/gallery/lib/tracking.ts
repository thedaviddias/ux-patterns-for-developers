/**
 * Gallery-specific tracking utilities
 * Uses shared tracking package for common events, adds gallery-specific ones
 */

import { SHARED_TRACKING_EVENTS } from "@ux-patterns/tracking/events";

// Gallery-specific events (in addition to shared ones)
export const GALLERY_TRACKING_EVENTS = {
	// Import shared events
	...SHARED_TRACKING_EVENTS,

	// Gallery-specific events
	GALLERY_SEARCH_OPEN: "Gallery Search Open",
	GALLERY_SEARCH_QUERY: "Gallery Search Query",
	GALLERY_FILTER_CHANGE: "Gallery Filter Change",
	GALLERY_PATTERN_VIEW: "Gallery Pattern View",
	GALLERY_IMAGE_MODAL_OPEN: "Gallery Image Modal Open",
	GALLERY_SHARE_CLICK: "Gallery Share Click",
	GALLERY_ENTRY_CLICK: "Gallery Entry Click",
} as const;

// Import shared helpers and types
import {
	asPlausibleClass,
	getSharedTrackingClasses,
	trackComponentPageView as sharedTrackComponentPageView,
	trackFooterClick as sharedTrackFooterClick,
	trackNavigationEvent as sharedTrackNavigationEvent,
} from "@ux-patterns/tracking/helpers";

import type { PlausibleTracker } from "@ux-patterns/tracking/types";

// Export shared functions with same names for backward compatibility
export {
	asPlausibleClass,
	trackComponentSearch,
	trackGitHubStarClick,
} from "@ux-patterns/tracking/helpers";
export type { PlausibleTracker } from "@ux-patterns/tracking/types";

// Wrapper functions that use shared helpers but maintain gallery API
export const trackNavigationEvent = (
	plausible: PlausibleTracker,
	type: "github" | "main_site",
	url: string,
	label?: string,
) => {
	sharedTrackNavigationEvent(plausible, type, url, label);
};

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
	sharedTrackFooterClick(plausible, linkType, linkLabel);
};

// CSS Classes - combine shared + gallery-specific
const sharedClasses = getSharedTrackingClasses();
export const TRACKING_CLASSES = {
	...sharedClasses,

	// Gallery-specific CSS classes
	GALLERY_SEARCH_OPEN: asPlausibleClass(
		GALLERY_TRACKING_EVENTS.GALLERY_SEARCH_OPEN,
	),
	GALLERY_SHARE_CLICK: asPlausibleClass(
		GALLERY_TRACKING_EVENTS.GALLERY_SHARE_CLICK,
	),
	GALLERY_ENTRY_CLICK: asPlausibleClass(
		GALLERY_TRACKING_EVENTS.GALLERY_ENTRY_CLICK,
	),
} as const;

// Helper function to track gallery-specific search events
export const trackGallerySearch = (
	plausible: PlausibleTracker,
	action: "open" | "query",
	query?: string,
	resultsCount?: number,
) => {
	if (action === "open") {
		plausible(GALLERY_TRACKING_EVENTS.GALLERY_SEARCH_OPEN);
	} else if (action === "query" && query) {
		plausible(GALLERY_TRACKING_EVENTS.GALLERY_SEARCH_QUERY, {
			props: {
				query: query.toLowerCase(),
				query_length: query.length,
				...(typeof resultsCount === "number" && {
					results_count: resultsCount,
				}),
			},
		});
	}
};

// Helper function to track gallery interactions
export const trackGalleryEvent = (
	plausible: PlausibleTracker,
	action: "pattern_view" | "filter_change" | "image_modal_open" | "entry_click",
	data?: {
		patternName?: string;
		filterType?: string;
		filterValue?: string;
		entryId?: string;
		platform?: string;
	},
) => {
	const eventMap = {
		pattern_view: GALLERY_TRACKING_EVENTS.GALLERY_PATTERN_VIEW,
		filter_change: GALLERY_TRACKING_EVENTS.GALLERY_FILTER_CHANGE,
		image_modal_open: GALLERY_TRACKING_EVENTS.GALLERY_IMAGE_MODAL_OPEN,
		entry_click: GALLERY_TRACKING_EVENTS.GALLERY_ENTRY_CLICK,
	};

	const props: Record<string, string | number> = {};

	if (data?.patternName) props.pattern_name = data.patternName;
	if (data?.filterType) props.filter_type = data.filterType;
	if (data?.filterValue) props.filter_value = data.filterValue;
	if (data?.entryId) props.entry_id = data.entryId;
	if (data?.platform) props.platform = data.platform;

	plausible(eventMap[action], { props });
};

// Helper function to track share events
export const trackShareEvent = (
	plausible: PlausibleTracker,
	shareType: "native" | "clipboard",
	context?: {
		pageType?: "pattern" | "entry" | "website";
		patternName?: string;
	},
) => {
	plausible(GALLERY_TRACKING_EVENTS.GALLERY_SHARE_CLICK, {
		props: {
			share_type: shareType,
			...(context?.pageType && { page_type: context.pageType }),
			...(context?.patternName && { pattern_name: context.patternName }),
		},
	});
};
