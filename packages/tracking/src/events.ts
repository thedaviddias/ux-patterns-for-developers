/**
 * Shared tracking events for UX Patterns monorepo
 * These events are used across web, kit, and gallery apps for consistency
 */

// Shared Events - Common across all apps
export const SHARED_TRACKING_EVENTS = {
	// Navigation Events - Common across all apps
	GITHUB_LINK_CLICK: "GitHub Link Click",
	GITHUB_STAR_CLICK: "GitHub Star Click",
	MAIN_SITE_LINK_CLICK: "Main Site Link Click",

	// Footer Events - Common across all apps
	FOOTER_LINK_CLICK: "Footer Link Click",
	FOOTER_SOCIAL_CLICK: "Footer Social Click",

	// Newsletter Events - Common where newsletter exists
	NEWSLETTER_SUBSCRIBE_SUCCESS: "Newsletter Subscribe Success",
	NEWSLETTER_SUBSCRIBE_SUCCESS_INLINE: "Newsletter Subscribe Success Inline",
	NEWSLETTER_SUBSCRIBE_ERROR: "Newsletter Subscribe Error",
	NEWSLETTER_SUBSCRIBE_ERROR_INLINE: "Newsletter Subscribe Error Inline",
	NEWSLETTER_INPUT_FOCUS: "Newsletter Input Focus",
	NEWSLETTER_INLINE_INPUT_FOCUS: "Newsletter Inline Input Focus",
	NEWSLETTER_BUTTON_CLICK: "Newsletter Button Click",
	NEWSLETTER_INLINE_BUTTON_CLICK: "Newsletter Inline Button Click",

	// Component/Pattern Navigation - Common across apps
	COMPONENT_PAGE_VIEW: "Component Page View",
	COMPONENT_SEARCH: "Component Search",
	PATTERN_LINK_CLICK: "Pattern Link Click",

	// Feedback Events - Common across apps
	DOCS_FEEDBACK_GOOD: "Docs Feedback Good",
	DOCS_FEEDBACK_BAD: "Docs Feedback Bad",
} as const;

// App-specific event types for type safety
export type SharedEventName =
	(typeof SHARED_TRACKING_EVENTS)[keyof typeof SHARED_TRACKING_EVENTS];
