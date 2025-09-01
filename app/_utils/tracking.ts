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
  NEWSLETTER_INPUT_FOCUS: 'Newsletter Input Focus',
  NEWSLETTER_INPUT_FOCUS_INLINE: 'Newsletter Input Focus Inline',
  NEWSLETTER_BUTTON_CLICK: 'Newsletter Button Click',
  NEWSLETTER_BUTTON_CLICK_INLINE: 'Newsletter Button Click Inline',

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

// CSS Class Names for auto-tracking (plausible-event-name)
export const TRACKING_CLASSES = {
  // Newsletter
  NEWSLETTER_INPUT_FOCUS: 'plausible-event-name=Newsletter+Input+Focus',
  NEWSLETTER_INPUT_FOCUS_INLINE: 'plausible-event-name=Newsletter+Inline+Input+Focus',
  NEWSLETTER_BUTTON_CLICK: 'plausible-event-name=Newsletter+Subscribe+Click',
  NEWSLETTER_BUTTON_CLICK_INLINE: 'plausible-event-name=Newsletter+Inline+Subscribe+Click',

  // Navigation
  GITHUB_STAR_CLICK: 'plausible-event-name=Star+Github',
  SUGGEST_PATTERN_CLICK: 'plausible-event-name=Suggest+Pattern',
  VIEW_PATTERN_CLICK: 'plausible-event-name=View+Pattern',
  GET_STARTED_CLICK: 'plausible-event-name=Get+Started',
  VIEW_GITHUB_CLICK: 'plausible-event-name=View+GitHub',

  // Footer
  FOOTER_LINK_CLICK: 'plausible-event-name=Footer+Link+Click',
  FOOTER_SOCIAL_CLICK: 'plausible-event-name=Footer+Social+Click',

  // Sandbox
  SANDBOX_TAB_SWITCH: 'plausible-event-name=Sandbox+Tab+Switch',

  // Decision Flow
  DECISION_FLOW_DOWNLOAD: 'plausible-event-name=Decision+Flow+Download',

  // External Links
  CANIUSE_LINK_CLICK: 'plausible-event-name=CanIUse+Link+Click',

  // Pattern Navigation
  PATTERN_NEXT_CLICK: 'plausible-event-name=Pattern+Next+Click',
  PATTERN_PREV_CLICK: 'plausible-event-name=Pattern+Prev+Click',
} as const;

// Type for Plausible tracking function
export type PlausibleTracker = (event: string, options?: { props?: Record<string, string | number> }) => void;

// Helper function to track newsletter events
export const trackNewsletterEvent = (
  plausible: PlausibleTracker,
  type: 'success' | 'error',
  variant: 'default' | 'inline' = 'default'
) => {
  const eventKey = variant === 'inline' 
    ? (type === 'success' ? 'NEWSLETTER_SUBSCRIBE_SUCCESS_INLINE' : 'NEWSLETTER_SUBSCRIBE_ERROR_INLINE')
    : (type === 'success' ? 'NEWSLETTER_SUBSCRIBE_SUCCESS' : 'NEWSLETTER_SUBSCRIBE_ERROR');
  
  plausible(TRACKING_EVENTS[eventKey]);
};

// Helper function to track footer clicks
export const trackFooterClick = (
  plausible: PlausibleTracker,
  linkType: 'general' | 'resource' | 'social',
  linkLabel: string
) => {
  const eventName = linkType === 'social' 
    ? TRACKING_EVENTS.FOOTER_SOCIAL_CLICK 
    : TRACKING_EVENTS.FOOTER_LINK_CLICK;
  
  plausible(eventName, {
    props: {
      link_type: linkType,
      link_label: linkLabel
    }
  });
};

// Helper function to track sandbox interactions
export const trackSandboxEvent = (
  plausible: PlausibleTracker,
  action: 'tab_switch' | 'code_edit',
  tabName?: string
) => {
  if (action === 'tab_switch' && tabName) {
    plausible(TRACKING_EVENTS.SANDBOX_TAB_SWITCH, {
      props: { tab_name: tabName }
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
        props: { url }
      });
      break;
    // Add more external link types as needed
  }
};

// Helper function to get CSS class for tracking
export const getTrackingClass = (variant?: 'default' | 'inline') => {
  return {
    newsletterInputFocus: variant === 'inline' 
      ? TRACKING_CLASSES.NEWSLETTER_INPUT_FOCUS_INLINE 
      : TRACKING_CLASSES.NEWSLETTER_INPUT_FOCUS,
    
    newsletterButtonClick: variant === 'inline'
      ? TRACKING_CLASSES.NEWSLETTER_BUTTON_CLICK_INLINE
      : TRACKING_CLASSES.NEWSLETTER_BUTTON_CLICK,
  };
};