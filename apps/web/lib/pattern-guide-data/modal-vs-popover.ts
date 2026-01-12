/**
 * Data for the modal-vs-popover pattern guide
 */

export const comparisonData = {
  patterns: [
    {
      title: "Modal",
      href: "/patterns/content-management/modal",
      criteria: [
        "Blocks all interactions",
        "Complex forms & wizards",
        "Critical confirmations",
        "Full mobile takeover",
      ],
    },
    {
      title: "Drawer",
      href: "/patterns/navigation/sidebar",
      criteria: [
        "Maintains page context",
        "Filters & settings panels",
        "Mobile-friendly slide-in",
        "Semi-persistent content",
      ],
    },
    {
      title: "Popover",
      href: "/patterns/content-management/popover",
      criteria: [
        "Contextual to element",
        "Menus & quick options",
        "Non-blocking interactions",
        "Dismissible on outside click",
      ],
    },
    {
      title: "Tooltip",
      href: "/patterns/content-management/tooltip",
      criteria: [
        "Brief help text only",
        "Hover/focus triggered",
        "Non-interactive content",
        "Minimal visual disruption",
      ],
    },
  ],
};
