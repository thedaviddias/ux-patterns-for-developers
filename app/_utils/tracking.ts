/**
 * Centralized Plausible tracking utilities
 * This file contains all event names and tracking functions for consistent analytics
 */

// Event Names - Centralized list of all tracked events
export const TRACKING_EVENTS = {
  // Newsletter Events
  NEWSLETTER_SUBSCRIBE_SUCCESS: 'Newsletter Subscribe Success',
  NEWSLETTER_SUBSCRIBE_SUCCESS_INLINE: 'Newsletter Subscribe Success Inline',
  NEWSLETTER_SUBSCRIBE_ERROR: 'Newsletter Subscribe Error',
  NEWSLETTER_SUBSCRIBE_ERROR_INLINE: 'Newsletter Subscribe Error Inline',
  NEWSLETTER_INLINE_INPUT_FOCUS: 'Newsletter Inline Input Focus',
  NEWSLETTER_INPUT_FOCUS: 'Newsletter Input Focus',
  NEWSLETTER_INLINE_BUTTON_CLICK: 'Newsletter Inline Button Click',
  NEWSLETTER_BUTTON_CLICK: 'Newsletter Button Click',

  // Navigation Events
  GITHUB_STAR_CLICK: 'GitHub Star Click',
  SUGGEST_PATTERN_CLICK: 'Suggest Pattern Click',
  VIEW_PATTERN_CLICK: 'View Pattern Click',
  GET_STARTED_CLICK: 'Get Started Click',
  VIEW_GITHUB_CLICK: 'View GitHub Click',

  // Footer Events
  FOOTER_LINK_CLICK: 'Footer Link Click',
  FOOTER_SOCIAL_CLICK: 'Footer Social Click',

  // Sandbox Events
  SANDBOX_TAB_SWITCH: 'Sandbox Tab Switch',
  SANDBOX_CODE_EDIT: 'Sandbox Code Edit',

  // Decision Flow Events
  DECISION_FLOW_DOWNLOAD: 'Decision Flow Download',

  // External Links
  CANIUSE_LINK_CLICK: 'CanIUse Link Click',

  // Pattern Navigation
  PATTERN_NEXT_CLICK: 'Pattern Next Click',
  PATTERN_PREV_CLICK: 'Pattern Previous Click',
} as const;

// Helper function to convert event name to Plausible class
export const asPlausibleClass = (eventName: string): string => {
  return `plausible-event-name=${eventName.replace(/\s+/g, '+')}`;
};

// CSS Class Names for auto-tracking (plausible-event-name)
export const TRACKING_CLASSES = {
  // Newsletter
  NEWSLETTER_INPUT_FOCUS: asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS),
  NEWSLETTER_INLINE_INPUT_FOCUS: asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS),
  NEWSLETTER_BUTTON_CLICK: asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_BUTTON_CLICK),
  NEWSLETTER_INLINE_BUTTON_CLICK: asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK),

  // Navigation
  GITHUB_STAR_CLICK: asPlausibleClass(TRACKING_EVENTS.GITHUB_STAR_CLICK),
  SUGGEST_PATTERN_CLICK: asPlausibleClass(TRACKING_EVENTS.SUGGEST_PATTERN_CLICK),
  VIEW_PATTERN_CLICK: asPlausibleClass(TRACKING_EVENTS.VIEW_PATTERN_CLICK),
  GET_STARTED_CLICK: asPlausibleClass(TRACKING_EVENTS.GET_STARTED_CLICK),
  VIEW_GITHUB_CLICK: asPlausibleClass(TRACKING_EVENTS.VIEW_GITHUB_CLICK),

  // Footer
  FOOTER_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.FOOTER_LINK_CLICK),
  FOOTER_SOCIAL_CLICK: asPlausibleClass(TRACKING_EVENTS.FOOTER_SOCIAL_CLICK),

  // Sandbox
  SANDBOX_TAB_SWITCH: asPlausibleClass(TRACKING_EVENTS.SANDBOX_TAB_SWITCH),

  // Decision Flow
  DECISION_FLOW_DOWNLOAD: asPlausibleClass(TRACKING_EVENTS.DECISION_FLOW_DOWNLOAD),

  // External Links
  CANIUSE_LINK_CLICK: asPlausibleClass(TRACKING_EVENTS.CANIUSE_LINK_CLICK),

  // Pattern Navigation
  PATTERN_NEXT_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_NEXT_CLICK),
  PATTERN_PREV_CLICK: asPlausibleClass(TRACKING_EVENTS.PATTERN_PREV_CLICK),
} as const;

// Type for Plausible tracking function
export type PlausibleTracker = (
  event: string,
  options?: { props?: Record<string, string | number> }
) => void;

// Helper function to track newsletter events
export const trackNewsletterEvent = (
  plausible: PlausibleTracker,
  type: 'success' | 'error',
  variant: 'default' | 'inline' = 'default'
) => {
  const eventKey =
    variant === 'inline'
      ? type === 'success'
        ? 'NEWSLETTER_SUBSCRIBE_SUCCESS_INLINE'
        : 'NEWSLETTER_SUBSCRIBE_ERROR_INLINE'
      : type === 'success'
        ? 'NEWSLETTER_SUBSCRIBE_SUCCESS'
        : 'NEWSLETTER_SUBSCRIBE_ERROR';

  plausible(TRACKING_EVENTS[eventKey]);
};

// Helper function to track footer clicks
export const trackFooterClick = (
  plausible: PlausibleTracker,
  linkType: 'general' | 'resource' | 'social',
  linkLabel: string
) => {
  const eventName =
    linkType === 'social' ? TRACKING_EVENTS.FOOTER_SOCIAL_CLICK : TRACKING_EVENTS.FOOTER_LINK_CLICK;

  plausible(eventName, {
    props: {
      link_type: linkType,
      link_label: linkLabel,
    },
  });
};

// Helper function to track sandbox interactions
export const trackSandboxEvent = (
  plausible: PlausibleTracker,
  action: 'tab_switch' | 'code_edit',
  tabName?: string,
  additionalProps?: Record<string, string | number>
) => {
  if (action === 'tab_switch' && tabName) {
    plausible(TRACKING_EVENTS.SANDBOX_TAB_SWITCH, {
      props: { tab_name: tabName },
    });
  } else if (action === 'code_edit') {
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
  linkType: 'caniuse' | 'github' | 'social',
  url: string
) => {
  switch (linkType) {
    case 'caniuse':
      plausible(TRACKING_EVENTS.CANIUSE_LINK_CLICK, {
        props: { url },
      });
      break;
    // Add more external link types as needed
  }
};

// Legacy aliases for backward compatibility with existing dashboard queries
export const LEGACY_EVENTS = {
  NEWSLETTER_INPUT_FOCUS_INLINE: TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS,
  NEWSLETTER_BUTTON_CLICK_INLINE: TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK,
} as const;

// Helper function to get CSS class for tracking
export const getTrackingClass = (variant?: 'default' | 'inline') => {
  return {
    newsletterInputFocus:
      variant === 'inline'
        ? asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS)
        : asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS),

    newsletterButtonClick:
      variant === 'inline'
        ? asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_INLINE_BUTTON_CLICK)
        : asPlausibleClass(TRACKING_EVENTS.NEWSLETTER_BUTTON_CLICK),
  };
};
